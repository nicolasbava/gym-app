'use client';

import { createGym, updateGym } from '@/src/app/actions/gym';
import { getUser } from '@/src/app/actions/auth';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/src/components/ui/form';
import { Input } from '@/src/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/src/components/ui/select';
import { Button } from '@/src/components/ui/button';
import {
    type CreateGym,
    type Gym,
    createGymSchema,
} from '@/src/modules/gym/gym.schema';
import { uploadGymImage } from '@/src/modules/gym/useUploadGymImage';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_IMAGE_SIZE_MB = 5;

interface GymFormProps {
    gym?: Gym;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export default function GymForm({ gym, onSuccess, onCancel }: GymFormProps) {
    const queryClient = useQueryClient();
    const isEditing = !!gym;
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
    const pendingImageFileRef = useRef<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const defaultValues = useMemo<CreateGym>(() => {
        if (gym) {
            return {
                name: gym.name,
                subscription_status: gym.subscription_status,
                logo_url: gym.logo_url ?? undefined,
                coach_admin: gym.coach_admin,
            };
        }

        return {
            name: '',
            subscription_status: 'active',
            logo_url: undefined,
            coach_admin: '',
        };
    }, [gym]);

    const form = useForm<CreateGym>({
        resolver: zodResolver(createGymSchema),
        defaultValues,
    });

    useEffect(() => {
        form.reset(defaultValues);
    }, [defaultValues, form]);

    useEffect(() => {
        let cancelled = false;

        const loadUser = async () => {
            if (gym) {
                return;
            }

            try {
                const user = await getUser();
                if (user && !cancelled) {
                    form.setValue('coach_admin', user.id);
                }
            } catch (error) {
                console.error('Error loading user for coach_admin:', error);
            }
        };

        void loadUser();

        return () => {
            cancelled = true;
        };
    }, [form, gym]);

    useEffect(() => {
        return () => {
            if (imagePreviewUrl) {
                URL.revokeObjectURL(imagePreviewUrl);
            }
        };
    }, [imagePreviewUrl]);

    const handleImageChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) {
            setImageFile(null);
            setImagePreviewUrl((previous) => {
                if (previous) {
                    URL.revokeObjectURL(previous);
                }
                return null;
            });
            return;
        }

        if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
            return;
        }

        if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
            return;
        }

        setImagePreviewUrl((previous) => {
            if (previous) {
                URL.revokeObjectURL(previous);
            }
            return URL.createObjectURL(file);
        });
        setImageFile(file);
    }, []);

    const handleClearImage = useCallback(() => {
        setImageFile(null);
        setImagePreviewUrl((previous) => {
            if (previous) {
                URL.revokeObjectURL(previous);
            }
            return null;
        });
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, []);

    const gymMutation = useMutation({
        mutationFn: async (values: CreateGym) => {
            if (isEditing && gym) {
                const result = await updateGym(gym.id, {
                    ...values,
                    id: gym.id,
                });
                if (!result.success) {
                    throw new Error(result.error || 'Error al actualizar el gimnasio');
                }
                return result;
            }

            const result = await createGym(values);
            if (!result.success) {
                throw new Error(result.error || 'Error al crear el gimnasio');
            }
            return result;
        },
        onSuccess: async (result) => {
            const createdGym = result.data as Gym | null;
            const gymId = createdGym?.id ?? gym?.id;

            if (gymId && pendingImageFileRef.current) {
                try {
                    await uploadGymImage(gymId, pendingImageFileRef.current);
                } catch (error) {
                    console.error('Error uploading gym image:', error);
                } finally {
                    pendingImageFileRef.current = null;
                }
            }

            await queryClient.invalidateQueries({
                queryKey: ['gyms'],
                exact: false,
            });
            await queryClient.refetchQueries({
                queryKey: ['gyms'],
                exact: false,
            });

            if (!isEditing) {
                form.reset({
                    name: '',
                    subscription_status: 'active',
                    logo_url: undefined,
                    coach_admin: form.getValues('coach_admin'),
                });
                handleClearImage();
            }

            onSuccess?.();
        },
    });

    const onSubmit = (values: CreateGym) => {
        pendingImageFileRef.current = imageFile ?? null;
        gymMutation.mutate(values);
    };

    const currentLogo = imagePreviewUrl ?? gym?.logo_url ?? undefined;

    return (
        <>
            {gymMutation.isError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {gymMutation.error instanceof Error
                        ? gymMutation.error.message
                        : `Error al ${isEditing ? 'actualizar' : 'crear'} el gimnasio`}
                </div>
            )}

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="p-6 space-y-6"
                >
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Gym name</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="e.g., FitPro Gym"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="subscription_status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Subscription status</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="inactive">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Gym logo
                            </label>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept={ACCEPTED_IMAGE_TYPES.join(',')}
                                onChange={handleImageChange}
                                className="block w-full text-sm text-gray-700
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-md file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-blue-50 file:text-blue-700
                                    hover:file:bg-blue-100
                                    cursor-pointer"
                            />
                            <p className="text-xs text-gray-500">
                                PNG, JPG, WEBP o GIF. Máximo {MAX_IMAGE_SIZE_MB}MB.
                            </p>

                            {currentLogo && (
                                <div className="mt-3">
                                    <p className="text-xs text-gray-500 mb-1">Vista previa</p>
                                    <img
                                        src={currentLogo}
                                        alt="Gym logo preview"
                                        className="w-24 h-24 object-cover rounded-lg border"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="space-y-1 text-xs text-gray-500">
                            <p>
                                El gimnasio se creará con el usuario actual como coach admin.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="submit"
                            className="flex-1 bg-blue-600 hover:bg-blue-700"
                            disabled={gymMutation.isPending}
                        >
                            {gymMutation.isPending
                                ? isEditing
                                    ? 'Actualizando gimnasio...'
                                    : 'Creando gimnasio...'
                                : isEditing
                                  ? 'Actualizar gimnasio'
                                  : 'Crear gimnasio'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            className="flex-1"
                        >
                            Cancelar
                        </Button>
                    </div>
                </form>
            </Form>
        </>
    );
}
