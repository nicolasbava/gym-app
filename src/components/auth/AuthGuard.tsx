'use client';

import { getRouteConfig, requiresAuth } from '@/src/config/routes';
import { useAuth } from '@/src/hooks/useAuth';
import { usePathname, useRouter } from 'next/navigation';
import { type ReactNode, useEffect } from 'react';

interface AuthGuardProps {
    children: ReactNode;
    fallback?: ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
    const auth = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const routeConfig = getRouteConfig(pathname);
    const routeRequiresAuth = requiresAuth(pathname);

    useEffect(() => {
        if (auth.isLoading) return;

        if (routeRequiresAuth && !auth.isAuthenticated) {
            router.replace('/routines');
            return;
        }

        if (routeConfig?.allowedRoles && routeConfig.allowedRoles.length > 0) {
            if (!auth.canAccess(routeConfig.allowedRoles)) {
                router.replace('/routines');
            }
        }
    }, [auth.isLoading, auth.isAuthenticated, routeRequiresAuth, routeConfig, router]);

    // Always show loading while auth is resolving
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

    // Block render until redirect completes to avoid flashing protected content
    if (routeRequiresAuth && !auth.isAuthenticated) {
        router.replace('/auth');
        return;
    }
    if (routeConfig?.allowedRoles && routeConfig.allowedRoles.length > 0) {
        if (!auth.canAccess(routeConfig.allowedRoles)) {
            router.replace('/auth');
            return;
        }
    }

    return <>{children}</>;
}
