import { Pause, Play, RotateCcw, SkipForward } from 'lucide-react';
import { useEffect } from 'react';
import { useRestTimer } from '../hooks/useRestTimer';

interface TimerProps {
    duration: number; // in seconds
    onComplete: () => void;
    onSkip: () => void;
}

export function Timer({ duration, onComplete, onSkip }: TimerProps) {
    const { timeLeft, isRunning, start, pause, resume, reset } = useRestTimer(duration, onComplete);

    useEffect(() => {
        start();
    }, [duration, start]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleReset = () => {
        reset();
        start();
    };

    const handleToggleRunning = () => {
        if (isRunning) {
            pause();
        } else {
            resume();
        }
    };

    const progress = ((duration - timeLeft) / duration) * 100;

    return (
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold">Temporizador de descanso</h4>
                <button
                    onClick={onSkip}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 text-sm font-medium text-black cursor-pointer"
                >
                    <SkipForward className="w-4 h-4" />
                    Saltar
                </button>
            </div>

            <div className="relative mb-4">
                <div className="w-full h-2 bg-white bg-opacity-20 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-white transition-all duration-1000 ease-linear"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <div className="text-center mb-6">
                <div className="text-6xl font-bold mb-2">{formatTime(timeLeft)}</div>
                <p className="text-orange-100">Tiempo restante</p>
            </div>

            <div className="flex gap-3">
                <button
                    onClick={handleToggleRunning}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 font-medium cursor-pointer"
                >
                    {isRunning ? (
                        <>
                            <Pause className="w-5 h-5" />
                            Pausar
                        </>
                    ) : (
                        <>
                            <Play className="w-5 h-5" />
                            Reanudar
                        </>
                    )}
                </button>
                <button
                    onClick={handleReset}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 cursor-pointer"
                >
                    <RotateCcw className="w-5 h-5 text-black" />
                </button>
            </div>
        </div>
    );
}
