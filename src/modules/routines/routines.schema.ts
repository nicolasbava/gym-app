import { z } from 'zod';

export const routineSchema = z.object({
    id: z.string().min(1, 'El id es requerido'),
    name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres').max(100, 'El nombre no debe tener más de 100 caracteres'),
    description: z.string().max(500, 'La descripción no debe tener más de 500 caracteres').optional(),
    created_by: z.string().min(1, 'El creador es requerido'),
    created_at: z.string().min(1, 'La fecha de creación es requerida'),
    updated_at: z.string().min(1, 'La fecha de actualización es requerida'),
});

export const routineExerciseSchema = z.object({
    exercise_id: z.string().min(1, 'El ejercicio es requerido'),
    order_index: z.number().min(0, 'El orden debe ser mayor o igual a 0'),
    sets: z.number().int().min(1, 'El número de series debe ser mayor o igual a 1'),
    reps: z.string().min(1, 'El número de repeticiones es requerido'),
    rest_seconds: z.number().int().min(0, 'El tiempo de descanso debe ser mayor o igual a 0'),
    notes: z.string().optional(),
});

export const createRoutineSchema = z.object({
    gym_id: z.string().min(1, 'El gimnasio es requerido'),
    name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres').max(100, 'El nombre no debe tener más de 100 caracteres'),
    description: z.string().max(500, 'La descripción no debe tener más de 500 caracteres').optional(),
    created_by: z.string().min(1, 'El creador es requerido'),
    exercises: z.array(routineExerciseSchema).min(1, 'Debe tener al menos un ejercicio').max(50, 'El máximo de ejercicios es 50 por rutina'),
});

export const assignRoutineSchema = z.object({
    routine_id: z.string().min(1, 'La rutina es requerida'),
    profile_id: z.string().min(1, 'El perfil es requerido'),
});

// Infer types
export type Routine = z.infer<typeof routineSchema>;
export type RoutineExercise = z.infer<typeof routineExerciseSchema>;
export type CreateRoutine = z.infer<typeof createRoutineSchema>;
export type AssignRoutine = z.infer<typeof assignRoutineSchema>;
