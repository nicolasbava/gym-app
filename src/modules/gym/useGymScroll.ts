'use client';
import { getGymsNamePaginated } from '@/src/app/actions/gym';
import { usePaginatedScroll } from '@/src/hooks/usePaginatedScroll';
import { Gym } from './gym.schema';

const PAGE_SIZE = 6;

export function useGymsScroll(initialGyms: Gym[], name: string = '') {
    return usePaginatedScroll<Gym>({
        queryKey: ['gyms', name],
        fetchPage: async (pageParam) => {
            const res = await getGymsNamePaginated(name, pageParam);
            return Array.isArray(res?.data) ? res.data : [];
        },
        enabled: true,
        initialItems: initialGyms,
        pageSize: PAGE_SIZE,
    });
}
