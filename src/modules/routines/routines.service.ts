import { getImageUrl } from '@/src/app/actions/images';
import { SupabaseClient } from '@supabase/supabase-js';
import {
    CreateRoutineInput,
    type RoutineExercise,
    UpdateRoutine,
    updateRoutineSchema,
} from './routines.schema';

export class RoutineService {
    constructor(private supabase: SupabaseClient) {}

    /**
     * Get routines by gym
     * @param gymId - The gym id
     * @param name - The name of the routine
     * @param page - The page number
     * @param limit - The limit of the routines
     * @returns The routines
     */
    async getRoutinesByGym(gymId: string, name: string, page: number = 0, limit: number = 6) {
        let query = this.supabase
            .from('routines')
            .select(
                `
                *,
                routine_exercises(
                *,
                exercise:exercises(*)
                )
            `,
            )
            .eq('gym_id', gymId)
            .is('deleted_at', null)
            .order('created_at', { ascending: false })
            .range(page * limit, (page + 1) * limit - 1);

        if (name) {
            console.log('name', name);
            query = query.ilike('name', `%${name}%`);
        }

        const { data, error } = await query;

        // Generate signed URLs for routines with images
        if (!data) return [];

        const routinesWithSignedUrls = await Promise.all(
            data.map(async (routine) => {
                if (!routine.image_url) return routine;

                const { data: signedData, error: signedError } = await this.supabase.storage
                    .from(process.env.NEXT_PUBLIC_BUCKET_NAME_IMAGES ?? '')
                    .createSignedUrl(routine.image_url, 60 * 60); // 1 hour expiry

                if (signedError || !signedData) return routine;

                return { ...routine, image_url: signedData.signedUrl };
            }),
        );

        if (error) {
            console.log('error getRoutinesByGym', error);
            throw error;
        }

        return routinesWithSignedUrls;
    }

    /**
     * Create a new routine
     * @param routine - The routine data
     * @returns The new routine
     */
    async createRoutine(routine: CreateRoutineInput) {
        const { data: newRoutine, error: routineError } = await this.supabase
            .from('routines')
            .insert({
                gym_id: routine.gym_id,
                name: routine.name,
                description: routine.description,
                created_by: routine.created_by,
                image_url: routine.image_url,
            })
            .select()
            .single();

        if (routineError) {
            console.log('routineError', routineError);
            throw routineError;
        }

        // Agregar ejercicios
        const exercisesToInsert = routine.exercises.map((ex: RoutineExercise) => ({
            routine_id: newRoutine.id,
            ...ex,
        }));

        const { error: exercisesError } = await this.supabase
            .from('routine_exercises')
            .insert(exercisesToInsert);

        if (exercisesError) {
            console.log('exercisesError', exercisesError);
            throw exercisesError;
        }

        return newRoutine;
    }

    /**
     * Assign a routine to a user
     * @param data - The data to assign the routine to the user
     * @returns The assigned routine
     */
    async assignRoutineToUser(data: {
        profile_id: string;
        routine_id: string;
        assigned_by: string;
        start_date?: string;
        end_date?: string;
    }) {
        const { data: assignment, error } = await this.supabase
            .from('profile_routines')
            .insert({
                profile_id: data.profile_id,
                routine_id: data.routine_id,
                assigned_by: data.assigned_by,
                start_date: data.start_date,
                end_date: data.end_date,
                status: 'active',
            })
            .select()
            .single();

        if (error) throw error;
        return assignment;
    }

    /**
     * Get the active routines for a user
     * @param profileId - The profile id
     * @returns The active routines
     */
    async getUserActiveRoutines(profileId: string) {
        const { data, error } = await this.supabase
            .from('profile_routines')
            .select(
                `
        *,
        exercises:routines(
          *,
          routine_exercises(
            *,
            exercise:exercises(*)
          )
        ),
        routine:routines(*),
        assigned_by:profiles!assigned_by(name)
      `,
            )
            .eq('profile_id', profileId)
            .eq('status', 'active')
            .is('deleted_at', null);

        if (error) {
            console.log('error getUserActiveRoutines', error);
            throw error;
        }

        for (const routine of data) {
            if (!routine.routine.image_url) {
                continue;
            }

            const imageUrl = await getImageUrl(routine.routine.image_url);
            routine.routine.image_url = imageUrl;
        }

        console.log('data getUserActiveRoutines', JSON.stringify(data, null, 2));

        return data;
    }

    /**
     * Get a routine by id
     * @param id - The id of the routine
     * @returns The routine
     */
    async getRoutineById(id: string) {
        const { data, error } = await this.supabase
            .from('routines')
            .select(
                `       
        *,
        created_by:profiles!created_by(name),
        routine_exercises(
          *,
          exercise:exercises(*)
        )
      `,
            )
            .eq('id', id)
            .single();
        if (error) {
            console.log('error getRoutineById', error);
            throw error;
        }

        // Filter out deleted exercises from the results
        if (data && data.routine_exercises) {
            data.routine_exercises = data.routine_exercises.filter(
                (ex: any) => ex.deleted_at === null,
            );
        }

        if (data?.routine_exercises) {
            const bucketName = process.env.NEXT_PUBLIC_BUCKET_NAME_IMAGES ?? '';

            data.routine_exercises = await Promise.all(
                data.routine_exercises.map(async (re: any) => {
                    const paths = re.exercise?.images_url ?? [];
                    if (paths.length === 0) {
                        return re;
                    }

                    const signedUrls = await Promise.all(
                        paths.map(async (path: string) => {
                            const { data: signed } = await this.supabase.storage
                                .from(bucketName)
                                .createSignedUrl(path, 3600);
                            return signed?.signedUrl ?? null;
                        }),
                    );

                    return {
                        ...re,
                        exercise: {
                            ...re.exercise,
                            images_url: signedUrls.filter((url: string | null) => url !== null),
                        },
                    };
                }),
            );
        }

        return data;
    }

    /**
     * Update a routine
     * @param routine - The routine data
     * @returns The updated routine
     */
    async updateRoutine(routine: UpdateRoutine) {
        // Parse routine with exercises zod schema
        const parsedRoutine = updateRoutineSchema.safeParse(routine);

        if (!parsedRoutine.success) {
            console.log('parsedRoutine', parsedRoutine.error);
            throw new Error('Invalid routine');
        }

        const routineData = {
            name: parsedRoutine.data.name,
            description: parsedRoutine.data.description,
            image_url: parsedRoutine.data.image_url,
            updated_at: new Date().toISOString(),
        };

        // Update routine basic info
        const { data: updatedRoutine, error: routineError } = await this.supabase
            .from('routines')
            .update(routineData)
            .eq('id', parsedRoutine.data.id)
            .select()
            .single();

        if (routineError) {
            console.log('routineError', routineError);
            throw routineError;
        }

        // Delete existing exercises routine relationships
        const { error: deleteError, data: deletedExercises } = await this.supabase
            .from('routine_exercises')
            .delete()
            .eq('routine_id', parsedRoutine.data.id);

        if (deleteError) {
            console.log('deleteError', deleteError);
            throw deleteError;
        }

        const exercisesToInsert = parsedRoutine.data.exercises.map((ex) => ({
            routine_id: parsedRoutine.data.id,
            ...ex,
        }));

        const { error: exercisesError } = await this.supabase
            .from('routine_exercises')
            .insert(exercisesToInsert);

        if (exercisesError) {
            console.log('exercisesError', exercisesError);
            throw exercisesError;
        }

        console.log('updatedRoutine', updatedRoutine);
        return updatedRoutine;
    }

    /**
     * Delete a routine
     * @param id - The id of the routine
     * @returns The deleted routine
     */
    async deleteRoutine(id: string) {
        // soft delete the routine
        const { data, error } = await this.supabase
            .from('routines')
            .update({ deleted_at: new Date().toISOString() })
            .eq('id', id);

        if (error) {
            console.log('error deleteRoutine', error);
            throw error;
        }

        // soft delete the routine_exercises
        const { error: routineExercisesError } = await this.supabase
            .from('routine_exercises')
            .update({ deleted_at: new Date().toISOString() })
            .eq('routine_id', id);

        if (routineExercisesError) {
            console.log('error deleteRoutineExercises', routineExercisesError);
            throw routineExercisesError;
        }

        // mark all profile_routines as deleted
        const { error: profileRoutinesError } = await this.supabase
            .from('profile_routines')
            .update({ status: 'deleted' })
            .eq('routine_id', id);

        if (profileRoutinesError) {
            console.log('error deleteProfileRoutines', profileRoutinesError);
            throw profileRoutinesError;
        }

        return data;
    }
}
