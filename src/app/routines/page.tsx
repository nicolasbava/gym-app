'use client';
import ErrorComponent from '@/src/components/common/ErrorComponent';
import LoadingComponent from '@/src/components/common/LoadingComponent';
import LayoutHeader from '@/src/components/layout/LayoutHeader';
import CreateRoutineForm from '@/src/components/routines/RoutineForm';
import RoutinesDialog from '@/src/components/routines/RoutinesDialog';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/src/components/ui/dialog';
import { useApp } from '@/src/contexts/AppContext';
import { useInfiniteScroll } from '@/src/hooks/useInfiniteScroll';
import { RoutineWithExercises } from '@/src/modules/routines/routines.schema';
import { useRoutines } from '@/src/modules/routines/useRoutines';
import { useRoutinesScroll } from '@/src/modules/routines/useRoutinesScroll';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dumbbell } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import RoutineCard from './RoutineCard';

export default function RoutinesPage() {
    const { userProfile } = useApp();
    const queryClient = useQueryClient();
    const { deleteRoutine } = useRoutines();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [routineToDelete, setRoutineToDelete] = useState<string | null>(null);
    const [editingRoutine, setEditingRoutine] = useState<RoutineWithExercises | null>(null);
    // Routines search
    const [nameRoutine, setNameRoutine] = useState('');

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

    // GET ROUTINES, SEARCH ROUTINES
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } =
        useRoutinesScroll([], userProfile?.gym_id ?? '', nameRoutine);
    const routines = useMemo(() => data?.pages.flatMap((page) => page) ?? [], [data]);
    const handleOpenEditModal = (routine: RoutineWithExercises) => {
        setEditingRoutine(routine);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setEditingRoutine(null);
    };

    const handleDelete = () => {
        try {
            if (routineToDelete) {
                deleteRoutineMutation.mutate(routineToDelete);
            }
        } catch (error) {
            console.log('error delete routine', error);
        }
        setRoutineToDelete(null);
    };

    const handleOpenDeleteDialog = (id: string) => {
        setRoutineToDelete(id);
    };

    // Routines search
    const onSearch = useCallback((query: string) => {
        setNameRoutine(query);
    }, []);

    const clearSearch = useCallback(() => {
        setNameRoutine('');
    }, []);

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

    console.log('routines', routines); 
    return (
        <div>
            {/* Header routines */}
            <LayoutHeader
                name="Rutinas"
                description="Crear y gestionar programas de entrenamiento"
                onSearch={onSearch}
                query={nameRoutine}
                clearSearch={clearSearch}
                children={<RoutinesDialog />}
            />

            {/* Loading and error states */}
            {isLoading ? (
                <LoadingComponent message="rutinas" />
            ) : error ? (
                <ErrorComponent
                    message={
                        error instanceof Error
                            ? error.message
                            : 'Ups, hubo un error al cargar rutinas :('
                    }
                />
            ) : routines.length === 0 ? (
                <ErrorComponent message="No se encontraron rutinas" />
            ) : (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {routines.map((routine) => (
                            <RoutineCard
                                key={routine.id}
                                routine={routine}
                                handleOpenEditModal={handleOpenEditModal}
                                handleOpenDeleteDialog={handleOpenDeleteDialog}
                                handleDelete={handleDelete}
                                openDeleteDialog={routineToDelete === routine.id}
                                setOpenDeleteDialog={(open) =>
                                    setRoutineToDelete(open ? routine.id : null)
                                }
                            />
                        ))}
                    </div>
                    <div ref={loadMoreRef} className="h-8 w-full" />
                    {isFetchingNextPage && (
                        <div className="mt-6 flex justify-center">
                            <p className="text-sm text-gray-600">Loading more routines...</p>
                        </div>
                    )}
                    {!hasNextPage && routines.length > 0 && (
                        <div className="mt-6 flex justify-center">
                            <p className="text-sm text-gray-500">No hay más rutinas para mostrar</p>
                        </div>
                    )}
                </>
            )}

            {/* Edit Routine Dialog */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="bg-white border border-gray-200 rounded-lg max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                            <Dumbbell className="h-6 w-6 text-blue-600" />
                            Editar Rutina
                        </DialogTitle>
                        <DialogDescription className="text-sm text-gray-600">
                            Modifica los datos de la rutina de entrenamiento
                        </DialogDescription>
                    </DialogHeader>
                    {editingRoutine && (
                        <CreateRoutineForm
                            gymId={userProfile?.gym_id ?? ''}
                            routine={editingRoutine}
                            onSuccess={() => {
                                handleCloseEditModal();
                                // La invalidación y refetch ya se hacen en el formulario
                            }}
                            handleCancel={handleCloseEditModal}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
