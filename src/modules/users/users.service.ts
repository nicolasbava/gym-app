// import { SupabaseClient } from '@supabase/supabase-js'

// export class UsersService {
//   constructor(private supabase: SupabaseClient) {}

//   // async getRoutinesByGym(gymId: string) {
//   //   const { data, error } = await this.supabase
//   //     .from('routines')
//   //     .select(`
//   //       *,
//   //       created_by_user:users!created_by(name),
//   //       routine_exercises(
//   //         *,
//   //         exercise:exercises(*)
//   //       )
//   //     `)
//   //     .eq('gym_id', gymId)
//   //     .order('created_at', { ascending: false })

//   //   if (error) throw error
//   //   return data
//   // }

//   async createUser(userData: {
//     gym_id: string
//     name: string
//     description?: string
//     created_by: string
//     exercises: Array<{
//       exercise_id: string
//       order_index: number
//       sets?: number
//       reps?: string
//       rest_seconds?: number
//       notes?: string
//     }>
//   }) {
//     const { data: newUser, error: user  Error } = await this.supabase
//       .from('users')
//       .insert({
//         gym_id: userData.gym_id,
//         name: userData.name,
//         description: userData.description,
//         created_by: userData.created_by,
//       })
//       .select()
//       .single()

//     if (routineError) throw routineError

//     // Agregar ejercicios
//     const exercisesToInsert = routine.exercises.map(ex => ({
//       routine_id: newRoutine.id,
//       ...ex,
//     }))

//     const { error: exercisesError } = await this.supabase
//       .from('routine_exercises')
//       .insert(exercisesToInsert)

//     if (exercisesError) throw exercisesError

//     return newRoutine
//   }

//   async assignRoutineToUser(data: {
//     id: string
//     routine_id: string
//     assigned_by: string
//     start_date?: string
//     end_date?: string
//   }) {
//     const { data: assignment, error } = await this.supabase
//       .from('user_routines')
//       .insert({
//         ...data,
//         status: 'active',
//       })
//       .select()
//       .single()

//     if (error) throw error
//     return assignment
//   }

//   async getUserActiveRoutines(userId: string) {
//     const { data, error } = await this.supabase
//       .from('user_routines')
//       .select(`
//         *,
//         routine:routines(
//           *,
//           routine_exercises(
//             *,
//             exercise:exercises(*)
//           )
//         ),
//         assigned_by_user:users!assigned_by(name)
//       `)
//       .eq('id', userId)
//       .eq('status', 'active')

//     if (error) throw error
//     return data
//   }
// }
