import { createClient } from '@/src/utils/supabase/proxy';
import { NextResponse, type NextRequest } from 'next/server';
import { ROUTES, getRouteConfig, isPublicRoute, requiresAuth, isAuthOnlyRoute, hasRequiredRole } from './src/config/routes';
import type { UserRole } from './src/config/routes';

export async function middleware(request: NextRequest) {
    const { supabase, response } = createClient(request);

    // Refresh session if expired - required for Server Components
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const pathname = request.nextUrl.pathname;

    // Get route configuration
    const routeConfig = getRouteConfig(pathname);

    // If route is public, allow access
    if (isPublicRoute(pathname)) {
        return response;
    }

    // Handle auth-only routes (redirect authenticated users away)
    if (isAuthOnlyRoute(pathname)) {
        if (user) {
            const redirectTo = routeConfig?.redirectTo || ROUTES.AFTER_LOGIN;
            return NextResponse.redirect(new URL(redirectTo, request.url));
        }
        return response;
    }

    // Handle protected routes
    if (requiresAuth(pathname)) {
        // Check if user is authenticated
        if (!user) {
            const redirectUrl = request.nextUrl.clone();
            redirectUrl.pathname = ROUTES.LOGIN;
            redirectUrl.searchParams.set('redirectTo', pathname);
            return NextResponse.redirect(redirectUrl);
        }

        // Check role-based access if route has role requirements
        if (routeConfig?.allowedRoles && routeConfig.allowedRoles.length > 0) {
            // Fetch user profile to check role
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .maybeSingle();

            const userRole = profile?.role as UserRole | undefined;

            // Check if user has required role
            if (!hasRequiredRole(userRole, pathname)) {
                // User doesn't have required role, redirect to appropriate page
                const redirectUrl = new URL(ROUTES.AFTER_LOGIN, request.url);
                return NextResponse.redirect(redirectUrl);
            }
        }
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
