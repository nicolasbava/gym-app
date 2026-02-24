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

export async function getImageUrl(imagePath: string) {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    const bucketName = process.env.NEXT_PUBLIC_BUCKET_NAME ?? '';
    const EXPIRES_IN_ONE_HOUR = 3600;

    const { data, error } = await supabase.storage
        .from(bucketName)
        .createSignedUrl(imagePath, EXPIRES_IN_ONE_HOUR);

    if (error) {
        console.error('Error getting exercise image url:', error);
        throw error;
    }

    return data.signedUrl;
}
