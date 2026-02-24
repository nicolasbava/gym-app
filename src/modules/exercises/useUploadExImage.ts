'use server';

import { createClient } from '@/src/utils/supabase/server';
import { cookies } from 'next/headers';

export async function uploadExerciseImage(exerciseId: string, file: File) {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    const bucketName = process.env.NEXT_PUBLIC_BUCKET_NAME ?? '';

    const extension = file.name.split('.').pop();
    const path = `${bucketName}/${exerciseId}.${extension}`;

    const { error } = await supabase.storage.from(bucketName).upload(path, file, { upsert: true });

    if (error) {
        console.error('Error uploading exercise image:', error);
        throw error;
    }

    const {
        data: { publicUrl },
    } = supabase.storage.from(bucketName).getPublicUrl(path);

    await supabase
        .from('exercises')
        .update({ image_url: [publicUrl] })
        .eq('id', exerciseId);
}
