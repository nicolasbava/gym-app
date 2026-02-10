// src/modules/exercises/useExercises.ts
'use client';

import { ExerciseService } from '@/src/modules/exercises/exercises.service';
import { createClient } from '@/src/utils/supabase/client';
import { useEffect, useState } from 'react';
import { CreateExercise } from './exercises.schema';

export function useExercises(gymId?: string) {
    const [exercises, setExercises] = useState<CreateExercise[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const supabase = createClient();
    const exerciseService = new ExerciseService(supabase);

    useEffect(() => {
        fetchExercises();
    }, [gymId]);

    async function fetchExercises() {
        try {
            setLoading(true);
            const data = await exerciseService.getAllExercises(gymId);
            setExercises(data as never[]);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }

    async function createExercise(exerciseData: CreateExercise) {
        try {
            const newExercise = await exerciseService.createExercise(exerciseData);
            setExercises((prev) => [newExercise, ...prev]);
            return newExercise;
        } catch (err) {
            setError(err as Error);
            throw err;
        }
    }

    // async function updateExercise(exerciseId: string, updates: any) {
    //   try {
    //     const updatedExercise = await exerciseService.updateExercise(exerciseId, updates)
    //     setExercises(prev =>
    //       prev.map((ex: Exercise) => (ex.id === exerciseId ? updatedExercise : ex))
    //     )
    //     return updatedExercise
    //   } catch (err) {
    //     setError(err as Error)
    //     throw err
    //   }
    // }

    async function deleteExercise(exerciseId: string) {
        try {
            await exerciseService.deleteExercise(exerciseId);
            setExercises((prev) => prev.filter((ex: any) => ex.id !== exerciseId));
        } catch (err) {
            setError(err as Error);
            throw err;
        }
    }

    async function getExercisesGymId(gymId: string) {
        try {
            const data = await exerciseService.getExercisesByGym(gymId);
            setExercises(data);
            console.log('>>> data use:', data);
        } catch (err) {
            console.log('>>> err:', err);
            setError(err as Error);
        }
    }

    return {
        exercises,
        loading,
        error,
        createExercise,
        // updateExercise,
        deleteExercise,
        getExercisesGymId,
        refresh: fetchExercises,
    };
}
