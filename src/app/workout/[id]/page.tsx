'use client';

import ErrorComponent from '@/src/components/common/ErrorComponent';
import LoadingComponent from '@/src/components/common/LoadingComponent';
import { VideoPlayer } from '@/src/components/common/video-player';
import { Skeleton } from '@/src/components/ui/skeleton';
import { navigationHelpers } from '@/src/lib/navigation';
import { Timer } from '@/src/lib/timer';
import { useRoutines } from '@/src/modules/routines/useRoutines';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import WorkoutFinalized from './workout-finalized';

const ROUTINE_ID_INVALID = 'Routine not found';

function getRoutineId(params: ReturnType<typeof useParams>): string | null {
    const id = params?.id;
    if (id == null || typeof id !== 'string' || id.trim() === '') {
        return null;
    }
    return id;
}

export default function WorkoutPage() {
    const router = useRouter();
    const params = useParams();
    const routineId = useMemo(() => getRoutineId(params), [params]);
    const { getRoutineById } = useRoutines();
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [currentSet, setCurrentSet] = useState(1);
    const [isResting, setIsResting] = useState(false);
    const [completedSets, setCompletedSets] = useState<Record<number, number[]>>({});

    const {
        data: routine,
        error,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ['routine', routineId],
        queryFn: () => getRoutineById(routineId as string),
        enabled: routineId !== null,
    });

    const onEndWorkout = () => {
        router.push(navigationHelpers.redirectAfterWorkout());
    };

    const errorMessage =
        error instanceof Error ? error.message : 'Ups, hubo un error al cargar la rutina :(';

    const hasValidRoutine =
        routine != null &&
        Array.isArray(routine.routine_exercises) &&
        routine.routine_exercises.length > 0;

    const currentRoutineExercise = hasValidRoutine
        ? (routine.routine_exercises[currentExerciseIndex] ?? null)
        : null;

    const isSetCompleted = (exerciseIndex: number, setNumber: number) =>
        completedSets[exerciseIndex]?.includes(setNumber) ?? false;

    const handleCompleteSet = () => {
        if (!hasValidRoutine || currentRoutineExercise == null) {
            return;
        }
        const newCompletedSets = { ...completedSets };
        if (!newCompletedSets[currentExerciseIndex]) {
            newCompletedSets[currentExerciseIndex] = [];
        }
        newCompletedSets[currentExerciseIndex].push(currentSet);
        setCompletedSets(newCompletedSets);

        const setsCount = Number(currentRoutineExercise.sets);
        if (currentSet < setsCount) {
            setIsResting(true);
        } else if (currentExerciseIndex < routine.routine_exercises.length - 1) {
            setCurrentExerciseIndex(currentExerciseIndex + 1);
            setCurrentSet(1);
        }
    };

    const handleTimerComplete = () => {
        setIsResting(false);
        setCurrentSet((prev) => prev + 1);
    };

    const handlePreviousExercise = () => {
        if (currentExerciseIndex > 0) {
            setCurrentExerciseIndex(currentExerciseIndex - 1);
            setCurrentSet(1);
            setIsResting(false);
        }
    };

    const handleNextExercise = () => {
        if (hasValidRoutine && currentExerciseIndex < routine.routine_exercises.length - 1) {
            setCurrentExerciseIndex(currentExerciseIndex + 1);
            setCurrentSet(1);
            setIsResting(false);
        }
    };

    const handleSkipRest = () => {
        setIsResting(false);
        setCurrentSet((prev) => prev + 1);
    };

    const allExercisesCompleted =
        hasValidRoutine &&
        routine.routine_exercises.every(
            (ex, idx) => (completedSets[idx]?.length ?? 0) === Number(ex.sets),
        );

    if (routineId === null) {
        return (
            <div className="max-w-4xl mx-auto">
                <ErrorComponent message={ROUTINE_ID_INVALID} />
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto">
                {/* create a skeleton with 150px of height and 90% of width */}
                <Skeleton className="w-full h-[80px] mb-4" />
                <Skeleton className="w-full h-[300px] " />
                <LoadingComponent message="rutina" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="max-w-4xl mx-auto">
                <ErrorComponent message={errorMessage} />
            </div>
        );
    }

    if (!hasValidRoutine) {
        return (
            <div className="max-w-4xl mx-auto">
                <ErrorComponent message="No se encontró la rutina o no tiene ejercicios" />
            </div>
        );
    }

    console.log('currentRoutineExercise', currentRoutineExercise);

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
                <button
                    onClick={onEndWorkout}
                    className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                    type="button"
                >
                    <X className="w-6 h-6 text-gray-700" />
                </button>
            </div>

            {allExercisesCompleted ? (
                <WorkoutFinalized onEndWorkout={onEndWorkout} />
            ) : currentRoutineExercise == null ? (
                <ErrorComponent message="No se encontró el ejercicio actual" />
            ) : (
                <>
                    {/* Main Exercise Card */}
                    <div className="bg-white rounded-lg shadow-sm border overflow-hidden mb-4">
                        <div className="relative h-64 md:h-96 bg-gray-900">
                            {/* <img
                                src={currentRoutineExercise.exercise.image_url?.[0]}
                                alt={currentRoutineExercise.exercise.name}
                                className="w-full h-full object-cover opacity-90"
                            /> */}

                            {currentRoutineExercise.exercise.mux_playback_id && (
                                <VideoPlayer
                                    playbackId={
                                        currentRoutineExercise.exercise.mux_playback_id ?? ''
                                    }
                                    title={currentRoutineExercise.exercise.name}
                                />
                            )}
                        </div>

                        <div className="p-6">
                            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                                {currentRoutineExercise.exercise.name}
                            </h3>

                            <div className="flex items-center gap-4 mb-4">
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                                    {currentRoutineExercise.exercise.muscle_group}
                                </span>
                                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                                    {currentRoutineExercise.exercise.equipment}
                                </span>
                            </div>
                            <p className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                                {currentRoutineExercise.exercise.description}
                            </p>

                            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-medium text-gray-700">
                                        Progreso de set
                                    </span>
                                    <span className="text-sm text-gray-600">
                                        Set {currentSet} of {currentRoutineExercise.sets}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    {Array.from({
                                        length: Number(currentRoutineExercise.sets),
                                    }).map((_, idx) => (
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

                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <p className="text-2xl font-semibold text-gray-900">
                                        {currentRoutineExercise.sets}
                                    </p>
                                    <p className="text-sm text-gray-600">Sets</p>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <p className="text-2xl font-semibold text-gray-900">
                                        {currentRoutineExercise.reps}
                                    </p>
                                    <p className="text-sm text-gray-600">Repeticiones</p>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <p className="text-2xl font-semibold text-gray-900">
                                        {Number(currentRoutineExercise.weight) > 0
                                            ? `${currentRoutineExercise.weight}kg`
                                            : 'BW'}
                                    </p>
                                    <p className="text-sm text-gray-600">Peso</p>
                                </div>
                            </div>

                            {isResting && (
                                <div className="mb-6">
                                    <Timer
                                        duration={Number(currentRoutineExercise.rest_seconds)}
                                        onComplete={handleTimerComplete}
                                        onSkip={handleSkipRest}
                                    />
                                </div>
                            )}

                            {!isResting && !isSetCompleted(currentExerciseIndex, currentSet) && (
                                <button
                                    onClick={handleCompleteSet}
                                    className="w-full py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold text-lg transition-colors cursor-pointer"
                                    type="button"
                                >
                                    Completar set {currentSet}
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={handlePreviousExercise}
                            disabled={currentExerciseIndex === 0}
                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            type="button"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            Anterior
                        </button>
                        <button
                            onClick={handleNextExercise}
                            disabled={currentExerciseIndex === routine.routine_exercises.length - 1}
                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            type="button"
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
