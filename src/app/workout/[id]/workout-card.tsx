'use client';

import { ImageIcon, Video } from 'lucide-react';
import { useState } from 'react';

import { VideoPlayer } from '@/src/components/common/video-player';
import { Button } from '@/src/components/ui/button';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/src/components/ui/carousel';
import { Timer } from '@/src/lib/timer';
import { RoutineWithExercise } from '@/src/modules/routines/routines.schema';
import Image from 'next/image';

interface WorkoutCardProps {
    currentRoutineExercise: RoutineWithExercise;
    currentSet: number;
    isSetCompleted: (exerciseIndex: number, setNumber: number) => boolean;
    currentExerciseIndex: number;
    isResting: boolean;
    handleTimerComplete: () => void;
    handleSkipRest: () => void;
    handleCompleteSet: () => void;
}

export default function WorkoutCard({
    currentRoutineExercise,
    currentExerciseIndex,
    currentSet,
    isSetCompleted,
    isResting,
    handleTimerComplete,
    handleSkipRest,
    handleCompleteSet,
}: WorkoutCardProps) {
    const hasImages =
        currentRoutineExercise.exercise.images_url &&
        currentRoutineExercise.exercise.images_url.length > 0;
    const hasVideo = !!currentRoutineExercise.exercise.mux_playback_id;
    const hasBoth = hasImages && hasVideo;

    const [showVideo, setShowVideo] = useState(false);

    return (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden mb-4">
            <div className="relative aspect-video bg-gray-900">
                {showVideo && hasVideo ? (
                    <VideoPlayer
                        playbackId={currentRoutineExercise.exercise.mux_playback_id ?? ''}
                        title={currentRoutineExercise.exercise.name}
                    />
                ) : hasImages ? (
                    <Carousel opts={{ loop: true }}>
                        <CarouselContent className="ml-0">
                            {currentRoutineExercise.exercise.images_url!.map((url, idx) => (
                                <CarouselItem key={idx} className="pl-0 relative aspect-video">
                                    <Image
                                        src={url}
                                        alt={`${currentRoutineExercise.exercise.name} ${idx + 1}`}
                                        fill
                                        className="object-contain"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        {currentRoutineExercise.exercise.images_url!.length > 1 && (
                            <>
                                <CarouselPrevious className="left-2" />
                                <CarouselNext className="right-2" />
                            </>
                        )}
                    </Carousel>
                ) : hasVideo ? (
                    <VideoPlayer
                        playbackId={currentRoutineExercise.exercise.mux_playback_id ?? ''}
                        title={currentRoutineExercise.exercise.name}
                    />
                ) : (
                    <div className="w-full h-full bg-gray-800" />
                )}

                {/* BUTTONS to show video or images */}
                {hasBoth && (
                    <Button
                        variant="secondary"
                        size="sm"
                        className="absolute top-3 right-3 z-10 gap-1.5 cursor-pointer"
                        onClick={() => {
                            setShowVideo((prev) => !prev);
                        }}
                        type="button"
                    >
                        {showVideo ? (
                            <>
                                <ImageIcon className="size-4" />
                                Images
                            </>
                        ) : (
                            <>
                                <Video className="size-4" />
                                Video
                            </>
                        )}
                    </Button>
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
                        <span className="text-sm font-medium text-gray-700">Progreso de set</span>
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
    );
}
