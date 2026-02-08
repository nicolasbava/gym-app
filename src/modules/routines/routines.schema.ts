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

export const exerciseSchema = z.object({
    id: z.string(),
    name: z.string(),
    gym_id: z.string().nullable(),
    video_url: z.string().nullable(),
    created_at: z.string(),
    created_by: z.string(),
    description: z.string(),
    muscle_group: z.string().nullable(),
    equipment: z.string().nullable(),
});

export const routineExerciseWithExerciseSchema = z.object({
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
    routine_exercises: z.array(routineExerciseWithExerciseSchema),
});

export const assignedRoutineWithDetailsSchema = z.object({
    id: z.string(),
    created_at: z.string(),
    profile_id: z.string(),
    start_date: z.string().nullable(),
    end_date: z.string().nullable(),
    status: z.string(),
    routine_id: z.string(),
    assigned_by: z.object({
        name: z.string(),
    }),
    exercises: routineWithExercisesSchema,
});

// Infer types
export type Routine = z.infer<typeof routineSchema>;
export type RoutineExercise = z.infer<typeof routineExerciseSchema>;
export type CreateRoutine = z.infer<typeof createRoutineSchema>;
export type AssignRoutine = z.infer<typeof assignRoutineSchema>;
export type AssignedRoutineWithDetails = z.infer<typeof assignedRoutineWithDetailsSchema>;
export type RoutineWithExercises = z.infer<typeof routineWithExercisesSchema>;
export type RoutineExerciseWithExercise = z.infer<typeof routineExerciseWithExerciseSchema>;
export type Exercise = z.infer<typeof exerciseSchema>;

// {
//     "id": "bbe1e80e-08a9-4625-91c8-3c3ad88d54af",
//     "created_at": "2026-02-07T21:43:39.578655+00:00",
//     "profile_id": "d54cd879-6104-4322-a7b4-96667c2a5655",
//     "start_date": null,
//     "end_date": null,
//     "status": "active",
//     "routine_id": "19ed1bc8-0c5a-4781-b128-504e22095c53",
//     "assigned_by": {
//         "name": "Nicolas Bava"
//     },
//     "exercises": {
//         "id": "19ed1bc8-0c5a-4781-b128-504e22095c53",
//         "name": "Rutina fuerza",
//         "gym_id": "12972b4a-99e1-488b-a9a2-46b8bc8af253",
//         "created_at": "2026-02-07T19:15:26.80117+00:00",
//         "created_by": "b39a4b96-d07b-4e0c-bfa0-4d2489977b39",
//         "description": "",
//         "routine_exercises": [
//             {
//                 "id": "5ff3c033-83eb-499f-bf4b-b3544161efd6",
//                 "reps": "8-12",
//                 "sets": "3",
//                 "notes": "",
//                 "exercise": {
//                     "id": "e34447b5-3c4a-4f13-bca7-c3b8c07a1078",
//                     "name": "Press de banca plano",
//                     "gym_id": null,
//                     "video_url": null,
//                     "created_at": "2026-02-06T13:05:05.813979+00:00",
//                     "created_by": "b39a4b96-d07b-4e0c-bfa0-4d2489977b39",
//                     "description": "Acostado en banco plano, baja la barra hasta el pecho y empuja hacia arriba",
//                     "muscle_group": null
//                 },
//                 "created_at": "2026-02-07T19:15:26.965483+00:00",
//                 "routine_id": "19ed1bc8-0c5a-4781-b128-504e22095c53",
//                 "exercise_id": "e34447b5-3c4a-4f13-bca7-c3b8c07a1078",
//                 "order_index": "0",
//                 "rest_seconds": "60"
//             }
//         ]
//     }
// }
