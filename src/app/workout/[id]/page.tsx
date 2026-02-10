'use client';
import { mockExercises } from '@/src/lib/mock-data';
import { navigationHelpers } from '@/src/lib/navigation';
import { Timer } from '@/src/lib/timer';
import { useRoutines } from '@/src/modules/routines/useRoutines';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

interface WorkoutSessionProps {
    routineId: string;
    onEndWorkout: () => void;
}

export default function WorkoutPage() {
    const router = useRouter();
    const { id } = useParams();
    const { getRoutineById } = useRoutines();
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [currentSet, setCurrentSet] = useState(1);
    const [isResting, setIsResting] = useState(false);
    const [completedSets, setCompletedSets] = useState<Record<number, number[]>>({});
    const [showExerciseDetails, setShowExerciseDetails] = useState(true);

    if (!id || typeof id !== 'string') return <div>Routine not found</div>;

    const onEndWorkout = () => {
        router.push(navigationHelpers.redirectAfterLogin());
    };

    const {
        data: routine,
        error,
        isLoading,
    } = useQuery({
        queryKey: ['routine', id],
        queryFn: () => getRoutineById(id),
    });

    if (!routine) return <div>Routine not found</div>;

    const currentRoutineExercise = routine.routine_exercises[currentExerciseIndex];
    const currentExercise = mockExercises.find((ex) => ex.id === currentRoutineExercise.id);

    const isSetCompleted = (exerciseIndex: number, setNumber: number) => {
        return completedSets[exerciseIndex]?.includes(setNumber) || false;
    };

    const handleCompleteSet = () => {
        const newCompletedSets = { ...completedSets };
        if (!newCompletedSets[currentExerciseIndex]) {
            newCompletedSets[currentExerciseIndex] = [];
        }
        newCompletedSets[currentExerciseIndex].push(currentSet);
        setCompletedSets(newCompletedSets);

        if (currentSet < Number(currentRoutineExercise.sets)) {
            // Start rest timer
            setIsResting(true);
        } else {
            // Move to next exercise
            if (currentExerciseIndex < routine.routine_exercises.length - 1) {
                setCurrentExerciseIndex(currentExerciseIndex + 1);
                setCurrentSet(1);
            }
        }
    };

    const handleTimerComplete = () => {
        setIsResting(false);
        setCurrentSet(currentSet + 1);
    };

    const handlePreviousExercise = () => {
        if (currentExerciseIndex > 0) {
            setCurrentExerciseIndex(currentExerciseIndex - 1);
            setCurrentSet(1);
            setIsResting(false);
        }
    };

    const handleNextExercise = () => {
        if (currentExerciseIndex < routine.routine_exercises.length - 1) {
            setCurrentExerciseIndex(currentExerciseIndex + 1);
            setCurrentSet(1);
            setIsResting(false);
        }
    };

    const handleSkipRest = () => {
        setIsResting(false);
        setCurrentSet(currentSet + 1);
    };

    const allExercisesCompleted = routine.routine_exercises.every((ex, idx) => completedSets[idx]?.length === Number(ex.sets));

    console.log('routine', routine);
    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-4 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">{routine.name}</h2>
                    <p className="text-sm text-gray-600">
                        Ejercicio {currentExerciseIndex + 1} de {routine.routine_exercises.length}
                    </p>
                </div>
                <button onClick={onEndWorkout} className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                    <X className="w-6 h-6 text-gray-700" />
                </button>
            </div>

            {allExercisesCompleted ? (
                <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">Entrenamiento completo!</h3>
                    <p className="text-gray-600 mb-6">¡Buen trabajo! Has completado todos los ejercicios.</p>
                    <button
                        onClick={onEndWorkout}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium cursor-pointer"
                    >
                        Finalizar entrenamiento
                    </button>
                </div>
            ) : (
                <>
                    {/* Main Exercise Card */}
                    <div className="bg-white rounded-lg shadow-sm border overflow-hidden mb-4">
                        {/* Exercise Image/Video */}
                        <div className="relative h-64 md:h-96 bg-gray-900">
                            <img src={currentExercise?.imageUrl} alt={currentExercise?.name} className="w-full h-full object-cover opacity-90" />
                            {/* <button
                                onClick={() => setShowExerciseDetails(!showExerciseDetails)}
                                className="absolute top-4 right-4 px-3 py-2 bg-white bg-opacity-90 rounded-lg font-medium text-sm"
                            >
                                {showExerciseDetails ? 'Hide' : 'Show'} Details
                            </button> */}
                        </div>

                        {/* Exercise Info */}
                        <div className="p-6">
                            <h3 className="text-2xl font-semibold text-gray-900 mb-2">{currentRoutineExercise?.exercise.name}</h3>

                            <div className="flex items-center gap-4 mb-4">
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                                    {currentRoutineExercise?.exercise.muscle_group}
                                </span>
                                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">{currentRoutineExercise?.exercise.equipment}</span>
                                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                                    {currentRoutineExercise?.exercise.description}
                                </span>
                            </div>

                            {/* Set Progress */}
                            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-medium text-gray-700">Progreso de set</span>
                                    <span className="text-sm text-gray-600">
                                        Set {currentSet} of {currentRoutineExercise.sets}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    {Array.from({ length: Number(currentRoutineExercise.sets) }).map((_, idx) => (
                                        <div
                                            key={idx}
                                            className={`flex-1 h-2 rounded-full ${
                                                isSetCompleted(currentExerciseIndex, idx + 1)
                                                    ? 'bg-green-500'
                                                    : idx + 1 === currentSet
                                                      ? 'bg-blue-500'
                                                      : 'bg-gray-200'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Exercise Stats */}
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <p className="text-2xl font-semibold text-gray-900">{currentRoutineExercise.sets}</p>
                                    <p className="text-sm text-gray-600">Sets</p>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <p className="text-2xl font-semibold text-gray-900">{currentRoutineExercise.reps}</p>
                                    <p className="text-sm text-gray-600">Repeticiones</p>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <p className="text-2xl font-semibold text-gray-900">
                                        {Number(currentRoutineExercise.weight) > 0 ? `${currentRoutineExercise.weight}kg` : 'BW'}
                                    </p>
                                    <p className="text-sm text-gray-600">Peso</p>
                                </div>
                            </div>

                            {/* Rest Timer */}
                            {isResting && (
                                <div className="mb-6">
                                    <Timer
                                        duration={Number(currentRoutineExercise.rest_seconds)}
                                        onComplete={handleTimerComplete}
                                        onSkip={handleSkipRest}
                                    />
                                </div>
                            )}

                            {/* Complete Set Button */}
                            {!isResting && !isSetCompleted(currentExerciseIndex, currentSet) && (
                                <button
                                    onClick={handleCompleteSet}
                                    className="w-full py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold text-lg transition-colors cursor-pointer"
                                >
                                    Completar set {currentSet}
                                </button>
                            )}

                            {/* Exercise Instructions */}
                            {showExerciseDetails && currentExercise?.instructions && (
                                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                    <h4 className="font-semibold text-gray-900 mb-3">Instrucciones</h4>
                                    <ol className="space-y-2">
                                        {currentExercise.instructions.map((_instruction, idx) => (
                                            <li key={idx} className="flex gap-3 text-sm text-gray-700">
                                                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-medium">
                                                    {idx + 1}
                                                </span>
                                                <span className="pt-0.5">{'instruction'}</span>
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex gap-3">
                        <button
                            onClick={handlePreviousExercise}
                            disabled={currentExerciseIndex === 0}
                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            Anterior
                        </button>
                        <button
                            onClick={handleNextExercise}
                            disabled={currentExerciseIndex === routine.routine_exercises.length - 1}
                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Siguiente
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
