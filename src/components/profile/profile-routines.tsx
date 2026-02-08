'use client';

import { Badge } from '@/src/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/src/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/src/components/ui/collapsible';
import { Skeleton } from '@/src/components/ui/skeleton';
import { useRoutines } from '@/src/modules/routines/useRoutines';
import { ChevronDown, Dumbbell, ListOrdered, User } from 'lucide-react';
import { useEffect, useState } from 'react';

interface RoutineExercise {
    id?: string;
    exercise_id?: string;
    exercise?: { name?: string; description?: string };
    sets?: number;
    reps?: string;
    order_index?: number;
}

interface RoutineAssignment {
    id?: string;
    routine?: {
        name?: string;
        description?: string;
        created_at?: string;
        created_by?: { name?: string };
        routine_exercises?: RoutineExercise[];
    };
    assigned_by?: { name?: string };
}

export default function RoutinesProfile({ profileId }: { profileId: string }) {
    const { getUserActiveRoutines, loading, error } = useRoutines();
    const [routinesData, setRoutinesData] = useState<RoutineAssignment[]>([]);

    useEffect(() => {
        if (!profileId) return;
        let cancelled = false;
        getUserActiveRoutines(profileId).then((data) => {
            if (!cancelled && Array.isArray(data)) setRoutinesData(data);
        });
        return () => {
            cancelled = true;
        };
    }, [profileId]);

    if (loading) {
        return (
            <div className="space-y-3">
                {[1, 2].map((i) => (
                    <Card key={i} className="bg-purple-900/10 border-purple-800/30">
                        <CardHeader className="pb-2">
                            <Skeleton className="h-6 w-48 bg-purple-800/40" />
                            <Skeleton className="h-4 w-full max-w-sm bg-purple-800/40" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-10 w-full bg-purple-800/40" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-lg border border-red-500/30 bg-red-950/20 px-4 py-3">
                <p className="text-sm font-medium text-red-200">Error al cargar las rutinas</p>
                <p className="mt-1 text-xs text-red-300/80">{error.message}</p>
            </div>
        );
    }

    if (routinesData.length === 0) {
        return (
            <div className="rounded-lg border border-purple-800/30 bg-purple-900/10 px-4 py-8 text-center">
                <Dumbbell className="mx-auto h-10 w-10 text-purple-500/60" />
                <p className="mt-2 text-sm font-medium text-purple-200">Sin rutinas asignadas</p>
                <p className="mt-1 text-xs text-purple-300/70">Asigna una rutina desde el dashboard del entrenador.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {routinesData.map((assignment) => {
                const routine = assignment.routine;
                const exercises = routine?.routine_exercises ?? [];
                return (
                    <Card key={assignment.id ?? routine?.name ?? Math.random()} className="bg-black/20 border-purple-800/30 overflow-hidden">
                        <Collapsible defaultOpen={routinesData.length <= 2}>
                            <CardHeader className="pb-2">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="font-semibold text-white truncate">{routine?.name ?? 'Rutina'}</h3>
                                            <Badge variant="secondary" className="bg-green-900/30 text-green-300 border-green-700/50 text-xs">
                                                Activa
                                            </Badge>
                                        </div>
                                        {routine?.description ? (
                                            <p className="mt-1 text-sm text-purple-200/90 line-clamp-2">{routine.description}</p>
                                        ) : null}
                                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-purple-300/80">
                                            {assignment.assigned_by?.name ? (
                                                <span className="flex items-center gap-1">
                                                    <User className="h-3.5 w-3.5" />
                                                    Asignada por {assignment.assigned_by.name}
                                                </span>
                                            ) : null}
                                            {exercises.length > 0 ? (
                                                <span className="flex items-center gap-1">
                                                    <ListOrdered className="h-3.5 w-3.5" />
                                                    {exercises.length} ejercicio{exercises.length !== 1 ? 's' : ''}
                                                </span>
                                            ) : null}
                                        </div>
                                    </div>
                                    <CollapsibleTrigger asChild>
                                        <button
                                            type="button"
                                            className="shrink-0 cursor-pointer rounded-md p-1.5 text-purple-400 hover:bg-purple-800/30 hover:text-white transition-colors [&[data-state=open]>svg]:rotate-180"
                                            aria-expanded
                                        >
                                            <ChevronDown className="h-5 w-5 transition-transform" />
                                        </button>
                                    </CollapsibleTrigger>
                                </div>
                            </CardHeader>
                            <CollapsibleContent>
                                <CardContent className="pt-0">
                                    <div className="rounded-lg bg-purple-950/20 border border-purple-800/20 p-3">
                                        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-purple-400">Ejercicios</p>
                                        <ul className="space-y-2">
                                            {exercises.length === 0 ? (
                                                <li className="text-sm text-purple-300/70">Sin ejercicios en esta rutina.</li>
                                            ) : (
                                                exercises
                                                    .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0))
                                                    .map((ex, idx) => (
                                                        <li
                                                            key={ex.id ?? ex.exercise_id ?? idx}
                                                            className="flex items-center gap-2 text-sm text-white"
                                                        >
                                                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-700/40 text-xs font-medium text-purple-200">
                                                                {idx + 1}
                                                            </span>
                                                            <span>{ex.exercise?.name ?? 'Ejercicio'}</span>
                                                            {(ex.sets != null || ex.reps) && (
                                                                <span className="text-purple-300/80">
                                                                    {[ex.sets != null && `${ex.sets} series`, ex.reps].filter(Boolean).join(' · ')}
                                                                </span>
                                                            )}
                                                        </li>
                                                    ))
                                            )}
                                        </ul>
                                    </div>
                                </CardContent>
                            </CollapsibleContent>
                        </Collapsible>
                    </Card>
                );
            })}
        </div>
    );
}
