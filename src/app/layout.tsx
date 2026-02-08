import { QueryClient } from '@tanstack/react-query';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import type React from 'react';
import Header from '../components/layout/header';
import App from './app';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Luxion - Fitness Profesional',
    description: 'Plataforma profesional de fitness con entrenadores certificados',
    generator: 'v0.dev',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const queryClient = new QueryClient();

    return (
        <>
            <Header />
            <html lang="es" className="light">
                <body className={inter.className}>
                    <App>{children}</App>
                </body>
            </html>
        </>
    );
}
