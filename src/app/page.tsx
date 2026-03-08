'use client';

import { Button } from '@/src/components/ui/button';
import Link from 'next/link';

export default function HomePage() {
    return (
        <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
            <h1 className="mb-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Power Gym
            </h1>
            <p className="mb-8 max-w-md text-muted-foreground">
                Entrenamiento Funcional y Personalizado.
            </p>
            <Button asChild size="lg">
                <Link href="/auth">Iniciar sesión</Link>
            </Button>
        </main>
    );
}
