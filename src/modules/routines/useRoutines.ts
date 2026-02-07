// src/hooks/useRoutines.ts
'use client';

import { RoutineService } from '@/src/modules/routines/routines.service';
import { createClient } from '@/src/utils/supabase/client';
import { useState } from 'react';

export function useRoutines() {
    const [loading, setLoading] = useState(true);
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

    return {
        getRoutinesByGym,
        loading,
        error,
        createRoutine,
        refresh: getRoutinesByGym,
    };
}
