import { createClient } from '@/src/utils/supabase/proxy';
import { NextResponse, type NextRequest } from 'next/server';
import { ROUTES } from './src/config/routes';

export async function middleware(request: NextRequest) {
    const { supabase, response } = createClient(request);

    // Refresh session if expired - required for Server Components
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const pathname = request.nextUrl.pathname;

    // Public routes that don't require authentication
    const publicRoutes = ['/', '/auth'];
    const isPublicRoute = publicRoutes.includes(pathname) || pathname.startsWith('/auth');

    // Protect routes that require authentication
    if (!user && !isPublicRoute) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = '/auth';
        redirectUrl.searchParams.set('redirectTo', pathname);
        return NextResponse.redirect(redirectUrl);
    }

    // Redirect authenticated users away from auth pages (except callback)
    if (user && pathname.startsWith('/auth') && !pathname.startsWith('/auth/callback')) {
        return NextResponse.redirect(new URL(ROUTES.AFTER_LOGIN, request.url));
    }

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
