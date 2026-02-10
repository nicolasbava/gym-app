import { QueryClient } from '@tanstack/react-query';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import type React from 'react';
import Header from '../components/layout/header';
import App from './app';
import './globals.css';
import Footer from '../components/layout/footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Luxion - Fitness Profesional',
    description: 'Plataforma profesional de fitness con entrenadores certificados',
    generator: 'v0.dev',
    manifest: '/manifest.webmanifest',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'Luxion',
    },
};

export const viewport: Viewport = {
    themeColor: '#000000',
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
            <Footer />
        </>
    );
}
