'use client';
import { QueryKey, useInfiniteQuery } from '@tanstack/react-query';

const INITIAL_PAGE = 0;
const DEFAULT_PAGE_SIZE = 6;

export function usePaginatedScroll<TItem>({
    queryKey,
    fetchPage,
    initialItems = [],
    enabled = true,
    pageSize = DEFAULT_PAGE_SIZE,
}: {
    queryKey: QueryKey;
    fetchPage: (page: number) => Promise<TItem[]>;
    initialItems?: TItem[];
    enabled?: boolean;
    pageSize?: number;
}) {
    return useInfiniteQuery({
        queryKey,
        queryFn: async ({ pageParam }) => {
            const pageItems = await fetchPage(pageParam);
            return Array.isArray(pageItems) ? pageItems : [];
        },
        getNextPageParam: (lastPage, allPages) => {
            if (!Array.isArray(lastPage) || lastPage.length < pageSize) {
                return undefined;
            }
            return allPages.length;
        },
        enabled,
        initialPageParam: INITIAL_PAGE,
        ...(initialItems.length > 0 && {
            initialData: {
                pages: [initialItems],
                pageParams: [INITIAL_PAGE],
            },
        }),
    });
}
