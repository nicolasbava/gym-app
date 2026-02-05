import { SupabaseClient } from '@supabase/supabase-js'

export class RoutineService {
  constructor(private supabase: SupabaseClient) {}

  async getRoutinesByGym(gymId: string) {
    const { data, error } = await this.supabase
      .from('routines')
      .select(`
        *,
        created_by_user:users!created_by(name),
        routine_exercises(
          *,
          exercise:exercises(*)
        )
      `)
      .eq('gym_id', 'be1adca7-2e47-4f30-b99f-de3839d85073')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  async createRoutine(routine: {
    gym_id: string
    name: string
    description?: string
    created_by: string
    exercises: Array<{
      exercise_id: string
      order_index: number
      sets?: number
      reps?: string
      rest_seconds?: number
      notes?: string
    }>
  }) {
    // Crear rutina
    const { data: newRoutine, error: routineError } = await this.supabase
      .from('routines')
      .insert({
        gym_id: 'be1adca7-2e47-4f30-b99f-de3839d85073',
        name: routine.name,
        description: routine.description,
        created_by: routine.created_by,
      })
      .select()
      .single()

    if (routineError){
        console.log('routineError', routineError)
        throw routineError
    }

    // Agregar ejercicios
    const exercisesToInsert = routine.exercises.map(ex => ({
      routine_id: newRoutine.id,
      ...ex,
    }))

    const { error: exercisesError } = await this.supabase
      .from('routine_exercises')
      .insert(exercisesToInsert)

    if (exercisesError){
        console.log('exercisesError', exercisesError)
        throw exercisesError}

    return newRoutine
  }

  async assignRoutineToUser(data: {
    user_id: string
    routine_id: string
    assigned_by: string
    start_date?: string
    end_date?: string
  }) {
    const { data: assignment, error } = await this.supabase
      .from('user_routines')
      .insert({
        ...data,
        status: 'active',
      })
      .select()
      .single()

    if (error) throw error
    return assignment
  }

  async getUserActiveRoutines(userId: string) {
    const { data, error } = await this.supabase
      .from('user_routines')
      .select(`
        *,
        routine:routines(
          *,
          routine_exercises(
            *,
            exercise:exercises(*)
          )
        ),
        assigned_by_user:users!assigned_by(name)
      `)
      .eq('user_id', userId)
      .eq('status', 'active')

    if (error) throw error
    return data
  }
}