import { Button } from '@/src/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface WorkoutFinalizedProps {
    onEndWorkout: () => void;
}

export default function WorkoutFinalized({ onEndWorkout }: WorkoutFinalizedProps) {
    return (
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">Entrenamiento completo!</h3>
            <p className="text-gray-600 mb-6">
                ¡Buen trabajo! Has completado todos los ejercicios.
            </p>
            <Button
                onClick={onEndWorkout}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium cursor-pointer"
            >
                Finalizar entrenamiento
            </Button>
        </div>
    );
}
