'use server';

import { createClient } from '@/src/utils/supabase/server';
import { cookies } from 'next/headers';

export async function uploadRoutineImage(routineId: string, file: File) {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    const extension = file.name.split('.').pop();
    const path = `routines/${routineId}.${extension ?? 'jpg'}`;

    const { error } = await supabase.storage
        .from('images_bucket')
        .upload(path, file, { upsert: true });

    if (error) {
        console.error('Error uploading routine image:', error);
        throw error;
    }

    // const {
    //     data: { publicUrl },
    // } = supabase.storage.from('images_bucket').getPublicUrl(path);

    await supabase.from('routines').update({ image_url: path }).eq('id', routineId);
}
