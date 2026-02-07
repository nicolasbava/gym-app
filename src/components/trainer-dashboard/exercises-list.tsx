'use client'
import { useApp } from "@/src/contexts/AppContext";
import { useExercises } from "@/src/modules/exercises/useExercises"

export default function ExercisesList() {
    const { loading, exercises } = useExercises();

    console.log('>>> exercises:', exercises)
    if(loading) return <ExercisesLoading />

    return (
        <div>
            <h1>Ejercicios</h1>
            {exercises.map((exercise) => (
                <div key={exercise.name}>
                    <h3>{exercise.name}</h3>
                    <p>{exercise.description}</p>
                </div>
            ))}
        </div>
    )
}

function ExercisesLoading() {
    return (
        <div>
            <h2>CARGANDO EJERCICIOS...</h2>

        </div>
    )
}