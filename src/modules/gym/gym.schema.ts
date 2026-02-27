import { z } from 'zod';

// create table public.gyms (
//     id uuid not null default gen_random_uuid (),
//     created_at timestamp with time zone not null default now(),
//     name text null,
//     logo_url text null,
//     subscription_status text null,
//     coach_admin uuid null,
//     deleted_at timestamp with time zone null,
//     constraint gyms2_pkey primary key (id),
//     constraint gyms_coach_admin_fkey foreign KEY (coach_admin) references profiles (id)
//   ) TABLESPACE pg_default;

export const baseGymSchema = z.object({
    name: z.string().min(1, 'El nombre del gimnasio es requerido'),
    subscription_status: z.string().min(1, 'El estado de suscripción es requerido'),
    logo_url: z.string().optional(),
    coach_admin: z.string().min(1, 'El administrador del gimnasio es requerido'),
});

export const createGymSchema = baseGymSchema;

export const gymSchema = baseGymSchema.extend({
    id: z.string().min(1, 'El ID es requerido'),
    created_at: z.date().optional(),
    deleted_at: z.date().optional(),
});

export const getGymSchema = createGymSchema;

export const updateGymSchema = baseGymSchema.extend({
    id: z.string().min(1, 'El ID es requerido'),
});

// Infer types
export type Gym = z.infer<typeof gymSchema>;
export type CreateGym = z.infer<typeof createGymSchema>;
export type GetGym = z.infer<typeof getGymSchema>;
export type UpdateGym = z.infer<typeof updateGymSchema>;
