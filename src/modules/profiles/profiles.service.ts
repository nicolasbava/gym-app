
// /** Get the current user's gym_id (UUID) from profiles. Use this to pass a valid gymId to createMember. */
// export async function getMembersGymId(gymId: string): Promise<{ members: UserProfile[] | null; error?: string }> {
//   const cookieStore = await cookies()
//   console.log('gymId', gymId)
//   const supabase = await createClient(cookieStore)
//   try {
//     const { data: members } = await supabase
//       .from("profiles")
//       .select("user_id, name, email, phone")
//       .eq("role", "member")
//       .eq("gym_id", gymId)
//       .order("created_at", { ascending: false });
//     return { members: members ?? null }
//   } catch (error) {
//     console.error(error)
//     return { members: null, error: error instanceof Error ? error.message : "Error desconocido al obtener miembros" }
//   }
// }





import { SupabaseClient } from '@supabase/supabase-js'
import { Profile } from './profiles.schema'

export class ProfilesService {
  constructor(private supabase: SupabaseClient) {}

  // async getRoutinesByGym(gymId: string) {
  //   const { data, error } = await this.supabase
  //     .from('routines')
  //     .select(`
  //       *,
  //       created_by_user:users!created_by(name),
  //       routine_exercises(
  //         *,
  //         exercise:exercises(*)
  //       )
  //     `)
  //     .eq('gym_id', gymId)
  //     .order('created_at', { ascending: false })

  //   if (error) throw error
  //   return data
  // }

 
//   async assignRoutineToUser(data: {
//     user_id: string
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

  async getProfilesByGymId(gymId: string) {
      const { data, error } = await this.supabase
        .from('profiles')
        .select('*')
        .eq('gym_id', gymId)
        .eq('role', 'member')
        .order('created_at', { ascending: false })
      if (error) {
          console.error(error)
          throw error
      }
      console.log('>>> data:', data)
      return data
  }

  async getProfileById(id: string): Promise<Profile | null> {
    try {
      const { data, error } = await this.supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .eq('role', 'member')
        .order('created_at', { ascending: false })
        console.log('data profile:', data)
        return data as Profile | null
    } catch (error) {
      console.error('error getting profile by id:', error)
      throw error
    }
  }

}
