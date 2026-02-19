'use client';

import { updatePassword } from '@/src/app/actions/auth';
import { Button } from '@/src/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/src/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/src/components/ui/form';
import { Input } from '@/src/components/ui/input';
import { UpdatePasswordFormData, updatePasswordSchema } from '@/src/modules/users/register.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, Dumbbell, Lock } from 'lucide-react';
import Link from 'next/link';
import { Suspense, useState } from 'react';
import { useForm } from 'react-hook-form';

function UpdatePasswordForm() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<UpdatePasswordFormData>({
        resolver: zodResolver(updatePasswordSchema),
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
    });

    const onSubmit = async (data: UpdatePasswordFormData) => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await updatePassword(data.password);

            if (result.success) {
                setIsSubmitted(true);
            } else {
                setError(result.error || 'Error al actualizar la contraseña');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error inesperado');
        } finally {
            setIsLoading(false);
        }
    };

    const inputClassName =
        'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white';

    if (isSubmitted) {
        return (
            <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader className="text-center pb-2">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                    </div>
                    <CardTitle className="text-gray-900 text-2xl font-semibold">
                        Contraseña Actualizada
                    </CardTitle>
                    <CardDescription className="text-gray-600 text-sm">
                        Tu contraseña ha sido actualizada correctamente.
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                    <div className="space-y-4">
                        <p className="text-sm text-gray-600 text-center">
                            Ya puedes iniciar sesión con tu nueva contraseña.
                        </p>
                        <Link href="/auth">
                            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
                                Ir al inicio de sesión
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <Lock className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-gray-900 text-2xl font-semibold">
                    Cambiar Contraseña
                </CardTitle>
                <CardDescription className="text-gray-600 text-sm">
                    Ingresa tu nueva contraseña
                </CardDescription>
            </CardHeader>

            <CardContent className="pt-4">
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        {error}
                    </div>
                )}

                <Form {...form}>
                    <form
                        onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium text-gray-700">
                                        Nueva Contraseña
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="password"
                                            placeholder="Mínimo 8 caracteres"
                                            className={inputClassName}
                                            disabled={isLoading}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium text-gray-700">
                                        Confirmar Contraseña
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="password"
                                            placeholder="Confirma tu nueva contraseña"
                                            className={inputClassName}
                                            disabled={isLoading}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Actualizando...' : 'Actualizar Contraseña'}
                        </Button>
                    </form>
                </Form>

                <div className="mt-6 text-center">
                    <Link
                        href="/auth"
                        className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer"
                    >
                        ← Volver al inicio de sesión
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}

export default function PasswordChangePage() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="flex items-center justify-center gap-3 mb-8">
                    <div className="bg-blue-600 p-3 rounded-lg">
                        <Dumbbell className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Luxion</h1>
                </div>

                <Suspense
                    fallback={
                        <Card className="bg-white border border-gray-200 shadow-sm">
                            <CardContent className="p-6">
                                <div className="text-center text-gray-600">Cargando...</div>
                            </CardContent>
                        </Card>
                    }
                >
                    <UpdatePasswordForm />
                </Suspense>
            </div>
        </div>
    );
}
