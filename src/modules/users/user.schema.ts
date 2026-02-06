import z from "zod";

export const createUserSchema = z.object({
    name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres').max(100,'El nombre no debe tener más de 100 caracteres'),
    email: z.email('El email no es válido'),
    password_hash: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
    created_at: z.date().optional(),
    updated_at: z.date().optional(),
    image_url: z.string().optional(),
    phone: z.string().optional(),
});

export type CreateUser = z.infer<typeof createUserSchema>;