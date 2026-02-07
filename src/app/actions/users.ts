'use server';

import { supabaseAdmin } from '@/src/utils/supabase/admin';
import { createClient } from '@/src/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

// UUID v4 pattern for validation
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** Get members (profiles with role=member) for a gym. */
export async function getProfilesByGym(gymId: string): Promise<{ success: boolean; data: UserProfile[]; error?: string }> {
    if (!gymId) return { success: false, data: [], error: 'Gimnasio requerido' };
    try {
        const cookieStore = await cookies();
        const supabase = await createClient(cookieStore);
        const { data, error } = await supabase
            .from('profiles')
            .select('id, name, email, phone, image_url, role, gym_id')
            .eq('gym_id', gymId)
            .eq('role', 'member')
            .order('created_at', { ascending: false });
        if (error) return { success: false, data: [], error: error.message };
        return { success: true, data: (data ?? []) as UserProfile[], error: undefined };
    } catch (e) {
        return { success: false, data: [], error: e instanceof Error ? e.message : 'Error al obtener clientes' };
    }
}

/** Get the current user's gym_id (UUID) from profiles. Use this to pass a valid gymId to createMember. */
export async function getCurrentUserGymId(): Promise<{ gymId: string | null; error?: string }> {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { gymId: null, error: 'No autenticado' };
    const { data: profile } = await supabase.from('profiles').select('gym_id').eq('id', user.id).maybeSingle();
    return { gymId: profile?.gym_id ?? null };
}

export async function createMember(data: { email: string; name: string; phone?: string; gymId: string; role?: 'member' | 'trainer' }) {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    // gym_id in DB is UUID; reject invalid values to avoid "invalid input syntax for type uuid"
    if (!data.gymId || !UUID_REGEX.test(data.gymId)) {
        return { success: false, error: 'Gimnasio no válido. Inicia sesión de nuevo.' };
    }

    // 1. Check that the current user has permission (trainer or gym_admin for this gym) from profiles
    const {
        data: { user: currentUser },
    } = await supabase.auth.getUser();

    if (!currentUser) {
        return { success: false, error: 'No autenticado' };
    }

    // maybeSingle() returns null when 0 rows instead of throwing PGRST116
    const { data: coachProfile } = await supabase.from('profiles').select('role, gym_id').eq('id', currentUser.id).eq('gym_id', data.gymId).maybeSingle();

    if (!coachProfile || !['trainer', 'gym_admin'].includes(coachProfile.role)) {
        return { success: false, error: 'No tienes permisos' };
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
    const redirectTo = `${siteUrl}/auth/callback`;

    // 2. Invite user by email (creates user in Auth and sends invite email via SMTP)
    const { data: inviteData, error: authError } = await supabaseAdmin.auth.admin.inviteUserByEmail(data.email, {
        data: {
            name: data.name,
            phone: data.phone,
            gym_id: data.gymId,
            email: data.email,
            role: data.role,
        },
        redirectTo,
    });

    if (authError) {
        return { success: false, error: authError.message };
    }

    const newUser = inviteData?.user;
    if (!newUser) {
        return { success: false, error: 'No se pudo crear el usuario' };
    }

    return {
        success: true,
        data: newUser,
        message: `Usuario ${data.name} creado. Se ha enviado un correo de invitación.`,
    };
}

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    image_url?: string | null;
    role?: string | null;
    gym_id?: string | null;
}

export async function getCurrentUserProfile(): Promise<{
    profile: UserProfile | null;
    error?: string;
}> {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { profile: null, error: 'No autenticado' };
    }

    const { data: profile, error } = await supabase.from('profiles').select('id, name, email, phone, image_url, role, gym_id').eq('id', user.id).maybeSingle();

    if (error) {
        return { profile: null, error: error.message };
    }

    if (!profile) {
        return { profile: null, error: 'Perfil no encontrado' };
    }

    return { profile };
}

export async function updateUserProfile(data: { name?: string; phone?: string; image_url?: string }): Promise<{ success: boolean; error?: string; message?: string }> {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: 'No autenticado' };
    }

    const updates: Record<string, unknown> = {};
    if (data.name !== undefined) updates.name = data.name;
    if (data.phone !== undefined) updates.phone = data.phone || null;
    if (data.image_url !== undefined) updates.image_url = data.image_url || null;

    const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath('/profile');

    return { success: true, message: 'Perfil actualizado correctamente' };
}
