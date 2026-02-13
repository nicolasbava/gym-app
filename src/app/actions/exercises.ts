'use server';

import {
    createExerciseSchema,
    updateExerciseSchema,
    type CreateExercise,
    type UpdateExercise,
} from '@/src/modules/exercises/exercises.schema';
import { ExerciseService } from '@/src/modules/exercises/exercises.service';
import { createClient } from '@/src/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export async function createExercise(formData: CreateExercise) {
    // Validar datos del formulario
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

        // Crear ejercicio usando el servicio
        const exerciseData: any = {
            name: validationResult.data.name,
            description: validationResult.data.description,
            created_by: user.id,
            // video_url: validationResult.data.video_url,
            // muscle_group: validationResult.data.muscle_group,
            // equipment_needed: validationResult.data.equipment_needed,
            // is_global: validationResult.data.is_global,
        };

        // // Solo agregar gym_id si existe y es un número válido (no UUID)
        // if (validationResult.data.gym_id) {
        //   const gymId = validationResult.data.gym_id
        //   // Verificar si es un número (no UUID) - los UUIDs tienen guiones
        //   if (!gymId.includes('-')) {
        //     const numValue = parseInt(gymId, 10)
        //     if (!isNaN(numValue) && gymId === String(numValue)) {
        //       exerciseData.gym_id = gymId
        //     }
        //   }
        //   // Si es UUID o no es número válido, no lo agregamos
        // }

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

export async function getExercisesGymIdName(gymId: string, name: string = '') {
    // TODO : Validate data from the form zod schema
    try {
        const cookieStore = await cookies();
        const supabase = await createClient(cookieStore);

        let query = supabase
            .from('exercises')
            .select('*')
            .is('deleted_at', null)
            .order('name', { ascending: true })
            .limit(20);
        // .eq('gym_id', gymId) // TODO: add gym_id to the query

        // If name is provided, add the filter to the query
        if (name && name.trim().length > 0) {
            query = query.ilike('name', `%${name}%`);
        }

        const { data, error } = await query;

        if (error) {
            console.log('>>> error:', error);
            return {
                error: error.message,
                success: false,
                data: [],
            };
        }

        return {
            data: data,
            success: true,
            error: null,
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

        // Actualizar ejercicio usando el servicio
        const updatedExercise = await exerciseService.updateExercise(exerciseId, {
            name: validationResult.data.name,
            description: validationResult.data.description,
            muscle_group: validationResult.data.muscle_group,
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
