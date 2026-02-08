'use client';
import RoutinesDialog from '@/src/components/trainer-dashboard/routines/routines-dialog';
import { useApp } from '@/src/contexts/AppContext';
import { mockExercises, mockRoutines, Routine, RoutineExercise } from '@/src/lib/mock-data';
import { useRoutines } from '@/src/modules/routines/useRoutines';
import { useQuery } from '@tanstack/react-query';
import { Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function RoutinesPage() {
    const { userProfile } = useApp();
    const { getRoutinesByGym } = useRoutines();
    const [setRoutines] = useState<Routine[]>(mockRoutines);
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
        if (confirm('Are you sure you want to delete this routine?')) {
            setRoutines(mockRoutines.filter((r) => r.id !== id));
        }
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
                                {/* {routine.exercises.map((ex, index) => (
                                    <div key={index} className="flex items-center justify-between text-sm bg-gray-50 p-3 rounded-lg">
                                        <span className="font-medium text-gray-900">{getExerciseName(ex.exerciseId)}</span>
                                        <span className="text-gray-600">
                                            {ex.sets} × {ex.reps} {ex.weight > 0 && `@ ${ex.weight}kg`}
                                        </span>
                                    </div>
                                ))} */}
                            </div>
                        </div>
                    ))}
            </div>

            {/* Modal */}
            {/* {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                            <h3 className="text-xl font-semibold">{editingRoutine ? 'Editar Rutina' : 'Crear Nueva Rutina'}</h3>
                            <button onClick={handleCloseModal} className="p-2 hover:bg-gray-100 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Rutina</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Ej: Rutina de Fuerza - Push"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={2}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Ej: Rutina para el pecho, brazos y espalda"
                                    required
                                />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <label className="block text-sm font-medium text-gray-700">Ejercicios</label>
                                    <button
                                        type="button"
                                        onClick={addExerciseToRoutine}
                                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                    >
                                        + Agregar Ejercicio
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {(formData.exercises || []).map((exercise, index) => (
                                        <div key={index} className="bg-gray-50 p-4 rounded-lg space-y-3">
                                            <div className="flex items-center gap-2">
                                                <GripVertical className="w-5 h-5 text-gray-400" />
                                                <select
                                                    value={exercise.exerciseId}
                                                    onChange={(e) => updateExerciseInRoutine(index, { exerciseId: e.target.value })}
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                >
                                                    {mockExercises.map((ex) => (
                                                        <option key={ex.id} value={ex.id}>
                                                            {ex.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <button
                                                    type="button"
                                                    onClick={() => removeExerciseFromRoutine(index)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-600 mb-1">Sets</label>
                                                    <input
                                                        type="number"
                                                        value={exercise.sets}
                                                        onChange={(e) => updateExerciseInRoutine(index, { sets: parseInt(e.target.value) })}
                                                        min="1"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-600 mb-1">Reps</label>
                                                    <input
                                                        type="number"
                                                        value={exercise.reps}
                                                        onChange={(e) => updateExerciseInRoutine(index, { reps: parseInt(e.target.value) })}
                                                        min="1"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-600 mb-1">Weight (kg)</label>
                                                    <input
                                                        type="number"
                                                        value={exercise.weight}
                                                        onChange={(e) => updateExerciseInRoutine(index, { weight: parseFloat(e.target.value) })}
                                                        min="0"
                                                        step="0.5"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-600 mb-1">Rest (sec)</label>
                                                    <input
                                                        type="number"
                                                        value={exercise.restTime}
                                                        onChange={(e) => updateExerciseInRoutine(index, { restTime: parseInt(e.target.value) })}
                                                        min="0"
                                                        step="15"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {(formData.exercises || []).length === 0 && (
                                        <p className="text-gray-500 text-sm text-center py-8">
                                            No hay ejercicios agregados todavía. Haz clic en "Agregar Ejercicio" para empezar.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                                    {editingRoutine ? 'Actualizar Rutina' : 'Crear Rutina'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )} */}
        </div>
    );
}
