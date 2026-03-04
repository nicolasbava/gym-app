import { z } from 'zod';

export const baseExerciseSchema = z.object({
    name: z
        .string()
        .min(3, 'El nombre debe tener al menos 3 caracteres')
        .max(100, 'El nombre no debe tener más de 100 caracteres'),
    description: z
        .string()
        .max(500, 'La descripción no debe tener más de 500 caracteres')
        .optional(),
    muscle_group: z.string().min(1, 'El grupo muscular es requerido'),
    equipment: z.string().optional(),
    created_by: z.string().min(1, 'El creador es requerido'),
    // is_global: z.boolean().default(false),
    mux_upload_id: z.string().optional(),
    mux_playback_id: z.string().optional(),
    mux_status: z.string().optional(),
    images_url: z.array(z.string()).optional().nullable(),
});

export const createExerciseSchema = baseExerciseSchema;

export const exerciseSchema = baseExerciseSchema.extend({
    id: z.string().min(1, 'El ID es requerido'),
    created_at: z.date().optional(),
    updated_at: z.date().optional(),
});

export const getExerciseSchema = baseExerciseSchema;

export const updateExerciseSchema = baseExerciseSchema;

// Infer types
export type Exercise = z.infer<typeof exerciseSchema>;
export type CreateExercise = z.infer<typeof createExerciseSchema>;
export type GetExercise = z.infer<typeof getExerciseSchema>;
export type UpdateExercise = z.infer<typeof updateExerciseSchema>;
