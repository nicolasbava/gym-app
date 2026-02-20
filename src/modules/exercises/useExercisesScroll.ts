'use client';
import { getExercisesGymIdName } from '@/src/app/actions/exercises';
import { usePaginatedScroll } from '@/src/hooks/usePaginatedScroll';
import { Exercise } from '@/src/lib/mock-data';

const PAGE_SIZE = 6;

export function useExercisesScroll(initialExercises: Exercise[], gymId: string, name: string = '') {
    return usePaginatedScroll<Exercise>({
        queryKey: ['exercises', gymId, name],
        fetchPage: async (pageParam) => {
            const res = await getExercisesGymIdName(gymId, name, pageParam);
            return Array.isArray(res?.data) ? res.data : [];
        },
        enabled: Boolean(gymId),
        initialItems: initialExercises,
        pageSize: PAGE_SIZE,
    });
}
