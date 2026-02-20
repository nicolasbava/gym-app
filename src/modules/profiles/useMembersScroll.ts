'use client';
import { getProfilesByGymName } from '@/src/app/actions/profile';
import { usePaginatedScroll } from '@/src/hooks/usePaginatedScroll';
import { Profile } from '@/src/modules/profiles/profiles.schema';

const PAGE_SIZE = 6;

export function useMembersScroll(initialMembers: Profile[], gymId: string, name: string = '') {
    return usePaginatedScroll<Profile>({
        queryKey: ['members', gymId, name],
        fetchPage: async (pageParam) => {
            const res = await getProfilesByGymName(gymId, name, pageParam);
            return Array.isArray(res) ? res : [];
        },
        enabled: Boolean(gymId),
        initialItems: initialMembers,
        pageSize: PAGE_SIZE,
    });
}
