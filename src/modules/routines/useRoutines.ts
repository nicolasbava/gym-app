// src/hooks/useRoutines.ts
'use client';

import { RoutineService } from '@/src/modules/routines/routines.service';
import { createClient } from '@/src/utils/supabase/client';
import { useState } from 'react';
import { AssignedRoutineWithDetails, RoutineWithExercises } from './routines.schema';

export function useRoutines() {
    const [loading, setLoading] = useState(!true);
    const [error, setError] = useState<Error | null>(null);

    const supabase = createClient();
    const routineService = new RoutineService(supabase);

    async function getRoutinesByGym(gymId: string) {
        try {
            setLoading(true);
            const data = await routineService.getRoutinesByGym(gymId);
            return data;
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }

    async function createRoutine(routineData: any) {
        try {
            return await routineService.createRoutine(routineData);
        } catch (err) {
            console.log('err', err);
            setError(err as Error);
            throw err;
        }
    }

    async function getUserActiveRoutines(profileId: string): Promise<AssignedRoutineWithDetails[]> {
        console.log('profileId getUserActiveRoutines', profileId);
        try {
            setLoading(true);
            const data = await routineService.getUserActiveRoutines(profileId);
            console.log('getUserActiveRoutines', data);
            return data;
        } catch (err) {
            console.log('err', err);
            setError(err as Error);
            throw err;
        } finally {
            setLoading(false);
        }
    }

    async function getRoutineById(id: string): Promise<RoutineWithExercises> {
        try {
            setLoading(true);
            const data = await routineService.getRoutineById(id);
            return data;
        } catch (err) {
            console.log('err', err);
            setError(err as Error);
            throw err;
        } finally {
            setLoading(false);
        }
    }

    async function deleteRoutine(id: string) {
        try {
            setLoading(true);
            const data = await routineService.deleteRoutine(id);
            return data;
        } catch (err) {
            console.log('err', err);
            setError(err as Error);
            throw err;
        } finally {
            setLoading(false);
        }
    }

    return {
        error,
        loading,
        getRoutinesByGym,
        refresh: getRoutinesByGym,
        createRoutine,
        getUserActiveRoutines,
        getRoutineById,
        deleteRoutine,
    };
}
