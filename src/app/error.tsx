'use client'; // obligatorio

import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)]">
            <h2>Ups, algo salió mal, pero puedes volver al inicio.</h2>
            <Link href="/">Volver al inicio</Link>
        </div>
    );
}
