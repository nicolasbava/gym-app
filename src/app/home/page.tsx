'use client';
import { useApp } from '@/src/contexts/AppContext';
import { AssignedRoutineWithDetails } from '@/src/modules/routines/routines.schema';
import { useRoutines } from '@/src/modules/routines/useRoutines';
import { useQuery } from '@tanstack/react-query';
import { Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import RoutineCard from './RoutineCard';

const MemberHomePage = () => {
    const router = useRouter();
    const { userProfile: profile } = useApp();
    const { getUserActiveRoutines } = useRoutines();

    const startWorkout = (routineId: string) => {
        router.push(`/workout/${routineId}`);
    };

    const { data, error, isLoading } = useQuery({
        queryKey: ['user-active-routines', profile?.id],
        queryFn: () => getUserActiveRoutines(profile?.id ?? ''),
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!data) return <div>No data found</div>;

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Mis rutinas</h2>
                <p className="text-gray-600 mt-1">Tus programas de entrenamiento personalizados</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.map((routine: AssignedRoutineWithDetails) => (
                    <RoutineCard key={routine.id} routine={routine} />
                ))}
            </div>

            {data?.length === 0 && (
                <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No hay rutinas asignadas todavía</p>
                    <p className="text-gray-400 text-sm mt-2">Tu entrenador te asignará rutinas</p>
                </div>
            )}
        </div>
    );
};

export default MemberHomePage;
