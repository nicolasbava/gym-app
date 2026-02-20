'use client';

import { deleteExercise } from '@/src/app/actions/exercises';
import ConfirmAction from '@/src/components/common/confirm-action';
import SearchBar from '@/src/components/common/SearchBar';
import ExerciseDialog from '@/src/components/trainer-dashboard/exercises/exercise-dialog';
import CreateExerciseForm from '@/src/components/trainer-dashboard/exercises/exercise-form';
import { Dialog, DialogContent, DialogHeader } from '@/src/components/ui/dialog';
import { useApp } from '@/src/contexts/AppContext';
import { useInfiniteScroll } from '@/src/hooks/useInfiniteScroll';
import { Exercise } from '@/src/modules/exercises/exercises.schema';
import { useExercisesScroll } from '@/src/modules/exercises/useExercisesScroll';
import { DialogTitle } from '@radix-ui/react-dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import ExerciseCard from './ExerciseCard';
import ExercisesLoading from './loading';

// interface ExerciseData {
//     id: string;
//     name: string;
//     description?: string;
//     muscle_group?: string;
//     equipment?: string;
// }

export default function ExercisesPage() {
    const queryClient = useQueryClient();
    const { userProfile } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
    const [exerciseToDelete, setExerciseToDelete] = useState<string | null>(null);
    const [nameExercise, setNameExercise] = useState('');

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } =
        useExercisesScroll([], userProfile?.gym_id ?? '', nameExercise);

    const exercises = useMemo(() => data?.pages.flatMap((page) => page) ?? [], [data]);

    const handleLoadMore = useCallback(() => {
        if (!hasNextPage || isFetchingNextPage) {
            return;
        }
        void fetchNextPage();
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    const loadMoreRef = useInfiniteScroll(
        handleLoadMore,
        Boolean(hasNextPage) && !isLoading && !isFetchingNextPage,
    );

    const deleteExerciseMutation = useMutation({
        mutationFn: (id: string) => deleteExercise(id),
        onSuccess: async () => {
            // Invalidate and refetch exercises queries to ensure list is updated
            await queryClient.invalidateQueries({
                queryKey: ['exercises'],
                exact: false,
            });
            // Force refetch to ensure immediate update
            await queryClient.refetchQueries({
                queryKey: ['exercises'],
                exact: false,
            });
            setExerciseToDelete(null);
        },
        onError: (error) => {
            console.log('error delete routine', error);
            setExerciseToDelete(null);
        },
    });

    const handleDelete = () => {
        if (exerciseToDelete) {
            deleteExerciseMutation.mutate(exerciseToDelete);
        }
    };

    const handleOpenDeleteDialog = (id: string) => {
        setExerciseToDelete(id);
    };

    // Fetch exercises by gym id and name
    const onSearch = useCallback((query: string) => {
        setNameExercise(query);
    }, []);

    const clearSearch = useCallback(() => {
        setNameExercise('');
    }, []);

    const handleOpenModal = (exercise?: Exercise) => {
        if (exercise) {
            setEditingExercise(exercise);
        } else {
            setEditingExercise(null);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingExercise(null);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-900">Librería de Ejercicios</h2>
                    <p className="text-gray-600 mt-1">
                        Gestiona todos los ejercicios de tu gimnasio
                    </p>
                </div>
                {/* <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                    <Plus className="w-5 h-5" />
                    Add Exercise
                    </button> */}
                <div className="flex items-center gap-2">
                    <SearchBar
                        fetchFunction={onSearch}
                        query={nameExercise}
                        clearSearch={clearSearch}
                    />
                    <ExerciseDialog />
                </div>
            </div>

            {isLoading ? (
                <ExercisesLoading />
            ) : error ? (
                <div className="text-center text-gray-600">
                    Error: {error instanceof Error ? error.message : 'Error al cargar ejercicios'}
                </div>
            ) : exercises.length === 0 ? (
                <div className="text-center text-gray-600">No se encontraron ejercicios</div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {exercises.map((exercise) => {
                            return (
                                <ExerciseCard
                                    key={exercise.id}
                                    exercise={exercise}
                                    handleOpenModal={() =>
                                        handleOpenModal(exercise as unknown as Exercise)
                                    }
                                    handleOpenDeleteDialog={handleOpenDeleteDialog}
                                    deleteExerciseMutation={deleteExerciseMutation.mutateAsync}
                                />
                            );
                        })}
                    </div>
                    <div ref={loadMoreRef} className="h-8 w-full" />
                    {isFetchingNextPage && (
                        <div className="mt-6 flex justify-center">
                            <p className="text-sm text-gray-600">Cargando más ejercicios...</p>
                        </div>
                    )}
                    {!hasNextPage && exercises.length > 0 && (
                        <div className="mt-6 flex justify-center">
                            <p className="text-sm text-gray-500">
                                No hay más ejercicios para mostrar
                            </p>
                        </div>
                    )}
                </>
            )}

            <ConfirmAction
                open={!!exerciseToDelete}
                onOpenChange={(open) => {
                    if (!open) {
                        setExerciseToDelete(null);
                    }
                }}
                title="Delete Exercise"
                description="Are you sure you want to delete this exercise?"
                onConfirm={handleDelete}
                variant="destructive"
            />

            {/* Edit Exercise Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogHeader>
                    <DialogTitle className="sr-only">Editar Ejercicio</DialogTitle>
                </DialogHeader>
                <DialogContent>
                    <CreateExerciseForm
                        gymId={userProfile?.gym_id ?? ''}
                        exercise={editingExercise || undefined}
                        onSuccess={handleCloseModal}
                        setOpen={setIsModalOpen}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
