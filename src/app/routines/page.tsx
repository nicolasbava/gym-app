'use client';
import RoutinesDialog from '@/src/components/trainer-dashboard/routines/routines-dialog';
import { useApp } from '@/src/contexts/AppContext';
import { mockExercises, Routine, RoutineExercise } from '@/src/lib/mock-data';
import { RoutineExerciseWithExercise } from '@/src/modules/routines/routines.schema';
import { useRoutines } from '@/src/modules/routines/useRoutines';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function RoutinesPage() {
    const { userProfile } = useApp();
    const { getRoutinesByGym, deleteRoutine } = useRoutines();
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null);
    const [formData, setFormData] = useState<Partial<Routine>>({
        name: '',
        description: '',
        exercises: [],
    });

    const {
        data: routines,
        error,
        isLoading,
    } = useQuery({
        queryKey: ['routines', userProfile?.gym_id],
        queryFn: () => getRoutinesByGym(userProfile?.gym_id ?? ''),
        enabled: !!userProfile?.gym_id,
    });

    const handleOpenModal = (routine?: Routine) => {
        if (routine) {
            setEditingRoutine(routine);
            setFormData(routine);
        } else {
            setEditingRoutine(null);
            setFormData({
                name: '',
                description: '',
                exercises: [],
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingRoutine(null);
    };

    // const handleSubmit = (e: React.FormEvent) => {
    //     e.preventDefault();

    //     if (editingRoutine) {
    //         setRoutines(routines.map((r) => (r.id === editingRoutine.id ? ({ ...formData, id: r.id, createdAt: r.createdAt } as Routine) : r)));
    //     } else {
    //         const newRoutine: Routine = {
    //             ...formData,
    //             id: `r${Date.now()}`,
    //             createdAt: new Date().toISOString().split('T')[0],
    //         } as Routine;
    //         setRoutines([...routines, newRoutine]);
    //     }

    //     handleCloseModal();
    // };

    const handleDelete = (id: string) => {
        setLoading(true);
        const { mutate } = useMutation({
            mutationFn: () => deleteRoutine(id),
            onSuccess: () => {
                console.log('routine deleted');
            },
            onError: (error) => {
                console.log('error', error);
            },
        });
        mutate();
        setLoading(false);
    };

    const addExerciseToRoutine = () => {
        const newExercise: RoutineExercise = {
            exerciseId: mockExercises[0].id,
            sets: 3,
            reps: 10,
            weight: 0,
            restTime: 60,
        };
        setFormData({
            ...formData,
            exercises: [...(formData.exercises || []), newExercise],
        });
    };

    const updateExerciseInRoutine = (index: number, updates: Partial<RoutineExercise>) => {
        const newExercises = [...(formData.exercises || [])];
        newExercises[index] = { ...newExercises[index], ...updates };
        setFormData({ ...formData, exercises: newExercises });
    };

    const removeExerciseFromRoutine = (index: number) => {
        setFormData({
            ...formData,
            exercises: (formData.exercises || []).filter((_, i) => i !== index),
        });
    };

    const getExerciseName = (exerciseId: string) => {
        return mockExercises.find((ex) => ex.id === exerciseId)?.name || 'Unknown';
    };

    if (!routines) return <div>No routines found</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (isLoading) return <div>Loading...</div>;
    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-900">Rutinas</h2>
                    <p className="text-gray-600 mt-1">Crear y gestionar programas de entrenamiento</p>
                </div>
                <RoutinesDialog />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {routines &&
                    routines.map((routine) => (
                        <div key={routine.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg text-gray-900 mb-1">{routine.name}</h3>
                                    <p className="text-gray-600 text-sm">{routine.description}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleOpenModal(routine)} className="p-2 hover:bg-gray-100 rounded-lg">
                                        <Edit2 className="w-4 h-4 text-gray-700" />
                                    </button>
                                    <button onClick={() => handleDelete(routine.id)} className="p-2 hover:bg-red-50 rounded-lg">
                                        <Trash2 className="w-4 h-4 text-red-600" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <p className="text-sm font-medium text-gray-700 mb-2">
                                    {routine.routine_exercises.length} Ejercicio{routine.routine_exercises.length !== 1 ? 's' : ''}
                                </p>
                                {routine.routine_exercises.map((ex: RoutineExerciseWithExercise, index: number) => (
                                    <div key={index} className="flex items-center justify-between text-sm bg-gray-50 p-3 rounded-lg">
                                        <span className="font-medium text-gray-900">{ex.exercise.name}</span>
                                        <span className="text-gray-600">
                                            {ex.sets} × {ex.reps} {ex.weight && +ex.weight > 0 && `@ ${ex.weight}kg`}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}
