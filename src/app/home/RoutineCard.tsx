import {
    AssignedRoutineWithDetails,
    RoutineExerciseWithExercise,
} from '@/src/modules/routines/routines.schema';
import { Dumbbell, Play } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function RoutineCard({ routine }: { routine: AssignedRoutineWithDetails }) {
    const router = useRouter();

    const startWorkout = (routineId: string) => {
        router.push(`/workout/${routineId}`);
    };

    return (
        <div
            key={routine.id}
            className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
        >
            {/* Routine Image/Video */}
            <div className="relative h-64 md:h-96 bg-gray-900">
                <img
                    src={routine.routine.image_url ?? ''}
                    alt={routine.exercises.name}
                    className="w-full h-full object-cover opacity-90"
                />
                {/* <button
                onClick={() => setShowExerciseDetails(!showExerciseDetails)}
                className="absolute top-4 right-4 px-3 py-2 bg-white bg-opacity-90 rounded-lg font-medium text-sm"
            >
                {showExerciseDetails ? 'Hide' : 'Show'} Details
            </button> */}
            </div>
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
                                <span className="text-gray-900 ">
                                    {ex.weight && +ex.weight > 0 && `@ ${ex.weight}kg`}
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
    );
}
