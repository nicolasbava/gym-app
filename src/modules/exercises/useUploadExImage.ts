'use server';

import { createClient } from '@/src/utils/supabase/server';
import { cookies } from 'next/headers';

function getUniquePath(file: File, index: number): string {
    const extension = file.name.split('.').pop() ?? 'jpg';
    const unique = `exercises/${Date.now()}-${index}`;
    return `${unique}.${extension}`;
}

export async function uploadImagesExercises(files: File[]): Promise<string[]> {
    if (files.length === 0) {
        return [];
    }

    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    const bucketName = process.env.NEXT_PUBLIC_BUCKET_NAME_IMAGES ?? '';
    const imagesPaths: string[] = [];

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const path = getUniquePath(file, i);

        const { error } = await supabase.storage
            .from(bucketName)
            .upload(path, file, { upsert: true });

        if (error) {
            console.error('Error uploading exercise image:', error);
            throw error;
        }

        imagesPaths.push(path);
    }

    return imagesPaths;
}
