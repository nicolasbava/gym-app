import { Exercise } from '@/src/lib/mock-data';
import { Edit2, Trash2 } from 'lucide-react';

export default function ExerciseCard({
    exercise,
    handleOpenModal,
    handleOpenDeleteDialog,
    deleteExerciseMutation,
}: {
    exercise: Exercise;
    handleOpenModal: (exercise: Exercise) => void;
    handleOpenDeleteDialog: (id: string) => void;
    deleteExerciseMutation: (id: string) => void;
}) {
    return (
        <div
            key={exercise.id}
            className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
        >
            <div className="relative bg-gray-200">
                <div className="absolute top-2 right-2 flex gap-2">
                    <button
                        onClick={() => handleOpenModal(exercise)}
                        className="p-2 cursor-pointer bg-white rounded-lg shadow hover:bg-gray-50"
                    >
                        <Edit2 className="w-4 h-4 text-gray-700" />
                    </button>
                    <button
                        onClick={() => handleOpenDeleteDialog(exercise.id)}
                        className="p-2 cursor-pointer bg-white rounded-lg shadow hover:bg-red-50"
                    >
                        <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                </div>
            </div>
            <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-1">{exercise.name}</h3>
                <div className="flex gap-2 mb-2">
                    {exercise.muscle_group && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                            {exercise.muscle_group}
                        </span>
                    )}
                    {exercise.equipment && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            {exercise.equipment}
                        </span>
                    )}
                </div>
                {exercise.description && (
                    <p className="text-gray-600 text-sm line-clamp-2">{exercise.description}</p>
                )}
            </div>
        </div>
    );
}
