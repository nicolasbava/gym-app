import { SupabaseClient } from '@supabase/supabase-js';
import { updateRoutineSchema } from './routines.schema';

export class RoutineService {
    constructor(private supabase: SupabaseClient) {}

    async getRoutinesByGym(gymId: string, name: string) {
        let query = this.supabase
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
            .eq('gym_id', gymId)
            .is('deleted_at', null)
            .order('created_at', { ascending: false });

        if (name) {
            console.log('name', name);
            query = query.ilike('name', `%${name}%`);
        }

        const { data, error } = await query;

        if (error) {
            console.log('error getRoutinesByGym', error);
            throw error;
        }

        return data;
    }

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

        const { error: exercisesError } = await this.supabase
            .from('routine_exercises')
            .insert(exercisesToInsert);

        if (exercisesError) {
            console.log('exercisesError', exercisesError);
            throw exercisesError;
        }

        return newRoutine;
    }

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
        assigned_by:profiles!assigned_by(name)
      `,
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
                    assignment.exercises.routine_exercises =
                        assignment.exercises.routine_exercises.filter(
                            (ex: any) => ex.deleted_at === null,
                        );
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

        console.log('data getRoutineById', data);
        return data;
    }

    async updateRoutine(routine: {
        id: string;
        name: string;
        description?: string;
        updated_at: string;
        exercises: Array<{
            exercise_id: string;
            order_index: number;
            sets?: number;
            reps?: string;
            rest_seconds?: number;
            notes?: string;
        }>;
    }) {
        console.log('routine', routine);
        // Parse routine with exercises zod schema
        const parsedRoutine = updateRoutineSchema.safeParse(routine);

        if (!parsedRoutine.success) {
            console.log('parsedRoutine', parsedRoutine.error);
            throw new Error('Invalid routine');
        }

        // Update routine basic info
        const { data: updatedRoutine, error: routineError } = await this.supabase
            .from('routines')
            .update({
                name: parsedRoutine.data.name,
                description: parsedRoutine.data.description,
            })
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

        // console.log('updatedRoutine.exercises', updatedRoutine.exercises);
        // console.log('parsedRoutine', parsedRoutine);

        // if (updatedRoutine.exercises && updatedRoutine.exercises.length > 0) {
        //     const { error: insertError } = await this.supabase.from('routine_exercises').insert(
        //         updatedRoutine.exercises.map((exercise: any, index: number) => ({
        //             routine_id: routine.id,
        //             exercise_id: exercise.id,
        //             order: index,
        //             sets: exercise.sets,
        //             reps: exercise.reps,
        //         })),
        //     );

        //     if (insertError) {
        //         console.log('insertError', insertError);
        //         throw insertError;
        //     }
        // }

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

    async deleteRoutine(id: string) {
        // soft deleting the routine
        const { data, error } = await this.supabase
            .from('routines')
            .update({ deleted_at: new Date().toISOString() })
            .eq('id', id);
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
