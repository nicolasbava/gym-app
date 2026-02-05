import { z } from 'zod';

export const createExerciseSchema = z.object({
    // gym_id: z.string().optional(),
    name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres').max(100,'El nombre no debe tener más de 100 caracteres'),
    description: z.string().max(500, 'La descripción no debe tener más de 500 caracteres').optional(),
    // video_url: z.string().url('La URL del video no es válida').optional().or(z.literal('')),
    muscle_group: z.string().min(1, 'El grupo muscular es requerido'),
    // equipment_needed: z.string().min(1, 'El equipo necesario es requerido'),
    created_by: z.uuid().min(1, 'El creador es requerido'),
    // is_global: z.boolean(),
});

export const getExerciseSchema = z.object({
    id: z.string().min(1, 'El ID es requerido'),
    name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres').max(100,'El nombre no debe tener más de 100 caracteres'),
    description: z.string().max(500, 'La descripción no debe tener más de 500 caracteres').optional(),
    video_url: z.string().url('La URL del video no es válida').optional(),
    muscle_group: z.string().min(1, 'El grupo muscular es requerido'),
    equipment_needed: z.string().min(1, 'El equipo necesario es requerido'),
    created_by: z.string().min(1, 'El creador es requerido'),
    is_global: z.boolean().default(false),
    created_at: z.date().optional(),
    updated_at: z.date().optional(),
});

// Infer types
export type CreateExercise = z.infer<typeof createExerciseSchema>;
export type GetExercise = z.infer<typeof getExerciseSchema>;