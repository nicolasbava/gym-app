// src/config/routes.ts
export const ROUTES = {
    // Public routes
    HOME: '/',
    LOGIN: '/auth',
    REGISTER: '/register',

    // Auth redirects
    AUTH_CALLBACK: '/auth/callback',
    AFTER_LOGIN: '/routines',
    AFTER_LOGOUT: '/auth',

    // Dashboard routes
    DASHBOARD: '/dashboard',
    ROUTINES: '/dashboard/routines',
    MEMBERS: '/dashboard/members',
    EXERCISES: '/dashboard/exercises',

    // Dynamic routes (funciones helper)
    member: (id: string) => `/dashboard/members/${id}`,
    routine: (id: string) => `/dashboard/routines/${id}`,
    editRoutine: (id: string) => `/dashboard/routines/${id}/edit`,
} as const;

// Tipos para autocompletado
export type Route = (typeof ROUTES)[keyof typeof ROUTES];
