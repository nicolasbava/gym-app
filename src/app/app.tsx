'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode } from 'react';
import NavBar from '../components/layout/nav';
import { AppProvider } from '../contexts/AppContext';

export default function App({ children }: { children: ReactNode }) {
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools />
            <AppProvider>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <NavBar />
                    {children}
                </div>
            </AppProvider>
        </QueryClientProvider>
    );
}
