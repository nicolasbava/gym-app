'use server';

import {
    createExerciseSchema,
    updateExerciseSchema,
    type CreateExercise,
    type UpdateExercise,
} from '@/src/modules/exercises/exercises.schema';
import { ExerciseService } from '@/src/modules/exercises/exercises.service';
import { uploadImagesExercises } from '@/src/modules/exercises/useUploadExImage';
import { createClient } from '@/src/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export async function createExercise(formData: CreateExercise) {
    const validationResult = createExerciseSchema.safeParse(formData);

    if (!validationResult.success) {
        return {
            error: validationResult.error.message || 'Error de validación',
            success: false,
            data: null,
        };
    }

    try {
        const cookieStore = await cookies();
        const supabase = await createClient(cookieStore);

        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
            return {
                error: 'No se pudo autenticar el usuario',
                success: false,
                data: null,
            };
        }

        const exerciseService = new ExerciseService(supabase);

        const exerciseData: CreateExercise = {
            name: validationResult.data.name,
            description: validationResult.data.description,
            created_by: user.id,
            muscle_group: validationResult.data.muscle_group,
            equipment: validationResult.data.equipment,
            images_url: validationResult.data.images_url,
        };

        console.log('>>>> exerciseData', exerciseData);

        
        const newExercise = await exerciseService.createExercise(exerciseData);
        revalidatePath('/trainer-dashboard');

        return {
            success: true,
            data: newExercise,
            error: null,
        };
    } catch (error) {
        console.error('Error creating exercise:', error);
        return {
            error: error instanceof Error ? error.message : 'Error desconocido al crear ejercicio',
            success: false,
            data: null,
        };
    }
}

/** Creates an exercise and uploads image files from FormData. Use this when the form includes new image files. */
export async function createExerciseWithImages(formData: FormData) {
    const name = (formData.get('name') as string) ?? '';
    const description = (formData.get('description') as string) ?? '';
    const muscle_group = (formData.get('muscle_group') as string) ?? '';
    const equipment = (formData.get('equipment') as string) ?? '';

    try {
        const cookieStore = await cookies();
        const supabase = await createClient(cookieStore);

        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
            return {
                error: 'No se pudo autenticar el usuario',
                success: false,
                data: null,
            };
        }

        const payload: CreateExercise = {
            name,
            description,
            muscle_group,
            equipment,
            created_by: user.id,
        };

        const validationResult = createExerciseSchema.safeParse(payload);

        if (!validationResult.success) {
            return {
                error: validationResult.error.message || 'Error de validación',
                success: false,
                data: null,
            };
        }

        const exerciseService = new ExerciseService(supabase);
        const newExercise = await exerciseService.createExercise(validationResult.data);

        const imageFiles = formData.getAll('images').filter((f): f is File => f instanceof File);
        if (newExercise?.id && imageFiles.length > 0) {
            await uploadImagesExercises(imageFiles);
            const refetched = await exerciseService.getExerciseById(newExercise.id);
            revalidatePath('/trainer-dashboard');
            revalidatePath('/exercises');
            return {
                success: true,
                data: refetched ?? newExercise,
                error: null,
            };
        }

        revalidatePath('/trainer-dashboard');
        revalidatePath('/exercises');

        return {
            success: true,
            data: newExercise,
            error: null,
        };
    } catch (error) {
        console.error('Error creating exercise with images:', error);
        return {
            error: error instanceof Error ? error.message : 'Error desconocido al crear ejercicio',
            success: false,
            data: null,
        };
    }
}

export async function getExercisesGymIdName(gymId: string, name: string = '', page: number = 0) {
    // TODO : Validate data from the form zod schema
    try {
        const cookieStore = await cookies();
        const supabase = await createClient(cookieStore);

        const limit = 6;

        let query = supabase
            .from('exercises')
            .select('*')
            .is('deleted_at', null)
            .order('name', { ascending: true })
            .limit(limit)
            .range(page * limit, (page + 1) * limit - 1);
        // .eq('gym_id', gymId) // TODO: add gym_id to the query

        // If name is provided, add the filter to the query
        if (name && name.trim().length > 0) {
            query = query.ilike('name', `%${name}%`);
        }

        const { data, error, count } = await query;

        if (error) {
            return {
                error: error.message,
                success: false,
                data: [],
                count: 0,
                hasMore: false,
            };
        }

        return {
            data: data,
            success: true,
            error: null,
            count: count || 0,
            hasMore: count && count > page * 20,
        };
    } catch (error) {
        console.error('Error getting exercises:', error);
        return {
            error:
                error instanceof Error ? error.message : 'Error desconocido al obtener ejercicios',
            success: false,
            data: [],
        };
    }
}

export async function getMuscleGroups() {
    // Lista de grupos musculares comunes
    return [
        'Pecho',
        'Espalda',
        'Hombros',
        'Brazos',
        'Piernas',
        'Glúteos',
        'Abdominales',
        'Cardio',
        'Full Body',
    ];
}

export async function getEquipmentTypes() {
    // Lista de equipos comunes
    return [
        'Mancuernas',
        'Barra',
        'Máquina',
        'Peso corporal',
        'Kettlebell',
        'Bandas de resistencia',
        'Cables/Poleas',
        'TRX',
        'Bicicleta',
        'Cinta de correr',
        'Otro',
    ];
}

export async function updateExercise(exerciseId: string, formData: UpdateExercise) {
    // Validar datos del formulario
    const validationResult = updateExerciseSchema.safeParse(formData);

    if (!validationResult.success) {
        return {
            error: validationResult.error.message || 'Error de validación',
            success: false,
            data: null,
        };
    }

    try {
        const cookieStore = await cookies();
        const supabase = await createClient(cookieStore);

        // Obtener usuario actual
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
            return {
                error: 'No se pudo autenticar el usuario',
                success: false,
                data: null,
            };
        }
        const exerciseService = new ExerciseService(supabase);

        const updatedExercise = await exerciseService.updateExercise(exerciseId, {
            name: validationResult.data.name,
            description: validationResult.data.description,
            muscle_group: validationResult.data.muscle_group,
            equipment: validationResult.data.equipment,
            created_by: user.id,
            images_url: validationResult.data.images_url,
        });

        revalidatePath('/trainer-dashboard');
        revalidatePath('/exercises');

        return {
            success: true,
            data: updatedExercise,
            error: null,
        };
    } catch (error) {
        console.error('Error updating exercise:', error);
        return {
            error:
                error instanceof Error
                    ? error.message
                    : 'Error desconocido al actualizar ejercicio',
            success: false,
            data: null,
        };
    }
}

export async function removeExerciseVideo(exerciseId: string) {
    try {
        const cookieStore = await cookies();
        const supabase = await createClient(cookieStore);

        const { data: exercise, error: fetchError } = await supabase
            .from('exercises')
            .select('mux_playback_id, mux_upload_id')
            .eq('id', exerciseId)
            .single();

        if (fetchError || !exercise) {
            return {
                success: false,
                error: 'Exercise not found',
                data: null,
            };
        }

        // Delete from Mux if we have a playback ID (asset is ready)
        if (exercise.mux_playback_id) {
            try {
                const Mux = (await import('@mux/mux-node')).default;
                const mux = new Mux({
                    tokenId: process.env.NEXT_PUBLIC_MUX_TOKEN_ID,
                    tokenSecret: process.env.NEXT_PUBLIC_MUX_TOKEN_SECRET,
                });

                const playbackInfo = await mux.video.playbackIds.retrieve(exercise.mux_playback_id);
                if (playbackInfo.object.type === 'asset') {
                    await mux.video.assets.delete(playbackInfo.object.id);
                }
            } catch (muxError) {
                console.error('Error deleting video from Mux:', muxError);
                return {
                    success: false,
                    error: 'Failed to delete video from Mux',
                    data: null,
                };
            }
        }

        const { data: updatedExercise, error: updateError } = await supabase
            .from('exercises')
            .update({
                mux_upload_id: null,
                mux_playback_id: null,
                mux_status: null,
            })
            .eq('id', exerciseId)
            .select()
            .single();

        if (updateError) {
            return {
                success: false,
                error: updateError.message,
                data: null,
            };
        }

        revalidatePath('/trainer-dashboard');
        revalidatePath('/exercises');

        return {
            success: true,
            data: updatedExercise,
            error: null,
        };
    } catch (error) {
        console.error('Error removing exercise video:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error whilst removing video',
            data: null,
        };
    }
}

export async function removeExerciseImage(exerciseId: string, imageUrl: string) {
    try {
        const cookieStore = await cookies();
        const supabase = await createClient(cookieStore);

        const { data: exercise, error: fetchError } = await supabase
            .from('exercises')
            .select('images_url')
            .eq('id', exerciseId)
            .single();

        if (fetchError || !exercise) {
            return {
                success: false,
                error: 'Exercise not found',
                data: null,
            };
        }

        const imagesUrl: string[] = Array.isArray(exercise.images_url) ? exercise.images_url : [];
        const updatedUrls = imagesUrl.filter((url) => url !== imageUrl);

        const { data: updatedExercise, error: updateError } = await supabase
            .from('exercises')
            .update({ images_url: updatedUrls })
            .eq('id', exerciseId)
            .select()
            .single();

        if (updateError) {
            return {
                success: false,
                error: updateError.message,
                data: null,
            };
        }

        revalidatePath('/trainer-dashboard');
        revalidatePath('/exercises');

        return {
            success: true,
            data: updatedExercise,
            error: null,
        };
    } catch (error) {
        console.error('Error removing exercise image:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error whilst removing image',
            data: null,
        };
    }
}

export async function setExerciseMuxUploadId(exerciseId: string, muxUploadId: string) {
    try {
        const cookieStore = await cookies();
        const supabase = await createClient(cookieStore);
        const { error } = await supabase
            .from('exercises')
            .update({ mux_upload_id: muxUploadId })
            .eq('id', exerciseId);
        if (error) {
            return { success: false, error: error.message };
        }
        return { success: true, error: null };
    } catch (error) {
        console.error('Error setting exercise mux upload id:', error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Error desconocido al actualizar ejercicio',
        };
    }
}

export async function deleteExercise(exerciseId: string) {
    try {
        const cookieStore = await cookies();
        const supabase = await createClient(cookieStore);
        const exerciseService = new ExerciseService(supabase);
        await exerciseService.deleteExercise(exerciseId);
    } catch (error) {
        console.error('Error deleting exercise:', error);
        return {
            error:
                error instanceof Error ? error.message : 'Error desconocido al eliminar ejercicio',
            success: false,
            data: null,
        };
    }
}
