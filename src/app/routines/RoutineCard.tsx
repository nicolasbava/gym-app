'use client';

import ConfirmAction from '@/src/components/common/ConfirmAction';
import { RoutineWithExercise, RoutineWithExercises } from '@/src/modules/routines/routines.schema';
import { Dumbbell, Edit2, Trash2 } from 'lucide-react';
import Image from 'next/image';

type RoutineCardProps = {
    routine: RoutineWithExercises;
    handleOpenEditModal: (routine: RoutineWithExercises) => void;
    handleOpenDeleteDialog: (id: string) => void;
    handleDelete: () => void;
    openDeleteDialog: boolean;
    setOpenDeleteDialog: (open: boolean) => void;
};

export default function RoutineCard({
    routine,
    handleOpenEditModal,
    handleOpenDeleteDialog,
    handleDelete,
    openDeleteDialog,
    setOpenDeleteDialog,
}: RoutineCardProps) {
    const placeholder = (
        <div
            className="flex shrink-0 w-[100px] h-[100px] items-center justify-center rounded-lg bg-gray-100 text-gray-400"
            aria-hidden
        >
            <Dumbbell className="w-10 h-10" />
        </div>
    );

    return (
        <div
            key={routine.id}
            className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
        >
            <div className="flex items-start justify-between mb-4">
                {routine.image_url ? (
                    <Image
                        src={routine.image_url}
                        alt={routine.name}
                        width={100}
                        height={100}
                        className="shrink-0 rounded-lg object-cover hidden sm:block"
                    />
                ) : (
                    placeholder
                )}
                <div className="flex-1 ml-2 mr-2">
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">{routine.name}</h3>
                    <p className="text-gray-600 text-sm">{routine.description}</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => handleOpenEditModal(routine)}
                        className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg"
                    >
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
                    {routine.routine_exercises.length} Ejercicio
                    {routine.routine_exercises.length !== 1 ? 's' : ''}
                </p>
                {routine.routine_exercises.map((ex: RoutineWithExercise, index: number) => (
                    <div
                        key={index}
                        className="flex items-center justify-between text-sm bg-gray-50 p-3 rounded-lg"
                    >
                        <span className="font-medium text-gray-900">{ex.exercise.name}</span>
                        <span className="text-gray-600">
                            {ex.sets} × {ex.reps}{' '}
                            {ex.weight && +ex.weight > 0 && `@ ${ex.weight}kg`}
                        </span>
                    </div>
                ))}
            </div>
            {openDeleteDialog && (
                <ConfirmAction
                    open={openDeleteDialog}
                    onOpenChange={() => {
                        setOpenDeleteDialog(false);
                    }}
                    onConfirm={handleDelete}
                    onCancel={() => {
                        setOpenDeleteDialog(false);
                    }}
                    title="Eliminar rutina"
                    description="¿Estás seguro de querer eliminar esta rutina?"
                    variant="destructive"
                />
            )}
        </div>
    );
}
