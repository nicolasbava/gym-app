import type { MetadataRoute } from 'next';
import { ROUTES } from './src/config/routes';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Power Gym - Entrenamiento Funcional y Personalizado',
        short_name: 'Power Gym',
        description: 'Entrenamiento Funcional y Personalizado',
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
