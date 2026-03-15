'use client';

import { getGymsNamePaginated } from '@/src/app/actions/gym';
import { usePaginatedScroll } from '@/src/hooks/usePaginatedScroll';
import type { Gym } from './gym.schema';

const PAGE_SIZE = 6;

export function useGymsScroll(initialGyms: Gym[], name: string = '') {
    return usePaginatedScroll<Gym>({
        queryKey: ['gyms', name],
        fetchPage: async (pageParam) => {
            const result = await getGymsNamePaginated({ name, page: pageParam });

            if (!result.success) {
                throw new Error(result.error.message);
            }

            return result.data as Gym[];
        },
        enabled: true,
        initialItems: initialGyms,
        pageSize: PAGE_SIZE,
    });
}
