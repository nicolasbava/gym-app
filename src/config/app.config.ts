// src/config/app.config.ts
export const APP_CONFIG = {
    name: 'Axion Training',
    description: 'Gestión de entrenamientos',

    // URLs
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    apiUrl: process.env.NEXT_PUBLIC_API_URL,

    // Supabase
    supabase: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
        anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    },

    // Features flags
    features: {
        enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
        enableNotifications: true,
    },

    // Pagination
    pagination: {
        defaultPageSize: 10,
        maxPageSize: 100,
    },
} as const;
