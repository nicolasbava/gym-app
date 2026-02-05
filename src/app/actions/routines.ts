"use server"

import { createClient } from "@/src/utils/supabase/server"
import { cookies } from "next/headers"
import { createRoutineSchema, type CreateRoutine } from "@/src/modules/routines/routines.schema"
import { RoutineService } from "@/src/modules/routines/routines.service"
import { revalidatePath } from "next/cache"

export async function createRoutine(formData: CreateRoutine) {
  // Validar datos del formulario
  const validationResult = createRoutineSchema.safeParse(formData)
  
  if (!validationResult.success) {
    return {
      error: validationResult.error.message || "Error de validación",
      success: false,
      data: null,
    }
  }

  try {
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    // Obtener usuario actual
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return {
        error: "No se pudo autenticar el usuario",
        success: false,
        data: null,
      }
    }

    const routineService = new RoutineService(supabase)

    // Crear rutina usando el servicio
    const newRoutine = await routineService.createRoutine({
      gym_id: 'be1adca7-2e47-4f30-b99f-de3839d85073',
      name: validationResult.data.name,
      description: validationResult.data.description,
      created_by: user.id,
      exercises: validationResult.data.exercises.map(ex => ({
        exercise_id: ex.exercise_id,
        order_index: ex.order_index,
        sets: ex.sets,
        reps: ex.reps,
        rest_seconds: ex.rest_seconds,
        notes: ex.notes,
      })),
    })

    revalidatePath("/trainer-dashboard")
    
    return {
      success: true,
      data: newRoutine,
      error: null,
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Error desconocido al crear rutina",
      success: false,
      data: null,
    }
  }
}

export async function getExercises() {
  try {
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    const { data, error } = await supabase
      .from('exercises2')
      .select('id, name, description')
      .order('name', { ascending: true })

    if (error) {
      return {
        error: error.message,
        success: false,
        data: [],
      }
    }

    return {
      success: true,
      data: data || [],
      error: null,
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Error desconocido al obtener ejercicios",
      success: false,
      data: [],
    }
  }
}
