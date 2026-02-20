'use client';
import { getExercisesGymIdName } from '@/src/app/actions/exercises';
import { Exercise } from '@/src/lib/mock-data';
import { useInfiniteQuery } from '@tanstack/react-query';

const PAGE_SIZE = 6;

export function useExercisesScroll(initialExercises: Exercise[], gymId: string, name: string = '') {
    return useInfiniteQuery({
        queryKey: ['exercises', gymId, name],
        queryFn: async ({ pageParam }) => {
            const res = await getExercisesGymIdName(gymId, name, pageParam);
            return Array.isArray(res?.data) ? res.data : [];
        },
        getNextPageParam: (lastPage, allPages) => {
            if (!Array.isArray(lastPage) || lastPage.length < PAGE_SIZE) {
                return undefined;
            }
            return allPages.length;
        },
        enabled: Boolean(gymId),
        initialPageParam: 0,
        ...(initialExercises.length > 0 && {
            initialData: {
                pages: [initialExercises],
                pageParams: [0],
            },
        }),
    });
}
