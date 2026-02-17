'use client';

import { getCurrentUserGymId, getCurrentUserProfile } from '@/src/app/actions/users';
import { getSession, getUser } from '@/src/app/actions/auth';
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { Profile } from '../modules/profiles/profiles.schema';
import { UserRole } from '../config/routes';
import { hasRequiredRole, hasRole, hasAnyRole, isCoach, isCoachAdmin, isMember, getUserRole } from '../lib/auth/permissions';
import type { Session, User } from '@supabase/supabase-js';

type AppContextValue = {
    /** Current user's gym_id (UUID) from profiles. Null if not loaded or not a trainer. */
    gymId: string | null;
    /** True while fetching gymId from profiles. */
    gymIdLoading: boolean;
    /** Error message if fetching gymId failed. */
    gymIdError: string | null;
    /** Current user's profile. */
    userProfile: Profile | null;
    /** True while fetching user profile. */
    userProfileLoading: boolean;
    /** Error message if fetching user profile failed. */
    userProfileError: string | null;
    /** Current session. */
    session: Session | null;
    /** True while fetching session. */
    sessionLoading: boolean;
    /** Current user from Supabase auth. */
    user: User | null;
    /** True while fetching user. */
    userLoading: boolean;
    /** Re-fetch gymId from the server (e.g. after profile update). */
    refetchGymId: () => Promise<void>;
    /** Re-fetch user profile from the server (e.g. after profile update). */
    refetchUserProfile: () => Promise<void>;
    /** Re-fetch session from the server. */
    refetchSession: () => Promise<void>;
    /** Re-fetch user from the server. */
    refetchUser: () => Promise<void>;
    /** Check if user is authenticated. */
    isAuthenticated: boolean;
    /** Get user role. */
    userRole: UserRole | null;
    /** Check if user has a specific role. */
    hasRole: (role: UserRole) => boolean;
    /** Check if user has any of the specified roles. */
    hasAnyRole: (roles: UserRole[]) => boolean;
    /** Check if user is a coach (coach or coach_admin). */
    isCoach: boolean;
    /** Check if user is an admin coach. */
    isCoachAdmin: boolean;
    /** Check if user is a member. */
    isMember: boolean;
    /** Check if user has required role for a route. */
    canAccess: (allowedRoles?: UserRole[]) => boolean;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
    const [gymId, setGymId] = useState<string | null>(null);
    const [gymIdLoading, setGymIdLoading] = useState(true);
    const [gymIdError, setGymIdError] = useState<string | null>(null);
    const [userProfile, setUserProfile] = useState<Profile | null>(null);
    const [userProfileLoading, setUserProfileLoading] = useState(true);
    const [userProfileError, setUserProfileError] = useState<string | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [sessionLoading, setSessionLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [userLoading, setUserLoading] = useState(true);

    const refetchUserProfile = useCallback(async () => {
        setUserProfileLoading(true);
        setUserProfileError(null);
        const { profile, error } = await getCurrentUserProfile();
        setUserProfile(profile as Profile);
        setUserProfileError(error ?? null);
        setUserProfileLoading(false);
    }, []);

    const refetchSession = useCallback(async () => {
        setSessionLoading(true);
        try {
            const currentSession = await getSession();
            setSession(currentSession);
        } catch (error) {
            console.error('Error fetching session:', error);
            setSession(null);
        } finally {
            setSessionLoading(false);
        }
    }, []);

    const refetchUser = useCallback(async () => {
        setUserLoading(true);
        try {
            const currentUser = await getUser();
            setUser(currentUser);
        } catch (error) {
            console.error('Error fetching user:', error);
            setUser(null);
        } finally {
            setUserLoading(false);
        }
    }, []);

    useEffect(() => {
        refetchUserProfile();
        refetchSession();
        refetchUser();
    }, [refetchUserProfile, refetchSession, refetchUser]);

    const refetchGymId = useCallback(async () => {
        setGymIdLoading(true);
        setGymIdError(null);
        const { gymId: id, error } = await getCurrentUserGymId();
        setGymId(id);
        setGymIdError(error ?? null);
        setGymIdLoading(false);
    }, []);

    useEffect(() => {
        refetchGymId();
    }, [refetchGymId]);

    // Computed values
    const isAuthenticated = session !== null && user !== null;
    const userRole = getUserRole(userProfile);
    const isCoachValue = isCoach(userProfile);
    const isCoachAdminValue = isCoachAdmin(userProfile);
    const isMemberValue = isMember(userProfile);

    const value: AppContextValue = {
        gymId,
        userProfile,
        userProfileLoading,
        userProfileError,
        refetchUserProfile,
        gymIdLoading,
        gymIdError,
        refetchGymId,
        session,
        sessionLoading,
        user,
        userLoading,
        refetchSession,
        refetchUser,
        isAuthenticated,
        userRole,
        hasRole: (role: UserRole) => hasRole(userProfile, role),
        hasAnyRole: (roles: UserRole[]) => hasAnyRole(userProfile, roles),
        isCoach: isCoachValue,
        isCoachAdmin: isCoachAdminValue,
        isMember: isMemberValue,
        canAccess: (allowedRoles?: UserRole[]) => hasRequiredRole(userRole, allowedRoles),
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
    const ctx = useContext(AppContext);
    if (!ctx) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return ctx;
}

/** Optional hook: returns gymId and loading/error without throwing if used outside AppProvider. */
export function useAppOptional(): AppContextValue | null {
    return useContext(AppContext);
}
