'use server';

import { createClient } from '@/src/utils/supabase/server';
import { cookies } from 'next/headers';

/**
 * Get the image url from the image path in the bucket
 * stored in Supabase Storage
 * Database Stores the path of the image
 * @param imagePath - The path of the image in the bucket
 * @returns The image url
 */

export async function getImageUrl(imagePath: string): Promise<string | null> {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    const bucketName = process.env.NEXT_PUBLIC_BUCKET_NAME_IMAGES ?? '';
    const EXPIRES_IN_ONE_HOUR = 3600;

    const { data, error } = await supabase.storage
        .from(bucketName)
        .createSignedUrl(imagePath, EXPIRES_IN_ONE_HOUR);

    if (error) {
        // @ts-ignore
        if (error.statusCode === 404) {
            return null;
        }
        console.error('Error getting image signed url:', error);
        return null;
    }

    return data.signedUrl;
}

export async function getImageUrls(imagePaths: string[]): Promise<(string | null)[]> {
    if (imagePaths.length === 0) return [];
    const urls = await Promise.all(imagePaths.map((path) => getImageUrl(path)));

    return urls;
}
