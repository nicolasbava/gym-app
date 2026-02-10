// src/hooks/useRoutines.ts
'use client';

import {
    createRoutine as createRoutineAction,
    deleteRoutine as deleteRoutineAction,
    getRoutineById as getRoutineByIdAction,
    getRoutinesByGym as getRoutinesByGymAction,
    getUserActiveRoutines as getUserActiveRoutinesAction,
} from '@/src/app/actions/routines';
import { useState } from 'react';
import { AssignedRoutineWithDetails, RoutineWithExercises } from './routines.schema';

// user -> useRoutines -> actions/routines -> routines.service -> supabase

export function useRoutines() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    async function getRoutinesByGym(gymId: string) {
        try {
            setLoading(true);
            setError(null);
            const result = await getRoutinesByGymAction(gymId);
            if (!result.success) {
                throw new Error(result.error || 'Error al obtener rutinas');
            }
            return result.data;
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Error desconocido');
            setError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    async function createRoutine(routineData: any) {
        try {
            setLoading(true);
            setError(null);
            const result = await createRoutineAction(routineData);
            if (!result.success) {
                throw new Error(result.error || 'Error al crear rutina');
            }
            return result.data;
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Error desconocido');
            setError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    async function getUserActiveRoutines(profileId: string): Promise<AssignedRoutineWithDetails[]> {
        try {
            setLoading(true);
            setError(null);
            const result = await getUserActiveRoutinesAction(profileId);
            if (!result.success) {
                throw new Error(result.error || 'Error al obtener rutinas activas');
            }
            return result.data as AssignedRoutineWithDetails[];
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Error desconocido');
            setError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    async function getRoutineById(id: string): Promise<RoutineWithExercises> {
        try {
            setLoading(true);
            setError(null);
            const result = await getRoutineByIdAction(id);
            if (!result.success) {
                throw new Error(result.error || 'Error al obtener rutina');
            }
            return result.data as RoutineWithExercises;
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Error desconocido');
            setError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    async function deleteRoutine(id: string) {
        try {
            setLoading(true);
            setError(null);
            const result = await deleteRoutineAction(id);
            if (!result.success) {
                throw new Error(result.error || 'Error al eliminar rutina');
            }
            return result.data;
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Error desconocido');
            setError(error);
            throw error;
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
