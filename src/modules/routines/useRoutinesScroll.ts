'use client';
import { getRoutinesByGymNameAction } from '@/src/app/actions/routines';
import { usePaginatedScroll } from '@/src/hooks/usePaginatedScroll';
import { RoutineWithExercises } from './routines.schema';

const PAGE_SIZE = 6;

export function useRoutinesScroll(
    initialRoutines: RoutineWithExercises[],
    gymId: string,
    name: string = '',
) {
    return usePaginatedScroll<RoutineWithExercises>({
        queryKey: ['routines', gymId, name],
        fetchPage: async (pageParam) => {
            const res = await getRoutinesByGymNameAction(gymId, name, pageParam);
            return Array.isArray(res?.data) ? res.data : [];
        },
        enabled: Boolean(gymId),
        initialItems: initialRoutines,
        pageSize: PAGE_SIZE,
    });
}
