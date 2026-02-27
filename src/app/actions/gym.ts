'use server';

import {
    type CreateGym,
    type UpdateGym,
    createGymSchema,
    updateGymSchema,
} from '@/src/modules/gym/gym.schema';
import { createClient } from '@/src/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { getImageUrl } from './images';

export async function createGym(formData: CreateGym) {
    // Validar datos del formulario
    const validationResult = createGymSchema.safeParse(formData);

    if (!validationResult.success) {
        return {
            error: validationResult.error.message || 'Error de validación',
            success: false,
            data: null,
        };
    }

    try {
        const cookieStore = await cookies();
        const supabase = await createClient(cookieStore);

        // Get user Authenticated
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
            return {
                error: 'No se pudo autenticar el usuario',
                success: false,
                data: null,
            };
        }
        const { data, error } = await supabase.from('gyms').insert(formData).select().single();

        if (error) throw error;

        revalidatePath('/gyms');

        return {
            success: true,
            data: data,
            error: null,
        };
    } catch (error) {
        console.error('Error creating gym:', error);
        return {
            error: error instanceof Error ? error.message : 'Error desconocido al crear gimnasio',
            success: false,
            data: null,
        };
    }
}

export async function getGymsNamePaginated(name: string = '', page: number = 0) {
    console.log('name', name);
    console.log('page', page);
    // TODO : Validate data from the form zod schema
    try {
        const cookieStore = await cookies();
        const supabase = await createClient(cookieStore);

        const limit = 6;

        let query = supabase
            .from('gyms')
            .select('*')
            .is('deleted_at', null)
            .order('name', { ascending: true })
            .limit(limit)
            .range(page * limit, (page + 1) * limit - 1);
        // .eq('gym_id', gymId) // TODO: add gym_id to the query

        // // If name is provided, add the filter to the query
        // if (name && name.trim().length > 0) {
        //     query = query.ilike('name', `%${name}%`);
        // }

        const { data, error, count } = await query;

        console.log('data', data);
        console.log('error', error);
        console.log('count', count);

        if (error) {
            console.log('error', error);
            return {
                error: error.message,
                success: false,
                data: [],
                count: 0,
                hasMore: false,
            };
        }

        // Get image url for each gym
        let newData = [];
        for (const gym of data) {
            if (!gym.logo_url) continue;
            const imageUrl = await getImageUrl(gym.logo_url ?? '');
            newData.push({ ...gym, logo_url: imageUrl });
        }

        return {
            data: newData,
            success: true,
            error: null,
            count: count || 0,
            hasMore: count && count > page * limit,
        };
    } catch (error) {
        console.error('Error getting gyms:', error);
        return {
            error: error instanceof Error ? error.message : 'Unknown error getting gyms',
            success: false,
            data: [],
        };
    }
}

// get gym by id
export async function getGymById(gymId: string) {
    try {
        const cookieStore = await cookies();
        const supabase = await createClient(cookieStore);

        const { data, error } = await supabase.from('gyms').select('*').eq('id', gymId).single();

        if (error) throw error;

        const imageUrl = await getImageUrl(data.logo_url ?? '');
        const newData = { ...data, logo_url: imageUrl };

        return {
            data: newData,
        };
    } catch (error) {
        console.error('Error getting gym by id:', error);
        return {
            error: error instanceof Error ? error.message : 'Error desconocido al obtener gimnasio',
            success: false,
            data: null,
        };
    }
}

export async function updateGym(gymId: string, formData: UpdateGym) {
    const validationResult = updateGymSchema.safeParse(formData);

    if (!validationResult.success) {
        return {
            error: validationResult.error.message || 'Error de validación',
            success: false,
            data: null,
        };
    }

    try {
        const cookieStore = await cookies();
        const supabase = await createClient(cookieStore);

        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
            return {
                error: 'No se pudo autenticar el usuario',
                success: false,
                data: null,
            };
        }

        const { id, ...updateValues } = validationResult.data;

        const { data, error } = await supabase
            .from('gyms')
            .update(updateValues)
            .eq('id', gymId)
            .select()
            .single();

        if (error) {
            throw error;
        }

        revalidatePath('/gyms');

        return {
            success: true,
            data,
            error: null,
        };
    } catch (error) {
        console.error('Error updating gym:', error);
        return {
            error:
                error instanceof Error ? error.message : 'Error desconocido al actualizar gimnasio',
            success: false,
            data: null,
        };
    }
}
