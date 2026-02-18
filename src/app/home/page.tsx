'use client';
import { useApp } from '@/src/contexts/AppContext';
import { mockExercises, mockRoutines } from '@/src/lib/mock-data';
import {
    AssignedRoutineWithDetails,
    RoutineExerciseWithExercise,
} from '@/src/modules/routines/routines.schema';
import { useRoutines } from '@/src/modules/routines/useRoutines';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Dumbbell, Play } from 'lucide-react';
import { useRouter } from 'next/navigation';

const MemberHomePage = () => {
    const router = useRouter();
    // Mock: member is assigned routines r1, r2, r3
    const { userProfile: profile } = useApp();
    const { getUserActiveRoutines } = useRoutines();
    const assignedRoutineIds = ['r1', 'r2', 'r3'];
    const myRoutines = mockRoutines.filter((r) => assignedRoutineIds.includes(r.id));

    const startWorkout = (routineId: string) => {
        router.push(`/workout/${routineId}`);
    };

    const { data, error, isLoading } = useQuery({
        queryKey: ['user-active-routines', profile?.id],
        queryFn: () => getUserActiveRoutines(profile?.id ?? ''),
    });

    const getExerciseName = (exerciseId: string) => {
        return mockExercises.find((ex) => ex.id === exerciseId)?.name || 'Unknown';
    };

    const getTotalExercises = (routineId: string) => {
        const routine = mockRoutines.find((r) => r.id === routineId);
        return routine?.exercises.length || 0;
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!data) return <div>No data found</div>;

    // const parsedData = routineSchema.array().safeParse(data);
    // if (!parsedData.success) return <div>Error: {parsedData.error.message}</div>;

    // const exercises = parsedData.routine;

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Mis rutinas</h2>
                <p className="text-gray-600 mt-1">Tus programas de entrenamiento personalizados</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.map((routine: AssignedRoutineWithDetails) => (
                    <div
                        key={routine.id}
                        className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
                    >
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white">
                            <h3 className="text-xl font-semibold mb-2">{routine.exercises.name}</h3>
                            <p className="text-blue-100 text-sm">{routine.exercises.description}</p>
                        </div>

                        <div className="p-4 space-y-3">
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <Dumbbell className="w-4 h-4" />
                                <span>{routine.exercises.routine_exercises.length} ejercicios</span>
                            </div>

                            <div className="space-y-2">
                                {routine.exercises.routine_exercises.map(
                                    (ex: RoutineExerciseWithExercise, index: number) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between text-sm bg-gray-50 p-3 rounded-lg"
                                        >
                                            <span className="font-medium text-gray-900">
                                                {ex.exercise.name}
                                            </span>
                                            <span className="text-gray-600">
                                                {ex.sets} × {ex.reps}
                                            </span>
                                        </div>
                                    ),
                                )}
                            </div>

                            <button
                                onClick={() => startWorkout(routine.routine_id)}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors mt-4 cursor-pointer"
                            >
                                <Play className="w-5 h-5" />
                                Iniciar entrenamiento
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {myRoutines.length === 0 && (
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
