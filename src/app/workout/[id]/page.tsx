'use client';

import ErrorComponent from '@/src/components/common/ErrorComponent';
import LoadingComponent from '@/src/components/common/LoadingComponent';
import { Skeleton } from '@/src/components/ui/skeleton';
import { navigationHelpers } from '@/src/lib/navigation';
import { useRoutines } from '@/src/modules/routines/useRoutines';
import { useQuery } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import WorkoutCard from './workout-card';
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
                <WorkoutCard
                    currentRoutineExercise={currentRoutineExercise}
                    currentExerciseIndex={currentExerciseIndex}
                    currentSet={currentSet}
                    isSetCompleted={isSetCompleted}
                    isResting={isResting}
                    handleTimerComplete={handleTimerComplete}
                    handleSkipRest={handleSkipRest}
                    handleCompleteSet={handleCompleteSet}
                />
            )}
        </div>
    );
}
