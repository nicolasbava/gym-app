'use server';
import { createClient } from '@/src/utils/supabase/server';
import { cookies } from 'next/headers';

export async function getProfilesByGymName(gymName: string, name: string = '') {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);
    let query = supabase
        .from('profiles')
        .select('*')
        .eq('role', 'member')
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

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
