"use server"

import { createClient } from "@/src/utils/supabase/server"
import { supabaseAdmin } from "@/src/utils/supabase/admin"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

// UUID v4 pattern for validation
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

/** Get the current user's gym_id (UUID) from profiles. Use this to pass a valid gymId to createMember. */
export async function getMembersGymId(gymId: string): Promise<{ members: UserProfile[] | null; error?: string }> {
  const cookieStore = await cookies()
  const supabase = await createClient(cookieStore)
  try {
    const { data: members } = await supabase
      .from("profiles")
      .select("user_id, name, email, phone")
      .eq("role", "member")
      .eq("gym_id", gymId)
      .order("created_at", { ascending: false });
    return { members: members ?? null }
  } catch (error) {
    console.error(error)
    return { members: null, error: error instanceof Error ? error.message : "Error desconocido al obtener miembros" }
  }
}

export async function createMember(data: {
  email: string
  name: string
  phone?: string
  gymId: string
  role?: "member" | "trainer"
}) {
  const cookieStore = await cookies()
  const supabase = await createClient(cookieStore)

  // gym_id in DB is UUID; reject invalid values to avoid "invalid input syntax for type uuid"
  if (!data.gymId || !UUID_REGEX.test(data.gymId)) {
    return { success: false, error: "Gimnasio no válido. Inicia sesión de nuevo." }
  }

  // 1. Check that the current user has permission (trainer or gym_admin for this gym) from profiles
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser()

  if (!currentUser) {
    return { success: false, error: "No autenticado" }
  }

  // maybeSingle() returns null when 0 rows instead of throwing PGRST116
  const { data: coachProfile } = await supabase
    .from("profiles")
    .select("role, gym_id")
    .eq("user_id", currentUser.id)
    .eq("gym_id", data.gymId)
    .maybeSingle();
    
  if (!coachProfile || !["trainer", "gym_admin"].includes(coachProfile.role)) {
    return { success: false, error: "No tienes permisos" }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  const redirectTo = `${siteUrl}/auth/callback`

  // 2. Invite user by email (creates user in Auth and sends invite email via SMTP)
  const { data: inviteData, error: authError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
    data.email,
    {
      data: {
        name: data.name,
        phone: data.phone,
        gym_id: data.gymId,
        email: data.email,
        role: data.role,
      },
      redirectTo,
    }
  )

  if (authError) {
    return { success: false, error: authError.message }
  }

  const newUser = inviteData?.user
  if (!newUser) {
    return { success: false, error: "No se pudo crear el usuario" }
  }

  return {
    success: true,
    data: newUser,
    message: `Usuario ${data.name} creado. Se ha enviado un correo de invitación.`,
  }
}

export interface UserProfile {
  user_id: string
  name: string
  email: string
  phone?: string | null
  image_url?: string | null
  role?: string | null
  gym_id?: string | null
}

export async function getCurrentUserProfile(): Promise<{
  profile: UserProfile | null
  error?: string
}> {
  const cookieStore = await cookies()
  const supabase = await createClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { profile: null, error: "No autenticado" }
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("user_id, name, email, phone, image_url, role, gym_id")
    .eq("user_id", user.id)
    .maybeSingle()

  if (error) {
    return { profile: null, error: error.message }
  }

  if (!profile) {
    return { profile: null, error: "Perfil no encontrado" }
  }

  return { profile }
}

export async function updateUserProfile(data: {
  name?: string
  phone?: string
  image_url?: string
}): Promise<{ success: boolean; error?: string; message?: string }> {
  const cookieStore = await cookies()
  const supabase = await createClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "No autenticado" }
  }

  const updates: Record<string, unknown> = {}
  if (data.name !== undefined) updates.name = data.name
  if (data.phone !== undefined) updates.phone = data.phone || null
  if (data.image_url !== undefined) updates.image_url = data.image_url || null

  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("user_id", user.id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/profile")

  return { success: true, message: "Perfil actualizado correctamente" }
}