'use client';

import { useAuth } from '@/src/hooks/useAuth';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { getRouteConfig, requiresAuth } from '@/src/config/routes';
import type { UserRole } from '@/src/config/routes';

interface ProtectedRouteProps {
    children: ReactNode;
    allowedRoles?: UserRole[];
    fallback?: ReactNode;
    redirectTo?: string;
}

/**
 * Component that protects routes based on authentication and roles
 * This is a client-side backup to the middleware protection
 */
export function ProtectedRoute({ children, allowedRoles, fallback, redirectTo }: ProtectedRouteProps) {
    const auth = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    const routeConfig = getRouteConfig(pathname);
    const routeRequiresAuth = requiresAuth(pathname);
    const requiredRoles = allowedRoles || routeConfig?.allowedRoles;

    useEffect(() => {
        if (auth.isLoading) {
            return;
        }

        // Check authentication
        if (routeRequiresAuth && !auth.isAuthenticated) {
            const redirectUrl = redirectTo || `/auth?redirectTo=${encodeURIComponent(pathname)}`;
            router.push(redirectUrl);
            return;
        }

        // Check role-based access
        if (requiredRoles && requiredRoles.length > 0) {
            if (!auth.canAccess(requiredRoles)) {
                const redirectUrl = redirectTo || '/';
                router.push(redirectUrl);
                return;
            }
        }
    }, [auth.isLoading, auth.isAuthenticated, auth.canAccess, routeRequiresAuth, requiredRoles, router, pathname, redirectTo]);

    // Show loading state
    if (auth.isLoading) {
        return (
            fallback || (
                <div className="flex items-center justify-center min-h-[calc(100vh-150px)]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Cargando...</p>
                    </div>
                </div>
            )
        );
    }

    // Don't render if not authenticated and route requires auth
    if (routeRequiresAuth && !auth.isAuthenticated) {
        return null;
    }

    // Don't render if user doesn't have required role
    if (requiredRoles && requiredRoles.length > 0 && !auth.canAccess(requiredRoles)) {
        return null;
    }

    return <>{children}</>;
}

/**
 * Component that protects routes based on roles only (assumes authentication is handled elsewhere)
 */
export function RoleProtectedRoute({ children, allowedRoles, fallback }: Omit<ProtectedRouteProps, 'redirectTo'>) {
    const auth = useAuth();

    if (auth.isLoading) {
        return (
            fallback || (
                <div className="flex items-center justify-center min-h-[calc(100vh-150px)]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Cargando...</p>
                    </div>
                </div>
            )
        );
    }

    if (!allowedRoles || allowedRoles.length === 0) {
        return <>{children}</>;
    }

    if (!auth.canAccess(allowedRoles)) {
        return (
            fallback || (
                <div className="flex items-center justify-center min-h-[calc(100vh-150px)]">
                    <div className="text-center">
                        <h2 className="text-xl font-semibold mb-2">Acceso denegado</h2>
                        <p className="text-gray-600">No tienes permisos para acceder a esta página.</p>
                    </div>
                </div>
            )
        );
    }

    return <>{children}</>;
}
