import { useEffect, useRef, useState } from 'react';

const MINIMUM_DELAY_DEFAULT_MS = 500;

export function useDebounce<T>(value: T, delay: number = MINIMUM_DELAY_DEFAULT_MS): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(() => setDebouncedValue(value), delay);

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [value]);

    return debouncedValue;
}
