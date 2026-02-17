'use server';

import { Profile } from '@/src/modules/profiles/profiles.schema';
import { UserRole } from '@/src/config/routes';
import { createClient } from '@/src/utils/supabase/server';
import { cookies } from 'next/headers';
import type { User, Session } from '@supabase/supabase-js';

export interface UserWithProfile {
    user: User;
    profile: Profile | null;
    session: Session | null;
}

/**
 * Get current session from Supabase
 */
export async function getSession(): Promise<Session | null> {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    const {
        data: { session },
    } = await supabase.auth.getSession();

    return session;
}

/**
 * Get current user from Supabase
 */
export async function getUser(): Promise<User | null> {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    const {
        data: { user },
    } = await supabase.auth.getUser();

    return user;
}

/**
 * Get user with profile data
 */
export async function getUserWithProfile(): Promise<UserWithProfile | null> {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return null;
    }

    const {
        data: { session },
    } = await supabase.auth.getSession();

    const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

    if (error) {
        console.error('Error fetching profile:', error);
    }

    return {
        user,
        profile: profile as Profile | null,
        session,
    };
}

/**
 * Require authentication - throws error if not authenticated
 */
export async function requireAuth(): Promise<User> {
    const user = await getUser();

    if (!user) {
        throw new Error('Authentication required');
    }

    return user;
}

/**
 * Require specific role(s) - throws error if user doesn't have required role
 */
export async function requireRole(allowedRoles: UserRole[]): Promise<UserWithProfile> {
    const userWithProfile = await getUserWithProfile();

    if (!userWithProfile || !userWithProfile.user) {
        throw new Error('Authentication required');
    }

    const userRole = userWithProfile.profile?.role as UserRole | undefined;

    if (!userRole || !allowedRoles.includes(userRole)) {
        throw new Error('Insufficient permissions');
    }

    return userWithProfile;
}

/**
 * Refresh session if expired
 */
export async function refreshSession(): Promise<Session | null> {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    const {
        data: { session },
        error,
    } = await supabase.auth.refreshSession();

    if (error) {
        console.error('Error refreshing session:', error);
        return null;
    }

    return session;
}

/**
 * Check if user has a specific role
 */
export async function hasRole(role: UserRole): Promise<boolean> {
    const userWithProfile = await getUserWithProfile();

    if (!userWithProfile?.profile) {
        return false;
    }

    return userWithProfile.profile.role === role;
}

/**
 * Check if user has any of the specified roles
 */
export async function hasAnyRole(roles: UserRole[]): Promise<boolean> {
    const userWithProfile = await getUserWithProfile();

    if (!userWithProfile?.profile) {
        return false;
    }

    const userRole = userWithProfile.profile.role as UserRole | undefined;
    return userRole ? roles.includes(userRole) : false;
}
