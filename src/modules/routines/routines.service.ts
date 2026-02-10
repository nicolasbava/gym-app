import { SupabaseClient } from '@supabase/supabase-js';

export class RoutineService {
    constructor(private supabase: SupabaseClient) {}

    async getRoutinesByGym(gymId: string) {
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
      `
            )
            .eq('gym_id', gymId)
            .is('deleted_at', null)
            .order('created_at', { ascending: false });

        if (error) {
            console.log('error getRoutinesByGym', error);
            throw error;
        }

        // Filter out deleted exercises from the results
        if (data) {
            data.forEach((routine: any) => {
                if (routine.routine_exercises) {
                    routine.routine_exercises = routine.routine_exercises.filter((ex: any) => ex.deleted_at === null);
                }
            });
        }

        return data;
    }

    // async getRoutinesByGym(gymId: string): Promise<any[]> {
    //   const { data, error } = await this.supabase .from('routines') .select( *, created_by:users!created_by(name), routine_exercises( *, exercise:exercises(*) ) ) .order('created_at', { ascending: false });
    //   if (error) {
    //     // Puedes agregar más contexto al error si quieres
    //     throw error;
    //   }

    //   return data ?? [];
    // }
    async createRoutine(routine: {
        gym_id: string;
        name: string;
        description?: string;
        created_by: string;
        exercises: Array<{
            exercise_id: string;
            order_index: number;
            sets?: number;
            reps?: string;
            rest_seconds?: number;
            notes?: string;
        }>;
    }) {
        const { data: newRoutine, error: routineError } = await this.supabase
            .from('routines')
            .insert({
                gym_id: routine.gym_id,
                name: routine.name,
                description: routine.description,
                created_by: routine.created_by,
            })
            .select()
            .single();

        if (routineError) {
            console.log('routineError', routineError);
            throw routineError;
        }

        // Agregar ejercicios
        const exercisesToInsert = routine.exercises.map((ex) => ({
            routine_id: newRoutine.id,
            ...ex,
        }));

        const { error: exercisesError } = await this.supabase.from('routine_exercises').insert(exercisesToInsert);

        if (exercisesError) {
            console.log('exercisesError', exercisesError);
            throw exercisesError;
        }

        return newRoutine;
    }

    async assignRoutineToUser(data: { profile_id: string; routine_id: string; assigned_by: string; start_date?: string; end_date?: string }) {
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

    async getUserActiveRoutines(profileId: string) {
        console.log('GET USER ACTIVE ROUTINES', profileId);
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
        assigned_by:profiles!assigned_by(name)
      `
            )
            .eq('profile_id', profileId);
        // .eq('status', 'active');

        if (error) {
            console.log('error getUserActiveRoutines', error);
            throw error;
        }

        // Filter out deleted exercises from the results
        if (data) {
            data.forEach((assignment: any) => {
                if (assignment.exercises && assignment.exercises.routine_exercises) {
                    assignment.exercises.routine_exercises = assignment.exercises.routine_exercises.filter((ex: any) => ex.deleted_at === null);
                }
            });
        }

        return data;
    }

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
      `
            )
            .eq('id', id)
            .single();
        if (error) {
            console.log('error getRoutineById', error);
            throw error;
        }

        // Filter out deleted exercises from the results
        if (data && data.routine_exercises) {
            data.routine_exercises = data.routine_exercises.filter((ex: any) => ex.deleted_at === null);
        }

        console.log('data getRoutineById', data);
        return data;
    }

    // async updateRoutine(
    //     id: string,
    //     routine: {
    //         name: string;
    //         description?: string;
    //         exercises: Array<{
    //             exercise_id: string;
    //             order_index: number;
    //             sets?: number;
    //             reps?: string;
    //             rest_seconds?: number;
    //             notes?: string;
    //         }>;
    //     }
    // ) {
    //     // Update routine basic info
    //     const { data: updatedRoutine, error: routineError } = await this.supabase
    //         .from('routines')
    //         .update({
    //             name: routine.name,
    //             description: routine.description,
    //         })
    //         .eq('id', id)
    //         .select()
    //         .single();

    //     if (routineError) {
    //         console.log('routineError', routineError);
    //         throw routineError;
    //     }

    //     // Soft delete existing exercises
    //     const { error: deleteExercisesError } = await this.supabase
    //         .from('routine_exercises')
    //         .update({ deleted_at: new Date().toISOString() })
    //         .eq('routine_id', id)
    //         .is('deleted_at', null);

    //     if (deleteExercisesError) {
    //         console.log('deleteExercisesError', deleteExercisesError);
    //         throw deleteExercisesError;
    //     }

    //     // Insert new exercises
    //     const exercisesToInsert = routine.exercises.map((ex) => ({
    //         routine_id: id,
    //         ...ex,
    //     }));

    //     const { error: exercisesError } = await this.supabase.from('routine_exercises').insert(exercisesToInsert);

    //     if (exercisesError) {
    //         console.log('exercisesError', exercisesError);
    //         throw exercisesError;
    //     }

    //     return updatedRoutine;
    // }

    async updateRoutine(
        id: string,
        routine: {
            name: string;
            description?: string;
            exercises: Array<{
                exercise_id: string;
                order_index: number;
                sets?: number;
                reps?: string;
                rest_seconds?: number;
                notes?: string;
            }>;
        }
    ) {
        // Update routine basic info
        const { data: updatedRoutine, error: routineError } = await this.supabase
            .from('routines')
            .update({
                name: routine.name,
                description: routine.description,
            })
            .eq('id', id)
            .select()
            .single();

        if (routineError) {
            console.log('routineError', routineError);
            throw routineError;
        }

        // Get existing exercises (not deleted)
        const { data: existingExercises, error: fetchError } = await this.supabase
            .from('routine_exercises')
            .select('id, exercise_id, order_index, sets, reps, rest_seconds, notes')
            .eq('routine_id', id)
            .is('deleted_at', null)
            .order('order_index', { ascending: true });

        if (fetchError) {
            console.log('fetchError', fetchError);
            throw fetchError;
        }

        // Normalize exercises for comparison (convert sets and rest_seconds to numbers, handle string reps)
        const normalizeExercise = (ex: {
            exercise_id: string;
            order_index: number;
            sets?: number | string;
            reps?: string;
            rest_seconds?: number | string;
            notes?: string;
        }) => ({
            exercise_id: ex.exercise_id,
            order_index: ex.order_index,
            sets: typeof ex.sets === 'string' ? parseInt(ex.sets) || 0 : ex.sets || 0,
            reps: ex.reps || '',
            rest_seconds: typeof ex.rest_seconds === 'string' ? parseInt(ex.rest_seconds) || 0 : ex.rest_seconds || 0,
            notes: ex.notes || '',
        });

        const normalizedExisting = (existingExercises || []).map(normalizeExercise);
        const normalizedNew = routine.exercises.map(normalizeExercise);

        // Compare exercises to see if they changed
        const exercisesChanged =
            normalizedExisting.length !== normalizedNew.length ||
            normalizedExisting.some((existing, index) => {
                const newEx = normalizedNew[index];
                if (!newEx) return true;
                return (
                    existing.exercise_id !== newEx.exercise_id ||
                    existing.sets !== newEx.sets ||
                    existing.reps !== newEx.reps ||
                    existing.rest_seconds !== newEx.rest_seconds ||
                    existing.notes !== newEx.notes ||
                    existing.order_index !== newEx.order_index
                );
            });

        // Only update exercises if they actually changed
        if (exercisesChanged) {
            console.log('Exercises changed, updating...');
            console.log('Existing exercises count:', normalizedExisting.length);
            console.log('New exercises count:', normalizedNew.length);

            // Soft delete ALL existing exercises for this routine
            // Remove the .is('deleted_at', null) filter to ensure we delete ALL exercises, even if some were previously soft-deleted
            const deletedAt = new Date().toISOString();
            const { data: deletedData, error: deleteExercisesError } = await this.supabase
                .from('routine_exercises')
                .update({ deleted_at: deletedAt })
                .eq('routine_id', id)
                .select();

            if (deleteExercisesError) {
                console.log('deleteExercisesError', deleteExercisesError);
                throw deleteExercisesError;
            }

            console.log('Deleted exercises:', deletedData?.length || 0);

            // Wait a bit to ensure the delete operation completes before inserting
            // This prevents race conditions
            await new Promise((resolve) => setTimeout(resolve, 100));

            // Insert new exercises only if there are any
            if (routine.exercises.length > 0) {
                const exercisesToInsert = routine.exercises.map((ex) => ({
                    routine_id: id,
                    exercise_id: ex.exercise_id,
                    order_index: ex.order_index,
                    sets: ex.sets,
                    reps: ex.reps,
                    rest_seconds: ex.rest_seconds,
                    notes: ex.notes || '',
                }));

                console.log('Inserting exercises:', exercisesToInsert.length);
                const { error: exercisesError } = await this.supabase.from('routine_exercises').insert(exercisesToInsert);

                if (exercisesError) {
                    console.log('exercisesError', exercisesError);
                    throw exercisesError;
                }
            }
        } else {
            console.log('Exercises did not change, skipping update');
        }

        return updatedRoutine;
    }

    async deleteRoutine(id: string) {
        // soft deleting the routine
        console.log('>>> SHOOT DELETE ROUTINE', id);
        const { data, error } = await this.supabase.from('routines').update({ deleted_at: new Date().toISOString() }).eq('id', id);
        if (error) {
            console.log('error deleteRoutine', error);
            throw error;
        }
        // soft deleting the routine_exercises item
        const { error: routineExercisesError } = await this.supabase
            .from('routine_exercises')
            .update({ deleted_at: new Date().toISOString() })
            .eq('routine_id', id);
        if (routineExercisesError) {
            console.log('error deleteRoutineExercises', routineExercisesError);
            throw routineExercisesError;
        }
        return data;
    }
}
