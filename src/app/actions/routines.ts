'use server';

import {
    AssignRoutine,
    assignRoutineSchema,
    createRoutineSchema,
    updateRoutineSchema,
    type CreateRoutine,
    type UpdateRoutine,
} from '@/src/modules/routines/routines.schema';
import { RoutineService } from '@/src/modules/routines/routines.service';
import { createClient } from '@/src/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { getCurrentUserProfile } from './users';

export async function createRoutine(formData: CreateRoutine) {
    // Validar datos del formulario
    const validationResult = createRoutineSchema.safeParse(formData);

    if (!validationResult.success) {
        return {
            error: validationResult.error.message || 'Error de validación',
            success: false,
            data: null,
        };
    }

    try {
        const { profile } = await getCurrentUserProfile();
        const cookieStore = await cookies();
        const supabase = await createClient(cookieStore);

        if (!profile) {
            return {
                error: 'No se pudo obtener el perfil del usuario',
                success: false,
                data: null,
            };
        }

        const routineService = new RoutineService(supabase);

        // Crear rutina usando el servicio
        const newRoutine = await routineService.createRoutine({
            gym_id: validationResult.data.gym_id,
            name: validationResult.data.name,
            description: validationResult.data.description,
            created_by: profile.id,
            exercises: validationResult.data.exercises.map((ex) => ({
                exercise_id: ex.exercise_id,
                order_index: ex.order_index,
                sets: ex.sets,
                reps: ex.reps,
                rest_seconds: ex.rest_seconds,
                notes: ex.notes,
            })),
        });

        revalidatePath('/trainer-dashboard');

        return {
            success: true,
            data: newRoutine,
            error: null,
        };
    } catch (error) {
        console.log('Error creating routine:', error);
        return {
            error: error instanceof Error ? error.message : 'Error desconocido al crear rutina',
            success: false,
            data: null,
        };
    }
}

export async function updateRoutine(routineId: string, formData: UpdateRoutine) {
    // Validar datos del formulario
    const validationResult = updateRoutineSchema.safeParse(formData);

    if (!validationResult.success) {
        return {
            error: validationResult.error.message || 'Error de validación',
            success: false,
            data: null,
        };
    }

    try {
        const { profile } = await getCurrentUserProfile();
        const cookieStore = await cookies();
        const supabase = await createClient(cookieStore);

        if (!profile) {
            return {
                error: 'No se pudo obtener el perfil del usuario',
                success: false,
                data: null,
            };
        }

        const routineService = new RoutineService(supabase);

        

        // Actualizar rutina usando el servicio
        const updatedRoutine = await routineService.updateRoutine(routineId, {
            name: validationResult.data.name,
            description: validationResult.data.description,
            exercises: validationResult.data.exercises.map((ex) => ({
                exercise_id: ex.exercise_id,
                order_index: ex.order_index,
                sets: ex.sets,
                reps: ex.reps,
                rest_seconds: ex.rest_seconds,
                notes: ex.notes,
            })),
        });

        revalidatePath('/trainer-dashboard');
        revalidatePath('/routines');

        return {
            success: true,
            data: updatedRoutine,
            error: null,
        };
    } catch (error) {
        console.log('Error updating routine:', error);
        return {
            error: error instanceof Error ? error.message : 'Error desconocido al actualizar rutina',
            success: false,
            data: null,
        };
    }
}

export async function assignRoutine(formData: AssignRoutine) {
    const validationResult = assignRoutineSchema.safeParse(formData);
    if (!validationResult.success) {
        return { success: false, error: validationResult.error.message ?? 'Error de validación', data: null };
    }
    try {
        const { profile } = await getCurrentUserProfile();
        const cookieStore = await cookies();
        const supabase = await createClient(cookieStore);
        if (!profile) {
            return { success: false, error: 'No se pudo obtener el perfil del usuario', data: null };
        }
        const routineService = new RoutineService(supabase);
        await routineService.assignRoutineToUser({
            profile_id: validationResult.data.profile_id,
            routine_id: validationResult.data.routine_id,
            assigned_by: profile.id,
        });
        revalidatePath('/trainer-dashboard');
        return { success: true, data: null, error: null };
    } catch (error) {
        console.log('Error assigning routine:', error);
        return {
            success: false,
            data: null,
            error: error instanceof Error ? error.message : 'Error desconocido al asignar rutina',
        };
    }
}

export async function getRoutinesByGym(gymId: string) {
    if (!gymId) return { success: false, data: [], error: 'Gimnasio requerido' };
    try {
        const cookieStore = await cookies();
        const supabase = await createClient(cookieStore);
        const routineService = new RoutineService(supabase);
        const data = await routineService.getRoutinesByGym(gymId);
        return { success: true, data: data ?? [], error: null };
    } catch (error) {
        console.log('Error getting routines:', error);
        return {
            success: false,
            data: [],
            error: error instanceof Error ? error.message : 'Error al obtener rutinas',
        };
    }
}

export async function getExercises() {
    try {
        const cookieStore = await cookies();
        const supabase = await createClient(cookieStore);

        const { data, error } = await supabase.from('exercises').select('id, name, description').order('name', { ascending: true });

        if (error) {
            return {
                error: error.message,
                success: false,
                data: [],
            };
        }

        return {
            success: true,
            data: data || [],
            error: null,
        };
    } catch (error) {
        return {
            error: error instanceof Error ? error.message : 'Error desconocido al obtener ejercicios',
            success: false,
            data: [],
        };
    }
}

export async function deleteRoutine(id: string) {
    if (!id) {
        return {
            success: false,
            error: 'ID de rutina requerido',
            data: null,
        };
    }

    try {
        const cookieStore = await cookies();
        const supabase = await createClient(cookieStore);
        const routineService = new RoutineService(supabase);

        await routineService.deleteRoutine(id);

        revalidatePath('/routines');
        revalidatePath('/trainer-dashboard');

        return {
            success: true,
            data: null,
            error: null,
        };
    } catch (error) {
        console.log('Error deleting routine:', error);
        return {
            success: false,
            data: null,
            error: error instanceof Error ? error.message : 'Error desconocido al eliminar rutina',
        };
    }
}

export async function getUserActiveRoutines(profileId: string) {
    if (!profileId) {
        return {
            success: false,
            data: [],
            error: 'ID de perfil requerido',
        };
    }

    try {
        const cookieStore = await cookies();
        const supabase = await createClient(cookieStore);
        const routineService = new RoutineService(supabase);

        const data = await routineService.getUserActiveRoutines(profileId);

        return {
            success: true,
            data: data ?? [],
            error: null,
        };
    } catch (error) {
        console.log('Error getting user active routines:', error);
        return {
            success: false,
            data: [],
            error: error instanceof Error ? error.message : 'Error al obtener rutinas activas del usuario',
        };
    }
}

export async function getRoutineById(id: string) {
    if (!id) {
        return {
            success: false,
            data: null,
            error: 'ID de rutina requerido',
        };
    }

    try {
        const cookieStore = await cookies();
        const supabase = await createClient(cookieStore);
        const routineService = new RoutineService(supabase);

        const data = await routineService.getRoutineById(id);

        return {
            success: true,
            data,
            error: null,
        };
    } catch (error) {
        console.log('Error getting routine by id:', error);
        return {
            success: false,
            data: null,
            error: error instanceof Error ? error.message : 'Error al obtener rutina',
        };
    }
}
