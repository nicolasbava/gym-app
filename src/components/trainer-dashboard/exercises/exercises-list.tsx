'use client';
import { useExercises } from '@/src/modules/exercises/useExercises';

export default function ExercisesList() {
    const { loading, exercises } = useExercises();

    console.log('>>> exercises:', exercises);
    if (loading) return <ExercisesLoading />;

    return (
        <div>
            {/* <h1>Ejercicios</h1> */}
            {exercises.map((exercise) => (
                <div key={exercise.name} className="flex items-center justify-between p-4 bg-purple-900/20 rounded-lg cursor-pointer hover:bg-purple-800/30 my-2">
                    <div className="flex items-center space-x-3">
                        <h3 className="text-white font-medium">{exercise.name}</h3>
                    </div>
                    <p>{exercise.description}</p>
                </div>
            ))}
        </div>
    );
}

function ExercisesLoading() {
    return (
        <div>
            <h2>CARGANDO EJERCICIOS...</h2>
        </div>
    );
}
