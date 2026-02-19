// src/config/routes.ts

export type RouteProtection = 'public' | 'protected' | 'auth-only';
export type UserRole = 'member' | 'coach' | 'coach_admin';

export interface RouteConfig {
    path: string;
    protection: RouteProtection;
    allowedRoles?: UserRole[];
    redirectTo?: string;
}

export const ROUTE_CONFIG: Record<string, RouteConfig> = {
    '/': { path: '/', protection: 'public' },
    '/auth': { path: '/auth', protection: 'public' },
    '/auth/callback': { path: '/auth/callback', protection: 'public' },
    '/routines': {
        path: '/routines',
        protection: 'protected',
        allowedRoles: ['member', 'coach', 'coach_admin'],
        redirectTo: '/auth',
    },
    '/exercises': {
        path: '/exercises',
        protection: 'protected',
        allowedRoles: ['member', 'coach', 'coach_admin'],
        redirectTo: '/auth',
    },
    '/members': {
        path: '/members',
        protection: 'protected',
        allowedRoles: ['coach', 'coach_admin'],
        redirectTo: '/auth',
    },
    '/profile': {
        path: '/profile',
        protection: 'protected',
        allowedRoles: ['member', 'coach', 'coach_admin'],
        redirectTo: '/auth',
    },
    '/dashboard': {
        path: '/dashboard',
        protection: 'protected',
        allowedRoles: ['coach', 'coach_admin'],
        redirectTo: '/auth',
    },
    '/workout': {
        path: '/workout',
        protection: 'protected',
        allowedRoles: ['member', 'coach', 'coach_admin'],
        redirectTo: '/auth',
    },
    '/home': {
        path: '/home',
        protection: 'protected',
        allowedRoles: ['member', 'coach', 'coach_admin'],
        redirectTo: '/auth',
    },
    '/password-reset': {
        path: '/password-reset',
        protection: 'public',
    },
    '/password-change': {
        path: '/password-change',
        protection: 'protected',
        allowedRoles: ['member', 'coach', 'coach_admin'],
        redirectTo: '/auth',
    },
};

/**
 * Get route configuration for a given path
 */
export function getRouteConfig(pathname: string): RouteConfig | undefined {
    // Exact match first
    if (ROUTE_CONFIG[pathname]) {
        return ROUTE_CONFIG[pathname];
    }

    // Check for dynamic routes (e.g., /member/[id], /workout/[id])
    const dynamicPatterns = [
        {
            pattern: /^\/member\/[^/]+$/,
            config: {
                path: '/member/[id]',
                protection: 'protected' as RouteProtection,
                allowedRoles: ['coach', 'coach_admin'] as UserRole[],
            },
        },
        {
            pattern: /^\/workout\/[^/]+$/,
            config: {
                path: '/workout/[id]',
                protection: 'protected' as RouteProtection,
                allowedRoles: ['member', 'coach', 'coach_admin'] as UserRole[],
            },
        },
        {
            pattern: /^\/dashboard\/members\/[^/]+$/,
            config: {
                path: '/dashboard/members/[id]',
                protection: 'protected' as RouteProtection,
                allowedRoles: ['coach', 'coach_admin'] as UserRole[],
            },
        },
        {
            pattern: /^\/dashboard\/routines\/[^/]+$/,
            config: {
                path: '/dashboard/routines/[id]',
                protection: 'protected' as RouteProtection,
                allowedRoles: ['coach', 'coach_admin'] as UserRole[],
            },
        },
        {
            pattern: /^\/dashboard\/routines\/[^/]+\/edit$/,
            config: {
                path: '/dashboard/routines/[id]/edit',
                protection: 'protected' as RouteProtection,
                allowedRoles: ['coach', 'coach_admin'] as UserRole[],
            },
        },
    ];

    for (const { pattern, config } of dynamicPatterns) {
        if (pattern.test(pathname)) {
            return config;
        }
    }

    // Check if path starts with any configured route
    for (const [route, config] of Object.entries(ROUTE_CONFIG)) {
        if (pathname.startsWith(route) && route !== '/') {
            return config;
        }
    }

    return undefined;
}

/**
 * Check if a route is public
 */
export function isPublicRoute(pathname: string): boolean {
    const config = getRouteConfig(pathname);
    return config?.protection === 'public';
}

/**
 * Check if a route requires authentication
 */
export function requiresAuth(pathname: string): boolean {
    const config = getRouteConfig(pathname);
    return config?.protection === 'protected' || config?.protection === 'auth-only';
}

/**
 * Check if a route is auth-only (redirects authenticated users away)
 */
export function isAuthOnlyRoute(pathname: string): boolean {
    const config = getRouteConfig(pathname);
    return config?.protection === 'auth-only';
}

/**
 * Check if user has required role for a route
 */
export function hasRequiredRole(userRole: UserRole | null | undefined, pathname: string): boolean {
    const config = getRouteConfig(pathname);
    if (!config || !config.allowedRoles) {
        return true; // No role requirement
    }
    if (!userRole) {
        return false;
    }
    return config.allowedRoles.includes(userRole);
}

export const ROUTES = {
    // Public routes
    HOME: '/home',
    LOGIN: '/auth',
    REGISTER: '/register',

    // Auth redirects
    AUTH_CALLBACK: '/auth/callback',
    AFTER_LOGIN: '/routines',
    AFTER_LOGIN_COACH: '/routines',
    AFTER_LOGOUT: '/auth',

    // Dashboard routes
    DASHBOARD: '/dashboard',
    ROUTINES: '/dashboard/routines',
    MEMBERS: '/dashboard/members',
    EXERCISES: '/dashboard/exercises',

    // Dynamic routes (helper functions)
    member: (id: string) => `/dashboard/members/${id}`,
    routine: (id: string) => `/dashboard/routines/${id}`,
    editRoutine: (id: string) => `/dashboard/routines/${id}/edit`,
} as const;

// Types for autocomplete
export type Route = (typeof ROUTES)[keyof typeof ROUTES];
