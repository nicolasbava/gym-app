'use server';

import { Profile } from '@/src/modules/profiles/profiles.schema';
import { CreateUser, memberRole } from '@/src/modules/users/user.schema';
import { supabaseAdmin } from '@/src/utils/supabase/admin';
import { createClient } from '@/src/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    image_url?: string | null;
    role?: string | null;
    gym_id?: string | null;
    deleted_at?: string | null;
}

// UUID v4 pattern for validation
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** Get members (profiles with role=member) for a gym. */
export async function getProfilesByGym(
    gymId: string,
): Promise<{ success: boolean; data: UserProfile[]; error?: string }> {
    if (!gymId) return { success: false, data: [], error: 'Gimnasio requerido' };
    try {
        const cookieStore = await cookies();
        const supabase = await createClient(cookieStore);
        const { data, error } = await supabase
            .from('profiles')
            .select('id, name, email, phone, image_url, role, gym_id')
            .eq('gym_id', gymId)
            // .eq('role', 'member')
            .is('deleted_at', null)
            .order('created_at', { ascending: false });
        if (error) return { success: false, data: [], error: error.message };
        return { success: true, data: (data ?? []) as UserProfile[], error: undefined };
    } catch (e) {
        return {
            success: false,
            data: [],
            error: e instanceof Error ? e.message : 'Error al obtener clientes',
        };
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
    const { data: profile } = await supabase
        .from('profiles')
        .select('gym_id')
        .eq('id', user.id)
        .maybeSingle();
    return { gymId: profile?.gym_id ?? null };
}

export async function createMember(data: CreateUser) {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);
    // gym_id in DB is UUID; reject invalid values to avoid "invalid input syntax for type uuid"
    if (!data.gym_id || !UUID_REGEX.test(data.gym_id)) {
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
    const { data: coachProfile } = await supabase
        .from('profiles')
        .select('role, gym_id')
        .eq('id', currentUser.id)
        .eq('gym_id', data.gym_id)
        .maybeSingle();

    if (!coachProfile || ![memberRole.COACH, memberRole.COACH_ADMIN].includes(coachProfile.role)) {
        return { success: false, error: 'No tienes permisos' };
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
    const redirectTo = `${siteUrl}/auth/callback`;

    // 2. Invite user by email (creates user in Auth and sends invite email via SMTP)
    const { data: inviteData, error: authError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
        data.email,
        {
            data: {
                name: data.name,
                phone: data.phone,
                gym_id: data.gym_id,
                email: data.email,
                role: data.role,
            },
            redirectTo,
        },
    );

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

export async function getCurrentUserProfile(): Promise<{
    profile: Profile | null;
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

    const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

    if (error) {
        return { profile: null, error: error.message };
    }

    if (!profile) {
        return { profile: null, error: 'Perfil no encontrado' };
    }

    return { profile };
}

/** Update a member's profile (trainer only, same gym). */
export async function updateMember(
    profileId: string,
    data: { name?: string; phone?: string },
): Promise<{ success: boolean; error?: string; message?: string }> {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'No autenticado' };

    const { data: coachProfile } = await supabase
        .from('profiles')
        .select('role, gym_id')
        .eq('id', user.id)
        .maybeSingle();
    if (!coachProfile || !['coach', 'coach_admin'].includes(coachProfile.role ?? '')) {
        return { success: false, error: 'No tienes permisos para editar este perfil' };
    }

    const { data: memberProfile } = await supabase
        .from('profiles')
        .select('gym_id')
        .eq('id', profileId)
        .eq('role', 'member')
        .maybeSingle();
    if (!memberProfile) return { success: false, error: 'Cliente no encontrado' };
    if (memberProfile.gym_id !== coachProfile.gym_id) {
        return { success: false, error: 'No tienes permisos para editar este perfil' };
    }

    const updates: Record<string, unknown> = {};
    if (data.name !== undefined) updates.name = data.name;
    if (data.phone !== undefined) updates.phone = data.phone ?? null;

    const { error } = await supabase.from('profiles').update(updates).eq('id', profileId);

    if (error) return { success: false, error: error.message };

    revalidatePath('/trainer-dashboard');
    revalidatePath(`/member/${profileId}`);

    return { success: true, message: 'Perfil actualizado correctamente' };
}

export async function deleteProfile(
    profileId: string,
): Promise<{ success: boolean; error?: string; message?: string }> {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);
    // const { error } = await supabase.from('profiles').delete().eq('id', profileId);

    const { error } = await supabase
        .from('profiles')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', profileId);
    if (error) return { success: false, error: error.message };
    revalidatePath('/trainer-dashboard');
    revalidatePath(`/member/${profileId}`);
    return { success: true, message: 'Perfil eliminado correctamente' };
}
