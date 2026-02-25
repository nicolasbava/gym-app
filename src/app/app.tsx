'use client';

import { AuthGuard } from '@/src/components/auth/AuthGuard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { type ReactNode, useState } from 'react';
import NavBar from '../components/layout/nav';
import { BottomNavigation } from '../components/layout/navigation/BottomNavigation';
import { DesktopHeader } from '../components/layout/navigation/DesktopHeader';
import MobileHeader from '../components/layout/navigation/MobileHeader';
import { AppProvider } from '../contexts/AppContext';

function AppContent({ children }: { children: ReactNode }) {
    return (
        <AuthGuard>
            <div className=" mx-auto w-full min-h-[calc(100vh-150px)]">{children}</div>
        </AuthGuard>
    );
}

export default function App({ children }: { children: ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools />
            <AppProvider>
                <AppContent>
                    <DesktopHeader />
                    <MobileHeader />

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 min-h-[calc(100vh-150px)]">
                        <div className="hidden sm:block">
                            <NavBar />
                        </div>
                        <div className="mt-4">{children}</div>
                    </div>
                    <BottomNavigation />
                </AppContent>
            </AppProvider>
        </QueryClientProvider>
    );
}
