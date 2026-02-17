'use client';

import { AuthGuard } from '@/src/components/auth/AuthGuard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode, useState } from 'react';
import Footer from '../components/layout/footer';
import Header from '../components/layout/header';
import NavBar from '../components/layout/nav';
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
                    <Header />
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 min-h-[calc(100vh-150px)]">
                        <NavBar />
                        {children}
                    </div>
                    <Footer />
                </AppContent>
            </AppProvider>
        </QueryClientProvider>
    );
}
