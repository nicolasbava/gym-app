'use client';
import { useRoutines } from '@/src/modules/routines/useRoutines';
import { useCallback, useEffect, useState } from 'react';

export default function RoutinesProfile({ profileId }: { profileId: string }) {
    const { getUserActiveRoutines, loading, error } = useRoutines();
    const [routinesData, setRoutinesData] = useState<any[]>([]);
    const routines = useCallback(async () => {
        if (!profileId) return console.error('profileId is required');
        const routines = await getUserActiveRoutines(profileId);
        setRoutinesData(routines as any[]);
        return routines;
    }, [profileId]);

    useEffect(() => {
        routines();
    }, [routines]);

    if (loading) return <div>Cargando Rutinas...</div>;
    if (error) return <div>Error al cargar las rutinas: {error.message}</div>;
    if (!routines) return <div>No se encontraron rutinas</div>;

    return (
        <div>
            <ul>
                {routinesData.map((routine) => (
                    <li key={routine.id}>
                        <span>{routine.routine.name}</span> |<span>{routine.routine.description}</span> |<span>{routine.routine.created_by.name}</span> |<span>{routine.routine.created_at}</span> |
                        <span>{routine.routine.updated_at}</span> |<span>{routine.assigned_by.name}</span>
                        <div>
                            <h2>-Ejercicios-</h2>
                            <ul>
                                {routine.routine.routine_exercises.map((exercise: any) => (
                                    <li key={exercise.id}>{exercise.exercise.name}</li>
                                ))}
                            </ul>
                        </div>
                    </li>
                ))}
                {/* {JSON.stringify(routinesData)} */}
            </ul>
        </div>
    );
}
