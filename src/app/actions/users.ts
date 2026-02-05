"use server"

import { createClient } from "@/src/utils/supabase/server"
import { cookies } from "next/headers"
import { registerFormSchema, type RegisterFormData } from "@/src/modules/users/register.schema"
import { redirect } from "next/navigation"

export async function registerUser(formData: RegisterFormData) {
  // Validar datos del formulario
  const validationResult = registerFormSchema.safeParse(formData)
  
  if (!validationResult.success) {
    return {
      error: validationResult.error.message || "Error de validación",
      success: false,
    }
  }

  const { email, password, name, phone } = validationResult.data

  try {
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    // Crear usuario en Supabase Auth (esto maneja el hash automáticamente)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          phone: phone || null,
        },
      },
    })

    if (authError) {
      return {
        error: authError.message || "Error al crear el usuario",
        success: false,
      }
    }

    if (!authData.user) {
      return {
        error: "No se pudo crear el usuario",
        success: false,
      }
    }

    // Opcional: Si tienes una tabla 'users' separada, puedes crear el perfil aquí
    // const { error: profileError } = await supabase
    //   .from('users')
    //   .insert({
    //     id: authData.user.id,
    //     name,
    //     email,
    //     phone: phone || null,
    //   })

    // if (profileError) {
    //   return {
    //     error: "Error al crear el perfil del usuario",
    //     success: false,
    //   }
    // }

    // Redirigir al dashboard después del registro exitoso
    redirect("/dashboard")
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Error desconocido al registrar usuario",
      success: false,
    }
  }
}
