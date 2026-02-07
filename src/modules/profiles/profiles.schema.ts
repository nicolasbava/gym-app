import z from "zod"

export const profileSchema = z.object({
    id: z.string().min(1, 'El ID es requerido'),
    user_id: z.string().min(1, 'El ID es requerido'),
    name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres').max(100, 'El nombre no debe tener más de 100 caracteres'),
    email: z.email('El email no es válido'),
    phone: z.string().optional(),
    image_url: z.string().optional(),
    role: z.string().optional(),
    gym_id: z.string().optional(),
    created_at: z.date().optional(),
    updated_at: z.date().optional(),
})

export type Profile = z.infer<typeof profileSchema>
