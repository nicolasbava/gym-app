'use client';
import { QueryKey, useInfiniteQuery } from '@tanstack/react-query';

const INITIAL_PAGE = 0;
const DEFAULT_PAGE_SIZE = 6;

/**
 * A hook to paginate a list of items using infinite scroll.
 * @param queryKey - The query key to use for the query.
 * @param fetchPage - The function to fetch the next page of items.
 * @param initialItems - The initial items to display.
 * @param enabled - Whether the query is enabled.
 * @param pageSize - The number of items to display per page.
 */

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
