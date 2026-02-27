'use server';

import { createClient } from '@/src/utils/supabase/server';
import { cookies } from 'next/headers';

export async function uploadGymImage(gymId: string, file: File) {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    const extension = file.name.split('.').pop();
    const path = `gyms/${gymId}.${extension ?? 'jpg'}`;

    // Upload the gym logo to the bucket
    const { error } = await supabase.storage
        .from('images_bucket')
        .upload(path, file, { upsert: true });

    if (error) {
        console.error('Error uploading gym logo:', error);
        throw error;
    }

    // Update the gym logo url in the database
    await supabase.from('gyms').update({ logo_url: path }).eq('id', gymId);
}
