'use client';

import { getCurrentUserGymId, getCurrentUserProfile } from '@/src/app/actions/users';
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { Profile } from '../modules/profiles/profiles.schema';

type AppContextValue = {
    /** Current user's gym_id (UUID) from profiles. Null if not loaded or not a trainer. */
    gymId: string | null;
    /** True while fetching gymId from profiles. */
    gymIdLoading: boolean;
    /** Error message if fetching gymId failed. */
    gymIdError: string | null;
    /** Re-fetch gymId from the server (e.g. after profile update). */
    refetchGymId: () => Promise<void>;
    /** Current user's profile. */
    userProfile: Profile | null;
    /** True while fetching user profile. */
    userProfileLoading: boolean;
    /** Error message if fetching user profile failed. */
    userProfileError: string | null;
    /** Re-fetch user profile from the server (e.g. after profile update). */
    refetchUserProfile: () => Promise<void>;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
    const [gymId, setGymId] = useState<string | null>(null);
    const [gymIdLoading, setGymIdLoading] = useState(true);
    const [gymIdError, setGymIdError] = useState<string | null>(null);
    const [userProfile, setUserProfile] = useState<Profile | null>(null);
    const [userProfileLoading, setUserProfileLoading] = useState(true);
    const [userProfileError, setUserProfileError] = useState<string | null>(null);

    const refetchUserProfile = useCallback(async () => {
        setUserProfileLoading(true);
        setUserProfileError(null);
        const { profile, error } = await getCurrentUserProfile();
        setUserProfile(profile as Profile);
        setUserProfileError(error ?? null);
        setUserProfileLoading(false);
    }, []);

    useEffect(() => {
        refetchUserProfile();
    }, [refetchUserProfile]);

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

    const value: AppContextValue = {
        gymId,
        userProfile,
        userProfileLoading,
        userProfileError,
        refetchUserProfile,
        gymIdLoading,
        gymIdError,
        refetchGymId,
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
