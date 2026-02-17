'use client';

import { getSession, getUser } from '@/src/app/actions/auth';
import type { Session, User } from '@supabase/supabase-js';

/**
 * Check session from client side
 * This calls server actions, so it's safe to use in client components
 */
export async function checkSession(): Promise<Session | null> {
    try {
        return await getSession();
    } catch (error) {
        console.error('Error checking session:', error);
        return null;
    }
}

/**
 * Get current user from client side
 */
export async function checkUser(): Promise<User | null> {
    try {
        return await getUser();
    } catch (error) {
        console.error('Error checking user:', error);
        return null;
    }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
    const session = await checkSession();
    return session !== null;
}
