'use server';

import { createClient } from '@/src/utils/supabase/server';
import { cookies } from 'next/headers';

export async function uploadRoutineImage(file: File) {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    const extension = file.name.split('.').pop();
    const path = `routines/${file.name}.${crypto.randomUUID()}.${extension ?? 'jpg'}`;

    const { error } = await supabase.storage
        .from(process.env.NEXT_PUBLIC_BUCKET_NAME_IMAGES ?? '')
        .upload(path, file, { upsert: true });

    if (error) {
        console.error('Error uploading routine image:', error);
        throw error;
    }

    return path;
}
