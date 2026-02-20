'use client';

import type { UserRole } from '@/src/config/routes';
import { getRouteConfig, requiresAuth } from '@/src/config/routes';
import { useApp } from '@/src/contexts/AppContext';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Hook to access authentication state and user information
 */
export function useAuth() {
    const context = useApp();
    return {
        user: context.user,
        session: context.session,
        userProfile: context.userProfile,
        isAuthenticated: context.isAuthenticated,
        isLoading: context.userLoading || context.sessionLoading || context.userProfileLoading,
        userRole: context.userRole,
        hasRole: context.hasRole,
        hasAnyRole: context.hasAnyRole,
        isCoach: context.isCoach,
        isCoachAdmin: context.isCoachAdmin,
        isMember: context.isMember,
        canAccess: context.canAccess,
        refetchSession: context.refetchSession,
        refetchUser: context.refetchUser,
        refetchUserProfile: context.refetchUserProfile,
        clear: context.clear,
    };
}

/**
 * Hook that redirects if user is not authenticated
 */
export function useRequireAuth() {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            const redirectTo = `/auth`;
            router.push(redirectTo);
        }
    }, [isAuthenticated, isLoading, router, pathname]);

    return useAuth();
}

/**
 * Hook that redirects if user doesn't have required role(s)
 */
export function useRequireRole(allowedRoles: UserRole[]) {
    const auth = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!auth.isLoading && auth.isAuthenticated) {
            if (!auth.canAccess(allowedRoles)) {
                // User doesn't have required role, redirect to home
                router.push('/');
            }
        }
    }, [auth.isLoading, auth.isAuthenticated, auth.canAccess, allowedRoles, router, pathname]);

    return auth;
}

/**
 * Hook that checks if current route requires authentication
 */
export function useRouteAuth() {
    const auth = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    const routeConfig = getRouteConfig(pathname);
    const routeRequiresAuth = requiresAuth(pathname);
    const hasAccess = routeConfig?.allowedRoles ? auth.canAccess(routeConfig.allowedRoles) : true;

    useEffect(() => {
        if (!auth.isLoading) {
            // If route requires auth but user is not authenticated
            if (routeRequiresAuth && !auth.isAuthenticated) {
                const redirectTo = `/auth?redirectTo=${encodeURIComponent(pathname)}`;
                router.push(redirectTo);
                return;
            }

            // If route has role requirements and user doesn't have access
            if (routeRequiresAuth && routeConfig?.allowedRoles && !hasAccess) {
                router.push('/');
                return;
            }
        }
    }, [
        auth.isLoading,
        auth.isAuthenticated,
        routeRequiresAuth,
        hasAccess,
        router,
        pathname,
        routeConfig,
    ]);

    return {
        ...auth,
        routeRequiresAuth,
        hasAccess,
        isLoading: auth.isLoading,
    };
}

/**
 * Hook to get session state
 */
export function useSession() {
    const { session, refetchSession } = useAuth();
    const context = useApp();
    return {
        session,
        isLoading: context.sessionLoading,
        refetchSession,
    };
}
