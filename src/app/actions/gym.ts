'use server';

import { createSafeAction } from '@/src/lib/actions/safe-action';
import {
    type CreateGym,
    type UpdateGym,
    createGymSchema,
    updateGymSchema,
} from '@/src/modules/gym/gym.schema';
import { revalidatePath } from 'next/cache';
import { getImageUrl } from './images';

export const createGym = createSafeAction<CreateGym, Record<string, unknown>>({
    name: 'gym.create',
    schema: createGymSchema,
    requiresAuth: true,
    handler: async ({ input, supabase }) => {
        const { data, error } = await supabase
            .from('gyms')
            .insert(input)
            .select()
            .single();

        if (error) {
            throw error;
        }

        revalidatePath('/gyms');

        return data;
    },
});

interface GetGymsInput {
    name: string;
    page: number;
}

export const getGymsNamePaginated = createSafeAction<
    GetGymsInput,
    Record<string, unknown>[]
>({
    name: 'gym.listPaginated',
    handler: async ({ input, supabase }) => {
        const { name, page } = input;
        void name;

        const limit = 6;

        const query = supabase
            .from('gyms')
            .select('*')
            .is('deleted_at', null)
            .order('name', { ascending: true })
            .limit(limit)
            .range(page * limit, (page + 1) * limit - 1);

        const { data, error } = await query;

        if (error) {
            throw error;
        }

        const resolvedGyms: Record<string, unknown>[] = [];

        for (const gym of data) {
            if (!gym.logo_url) {
                continue;
            }
            const imageUrl = await getImageUrl(gym.logo_url);
            resolvedGyms.push({ ...gym, logo_url: imageUrl });
        }

        return resolvedGyms;
    },
});

export const getGymById = createSafeAction<string, Record<string, unknown>>({
    name: 'gym.getById',
    handler: async ({ input: gymId, supabase }) => {
        const { data, error } = await supabase
            .from('gyms')
            .select('*')
            .eq('id', gymId)
            .single();

        if (error) {
            throw error;
        }

        const imageUrl = data.logo_url ? await getImageUrl(data.logo_url) : null;

        return { ...data, logo_url: imageUrl };
    },
});

export const updateGym = createSafeAction<UpdateGym, Record<string, unknown>>({
    name: 'gym.update',
    schema: updateGymSchema,
    requiresAuth: true,
    handler: async ({ input, supabase }) => {
        const { id, ...updateValues } = input;

        const { data, error } = await supabase
            .from('gyms')
            .update(updateValues)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw error;
        }

        revalidatePath('/gyms');

        return data;
    },
});
