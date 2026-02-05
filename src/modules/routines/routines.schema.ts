import { z } from 'zod';

export const routineExerciseSchema = z.object({
    exercise_id: z.string().min(1, 'El gimnasio es requerido'),
    order_index: z.number().min(0, 'El orden debe ser mayor o igual a 0'),
    sets: z.number().int().min(1, 'El número de series debe ser mayor o igual a 1'),
    reps: z.string().min(1, 'El número de repeticiones es requerido'),
    rest_seconds: z.number().int().min(0, 'El tiempo de descanso debe ser mayor o igual a 0'),
    notes: z.string().optional(),
});

export const createRoutineSchema = z.object({
    gym_id: z.string().min(1, 'El gimnasio es requerido'),
    name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres').max(100,'El nombre no debe tener más de 100 caracteres'),
    description: z.string().max(500, 'La descripción no debe tener más de 500 caracteres').optional(),
    created_by: z.string().min(1, 'El creador es requerido'),
    exercises: z.array(routineExerciseSchema).min(1, 'Debe tener al menos un ejercicio').max(50, 'El máximo de ejercicios es 50 por rutina')  
})

// Infer types
export type RoutineExercise = z.infer<typeof routineExerciseSchema>;
export type CreateRoutine = z.infer<typeof createRoutineSchema>;