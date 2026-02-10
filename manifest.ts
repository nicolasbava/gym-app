import type { MetadataRoute } from 'next';
import { ROUTES } from './src/config/routes';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Luxion - Fitness Profesional',
        short_name: 'Luxion',
        description: 'Plataforma profesional de fitness con entrenadores certificados',
        start_url: ROUTES.AFTER_LOGIN,
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#000000',
        icons: [
            {
                src: '/icon-192x192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    };
}
