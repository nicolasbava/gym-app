'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import NavBar from '../components/layout/nav';
import { AppProvider, useApp } from '../contexts/AppContext';

function AppContent({ children }: { children: ReactNode }) {
    const { userProfile, userProfileLoading } = useApp();
    const router = useRouter();
    const pathname = usePathname();
    const [isChecking, setIsChecking] = useState(true);

    // Public routes that don't require authentication
    const publicRoutes = ['/', '/auth'];
    const isPublicRoute = publicRoutes.includes(pathname) || pathname.startsWith('/auth');

    useEffect(() => {
        // Wait for profile to finish loading
        if (!userProfileLoading) {
            setIsChecking(false);
            // Only check authentication for protected routes
            // Note: Middleware should handle this, but this is a client-side backup
            if (!isPublicRoute && !userProfile) {
                router.push('/auth');
            }
        }
    }, [userProfile, userProfileLoading, router, isPublicRoute]);

    // For public routes, render children immediately without auth check
    if (isPublicRoute) {
        return <>{children}</>;
    }

    // Show loading state while checking authentication for protected routes
    if (isChecking || userProfileLoading) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-150px)]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando...</p>
                </div>
            </div>
        );
    }

    // Don't render content if user is not authenticated
    // Middleware should prevent this, but this is a safety check
    if (!userProfile) {
        return null;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 min-h-[calc(100vh-150px)]">
            <NavBar />
            {children}
        </div>
    );
}

export default function App({ children }: { children: ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools />
            <AppProvider>
                <AppContent>{children}</AppContent>
            </AppProvider>
        </QueryClientProvider>
    );
}
