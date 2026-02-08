import { SupabaseClient } from '@supabase/supabase-js';
import { Profile, profileSchema } from './profiles.schema';

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

    async getProfilesByGymId(gymId: string) {
        const { data, error } = await this.supabase.from('profiles').select('*').eq('gym_id', gymId).eq('role', 'member').order('created_at', { ascending: false });
        if (error) {
            console.error(error);
            throw error;
        }
        console.log('>>> data:', data);
        return data;
    }

    async getProfileById(id: string): Promise<Profile | null> {
        try {
            const { data, error } = await this.supabase.from('profiles').select('*').eq('id', id).eq('role', 'member').order('created_at', { ascending: false });
            return data as Profile | null;
        } catch (error) {
            console.error('error getting profile by id:', error);
            throw error;
        }
    }

    async updateProfile(id: string, data: Profile) {
        if (!id) return console.error('id is required');
        if (!data) return console.error('data is required');
        const parsedData = profileSchema.safeParse(data);
        if (!parsedData.success) return console.error('data is invalid');
        try {
            const { data, error } = await this.supabase.from('profiles').update(parsedData.data).eq('id', id).eq('role', 'member').order('created_at', { ascending: false });
            return data as Profile | null;
        } catch (error) {
            console.error('error updating profile:', error);
            throw error;
        }
    }
}
