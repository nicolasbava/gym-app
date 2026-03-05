import { z } from 'zod';
import { exerciseSchema } from '../exercises/exercises.schema';

export const baseRoutineSchema = z.object({
    name: z
        .string()
        .min(3, 'El nombre debe tener al menos 3 caracteres')
        .max(100, 'El nombre no debe tener más de 100 caracteres'),
    description: z
        .string()
        .max(500, 'La descripción no debe tener más de 500 caracteres')
        .optional(),
    created_by: z.string().min(1, 'El creador es requerido').optional(),
    image_url: z.string().optional().nullable(),
    gym_id: z.string().min(1, 'El gimnasio es requerido').optional(),
});

export const routineExerciseSchema = z.object({
    exercise_id: z.string().min(1, 'El ejercicio es requerido'),
    order_index: z.number().min(0, 'El orden debe ser mayor o igual a 0'),
    sets: z.number().int().min(1, 'El número de series debe ser mayor o igual a 1'),
    reps: z.string().min(1, 'El número de repeticiones es requerido'),
    rest_seconds: z.number().int().min(0, 'El tiempo de descanso debe ser mayor o igual a 0'),
    notes: z.string().optional(),
    weight: z.string().optional(),
});

const exercisesArraySchema = z
    .array(routineExerciseSchema)
    .min(1, 'Debe tener al menos un ejercicio')
    .max(50, 'El máximo de ejercicios es 50 por rutina');

export const createRoutineInputSchema = baseRoutineSchema.extend({
    exercises: exercisesArraySchema,
});

export const routineSchema = baseRoutineSchema.extend({
    id: z.string().min(1, 'El id es requerido'),
    created_at: z.string().min(1, 'La fecha de creación es requerida'),
    updated_at: z.string().min(1, 'La fecha de actualización es requerida'),
});

export const getRoutineSchema = baseRoutineSchema;

export const updateRoutineSchema = baseRoutineSchema.extend({
    id: z.string().min(1, 'El id es requerido'),
    updated_at: z.string().min(1, 'La fecha de actualización es requerida'),
    exercises: exercisesArraySchema,
});

export const assignRoutineSchema = z.object({
    routine_id: z.string().min(1, 'La rutina es requerida'),
    profile_id: z.string().min(1, 'El perfil es requerido'),
});

export const routineWithExerciseSchema = z.object({
    id: z.string(),
    reps: z.string(),
    sets: z.string(),
    weight: z.string().nullable(),
    notes: z.string(),
    exercise: exerciseSchema,
    created_at: z.string(),
    routine_id: z.string(),
    exercise_id: z.string(),
    order_index: z.string(),
    rest_seconds: z.string(),
});

export const routineWithExercisesSchema = z.object({
    id: z.string(),
    name: z.string(),
    gym_id: z.string(),
    created_at: z.string(),
    created_by: z.string(),
    description: z.string(),
    image_url: z.string().optional().nullable(),
    routine_exercises: z.array(routineWithExerciseSchema),
});

export const assignedRoutineWithDetailsSchema = z.object({
    id: z.string(),
    created_at: z.string(),
    profile_id: z.string(),
    start_date: z.string().nullable(),
    end_date: z.string().nullable(),
    status: z.string(),
    image_url: z.string().optional().nullable(),
    routine_id: z.string(),
    assigned_by: z.object({
        name: z.string(),
    }),
    routine: routineSchema,
    exercises: routineWithExercisesSchema,
});

// Infer types
export type Routine = z.infer<typeof routineSchema>;
export type RoutineExercise = z.infer<typeof routineExerciseSchema>;
export type CreateRoutineInput = z.infer<typeof createRoutineInputSchema>;
export type UpdateRoutine = z.infer<typeof updateRoutineSchema>;
export type AssignRoutine = z.infer<typeof assignRoutineSchema>;
export type AssignedRoutineWithDetails = z.infer<typeof assignedRoutineWithDetailsSchema>;
export type RoutineWithExercises = z.infer<typeof routineWithExercisesSchema>;
export type RoutineWithExercise = z.infer<typeof routineWithExerciseSchema>;
