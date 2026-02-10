'use client';
import ConfirmAction from '@/src/components/common/confirm-action';
import CreateRoutineForm from '@/src/components/trainer-dashboard/routines/routine-form';
import RoutinesDialog from '@/src/components/trainer-dashboard/routines/routines-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/src/components/ui/dialog';
import { useApp } from '@/src/contexts/AppContext';
import { mockExercises, Routine, RoutineExercise } from '@/src/lib/mock-data';
import { RoutineExerciseWithExercise, RoutineWithExercises } from '@/src/modules/routines/routines.schema';
import { useRoutines } from '@/src/modules/routines/useRoutines';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Dumbbell, Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function RoutinesPage() {
    const { userProfile } = useApp();
    const queryClient = useQueryClient();
    const { getRoutinesByGym, deleteRoutine } = useRoutines();
    const [loading, setLoading] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [routineToDelete, setRoutineToDelete] = useState<string | null>(null);
    const [editingRoutine, setEditingRoutine] = useState<RoutineWithExercises | null>(null);
    
    const deleteRoutineMutation = useMutation({
        mutationFn: (id: string) => deleteRoutine(id),
        onSuccess: async () => {
            // Invalidate and refetch routines queries to ensure list is updated
            await queryClient.invalidateQueries({
                queryKey: ['routines'],
                exact: false,
            });
            // Force refetch to ensure immediate update
            await queryClient.refetchQueries({
                queryKey: ['routines'],
                exact: false,
            });
            setRoutineToDelete(null);
        },
        onError: (error) => {
            console.log('error delete routine', error);
            setRoutineToDelete(null);
        },
    });
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

    const handleOpenEditModal = (routine: RoutineWithExercises) => {
        setEditingRoutine(routine);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setEditingRoutine(null);
    };

    const handleDelete = () => {
        if (routineToDelete) {
            deleteRoutineMutation.mutate(routineToDelete);
        }
    };

    const handleOpenDeleteDialog = (id: string) => {
        setRoutineToDelete(id);
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
                                    <button onClick={() => handleOpenEditModal(routine)} className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg">
                                        <Edit2 className="w-4 h-4 text-gray-700" />
                                    </button>
                                    <button
                                        onClick={() => handleOpenDeleteDialog(routine.id)}
                                        className="cursor-pointer   p-2 hover:bg-red-50 rounded-lg"
                                    >
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

                            <ConfirmAction
                                open={routineToDelete === routine.id}
                                onOpenChange={(open) => {
                                    if (!open) {
                                        setRoutineToDelete(null);
                                    }
                                }}
                                onConfirm={handleDelete}
                                onCancel={() => setRoutineToDelete(null)}
                                title="Eliminar rutina"
                                description="¿Estás seguro de querer eliminar esta rutina?"
                                variant="destructive"
                            />
                        </div>
                    ))}
            </div>

            {/* Edit Routine Dialog */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="bg-white border border-gray-200 rounded-lg max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                            <Dumbbell className="h-6 w-6 text-blue-600" />
                            Editar Rutina
                        </DialogTitle>
                        <DialogDescription className="text-sm text-gray-600">Modifica los datos de la rutina de entrenamiento</DialogDescription>
                    </DialogHeader>
                    {editingRoutine && (
                        <CreateRoutineForm
                            gymId={userProfile?.gym_id ?? ''}
                            routine={editingRoutine}
                            onSuccess={() => {
                                handleCloseEditModal();
                                // La invalidación y refetch ya se hacen en el formulario
                            }}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
