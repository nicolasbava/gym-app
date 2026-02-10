'use server';

import { navigationHelpers } from '@/src/lib/navigation';
import { createClient } from '@/src/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

async function getSiteUrl(): Promise<string> {
    // En producción, obtener la URL desde los headers
    const headersList = await headers();
    const host = headersList.get('host');
    const protocol = headersList.get('x-forwarded-proto') || 'https';

    if (host) {
        return `${protocol}://${host}`;
    }

    // Fallback a la variable de entorno si no hay headers (desarrollo local)
    return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
}

export async function signInWithGoogle() {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    const siteUrl = await getSiteUrl();
    const redirectTo = `${siteUrl}/auth/callback`;

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo,
        },
    });

    if (error) {
        throw error;
    }

    if (data.url) {
        redirect(data.url);
    }
}

export async function signOut() {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    const { error } = await supabase.auth.signOut();

    if (error) {
        throw error;
    }

    revalidatePath('/', 'layout');
    redirect(navigationHelpers.redirectAfterLogout());
}

export async function getSession() {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    const {
        data: { session },
    } = await supabase.auth.getSession();

    return session;
}

export async function getUser() {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    const {
        data: { user },
    } = await supabase.auth.getUser();

    return user;
}
