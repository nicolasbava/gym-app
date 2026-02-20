'use server';
import { createClient } from '@/src/utils/supabase/server';
import { cookies } from 'next/headers';

export async function getProfilesByGymName(gymId: string, name: string = '', page: number = 0) {
    const limit = 6;
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);
    let query = supabase
        .from('profiles')
        .select('*')
        .eq('role', 'member')
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .range(page * limit, (page + 1) * limit - 1);

    if (gymId) {
        query = query.eq('gym_id', gymId);
    }

    if (name) {
        query = query.ilike('name', `%${name}%`);
    }

    const { data, error } = await query;

    if (error) {
        console.error(error);
        throw error;
    }

    return data;
}
