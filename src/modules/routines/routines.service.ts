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
            .order('created_at', { ascending: false });

        if (error) throw error;
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
        console.log('>>> routine:', routine);
        // Crear rutina
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
        routine:routines(
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
        return data;
    }
}
