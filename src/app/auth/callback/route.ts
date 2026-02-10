import { ROUTES } from '@/src/config/routes';
import { createClient } from '@/src/utils/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const next = requestUrl.searchParams.get('next') ?? ROUTES.AFTER_LOGIN;

    if (code) {
        const cookieStore = await cookies();
        const supabase = await createClient(cookieStore);
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
            const redirectUrl = new URL(next, request.url);
            return NextResponse.redirect(redirectUrl);
        }
    }

    // Return the user to an error page with instructions
    return NextResponse.redirect(new URL('/auth?error=Could not authenticate user', request.url));
}
