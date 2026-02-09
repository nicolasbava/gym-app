import z from 'zod';

export const registerFormSchema = z
    .object({
        name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres').max(100, 'El nombre no debe tener más de 100 caracteres'),
        email: z.email('El email no es válido'),
        password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
        confirmPassword: z.string(),
        phone: z.string().optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Las contraseñas no coinciden',
        path: ['confirmPassword'],
    });

export const updateUserProfileSchema = z.object({
    name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres').max(100, 'El nombre no debe tener más de 100 caracteres'),
    phone: z.string().optional(),
    image_url: z.string().optional(),
});

// Infer types

export type RegisterFormData = z.infer<typeof registerFormSchema>;
export type UpdateUserProfileData = z.infer<typeof updateUserProfileSchema>;
