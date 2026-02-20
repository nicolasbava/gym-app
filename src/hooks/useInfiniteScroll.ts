import { useEffect, useRef } from 'react';

export function useInfiniteScroll(onInView: () => void, enabled = true) {
    const sentinelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!enabled) {
            return;
        }
        if (!sentinelRef.current) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (entry?.isIntersecting) {
                    onInView();
                }
            },
            {
                root: null,
                rootMargin: '250px',
                threshold: 0,
            },
        );

        observer.observe(sentinelRef.current);

        return () => {
            observer.disconnect();
        };
    }, [enabled, onInView]);

    return sentinelRef;
}
