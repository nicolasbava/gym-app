import { useCallback, useEffect, useRef, useState } from 'react';

export function useRestTimer(initialSeconds: number, onComplete?: () => void) {
    const [timeLeft, setTimeLeft] = useState(initialSeconds);
    const [isRunning, setIsRunning] = useState(false);
    const endTimeRef = useRef<number | null>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const audioCtxRef = useRef<AudioContext | null>(null);

    const playBeep = useCallback(() => {
        // Web Audio API - funciona en PWA sin archivos externos
        if (!audioCtxRef.current) {
            audioCtxRef.current = new AudioContext();
        }
        const ctx = audioCtxRef.current;

        // Tres beeps
        [0, 0.3, 0.6].forEach((delay) => {
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.frequency.value = 880;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.5, ctx.currentTime + delay);
            gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.2);

            oscillator.start(ctx.currentTime + delay);
            oscillator.stop(ctx.currentTime + delay + 0.2);
        });
    }, []);

    const tick = useCallback(() => {
        if (!endTimeRef.current) return;

        // Calcula cuánto queda basado en timestamp real
        const remaining = Math.ceil((endTimeRef.current - Date.now()) / 1000);

        if (remaining <= 0) {
            setTimeLeft(0);
            setIsRunning(false);
            clearInterval(intervalRef.current!);
            playBeep();
            onComplete?.();
        } else {
            setTimeLeft(remaining);
        }
    }, [onComplete, playBeep]);

    const start = useCallback(() => {
        endTimeRef.current = Date.now() + initialSeconds * 1000;
        setTimeLeft(initialSeconds);
        setIsRunning(true);
    }, [initialSeconds]);

    const pause = useCallback(() => {
        setIsRunning(false);
        clearInterval(intervalRef.current!);
    }, []);

    const reset = useCallback(() => {
        clearInterval(intervalRef.current!);
        endTimeRef.current = null;
        setTimeLeft(initialSeconds);
        setIsRunning(false);
    }, [initialSeconds]);

    const resume = useCallback(() => {
        if (endTimeRef.current !== null && endTimeRef.current > Date.now()) {
            setIsRunning(true);
        }
    }, []);

    // Maneja visibilitychange — cuando vuelve del bloqueo recalcula
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && isRunning) {
                tick(); // recalcula inmediatamente al volver
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [isRunning, tick]);

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(tick, 500); // cada 500ms para más precisión
        } else {
            clearInterval(intervalRef.current!);
        }
        return () => clearInterval(intervalRef.current!);
    }, [isRunning, tick]);

    return { timeLeft, isRunning, start, pause, resume, reset };
}
