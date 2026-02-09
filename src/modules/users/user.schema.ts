import z from 'zod';

export enum memberRole {
    MEMBER = 'member',
    COACH = 'coach',
    COACH_ADMIN = 'coach_admin',
}

export const createUserSchema = z.object({
    name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres').max(100, 'El nombre no debe tener más de 100 caracteres'),
    email: z.email('El email no es válido'),
    created_at: z.date().optional(),
    updated_at: z.date().optional(),
    image_url: z.string().optional(),
    phone: z.string().optional(),
    gym_id: z.string().min(1, 'El ID del gimnasio es requerido'),
    role: z.enum(memberRole),
});

export type CreateUser = z.infer<typeof createUserSchema>;
