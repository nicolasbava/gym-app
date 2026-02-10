'use client';

import { getUser } from '@/src/app/actions/auth';
import { createExercise, getEquipmentTypes, getMuscleGroups, updateExercise } from '@/src/app/actions/exercises';
import { Button } from '@/src/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form';
import { Input } from '@/src/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { Textarea } from '@/src/components/ui/textarea';
import { createExerciseSchema, type CreateExercise, type UpdateExercise } from '@/src/modules/exercises/exercises.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

interface Exercise {
    id: string;
    name: string;
    description?: string;
    muscle_group?: string;
    equipment?: string;
}

interface CreateExerciseFormProps {
    gymId: string;
    exercise?: Exercise; // Si existe, es modo edición
    onSuccess?: () => void;
    setOpen?: (open: boolean) => void; // Para cerrar el diálogo desde fuera
}

export default function CreateExerciseForm({ gymId, exercise, onSuccess, setOpen }: CreateExerciseFormProps) {
    const queryClient = useQueryClient();
    const isEditing = !!exercise;

    // Preparar valores por defecto basados en si estamos editando o creando
    const defaultValues = useMemo(() => {
        if (exercise) {
            // Modo edición: prellenar con datos del ejercicio
            return {
                name: exercise.name,
                description: exercise.description || '',
                muscle_group: exercise.muscle_group || '',
                created_by: '',
            };
        }
        // Modo creación: valores por defecto
        return {
            name: '',
            description: '',
            muscle_group: '',
            created_by: '',
        };
    }, [exercise]);

    const form = useForm<CreateExercise>({
        resolver: zodResolver(createExerciseSchema),
        defaultValues,
    });

    // Load muscle groups and equipment types using React Query
    const {
        data: muscleGroups = [],
        isLoading: loadingMuscleGroups,
        error: muscleGroupsError,
    } = useQuery({
        queryKey: ['muscleGroups'],
        queryFn: getMuscleGroups,
    });

    const {
        data: equipmentTypes = [],
        isLoading: loadingEquipmentTypes,
        error: equipmentTypesError,
    } = useQuery({
        queryKey: ['equipmentTypes'],
        queryFn: getEquipmentTypes,
    });

    // Load user and set created_by field
    useEffect(() => {
        const loadUser = async () => {
            try {
                const user = await getUser();
                if (user) {
                    form.setValue('created_by', user.id);
                }
            } catch (err) {
                console.error('Error loading user:', err);
            }
        };
        loadUser();
    }, [form]);

    // Reset form when exercise prop changes
    useEffect(() => {
        if (exercise) {
            form.reset(defaultValues);
        }
    }, [exercise?.id]); // eslint-disable-line react-hooks/exhaustive-deps

    // Create or update exercise mutation
    const exerciseMutation = useMutation({
        mutationFn: async (data: CreateExercise) => {
            if (isEditing && exercise) {
                // Modo edición: actualizar ejercicio
                const updateData: UpdateExercise = {
                    name: data.name,
                    description: data.description,
                    muscle_group: data.muscle_group,
                };
                const result = await updateExercise(exercise.id, updateData);
                if (!result.success) {
                    throw new Error(result.error || 'Error al actualizar el ejercicio');
                }
                return result;
            } else {
                // Modo creación: crear nuevo ejercicio
                const result = await createExercise(data);
                if (!result.success) {
                    throw new Error(result.error || 'Error al crear el ejercicio');
                }
                return result;
            }
        },
        onSuccess: async () => {
            // Invalidate and refetch exercises queries to ensure list is updated
            await queryClient.invalidateQueries({
                queryKey: ['exercises'],
                exact: false,
            });
            // Force refetch to ensure immediate update
            await queryClient.refetchQueries({
                queryKey: ['exercises'],
                exact: false,
            });

            if (!isEditing) {
                // Solo resetear el formulario si estamos creando
                form.reset({
                    name: '',
                    description: '',
                    muscle_group: '',
                    created_by: form.getValues('created_by'),
                });
            }

            // Call success callback if provided
            if (onSuccess) {
                onSuccess();
            }
        },
    });

    const onSubmit = async (data: CreateExercise) => {
        exerciseMutation.mutate(data);
    };

    return (
        <>
            {exerciseMutation.isError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {exerciseMutation.error instanceof Error
                        ? exerciseMutation.error.message
                        : `Error al ${isEditing ? 'actualizar' : 'crear'} el ejercicio`}
                </div>
            )}

            {(muscleGroupsError || equipmentTypesError) && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm">
                    Error al cargar opciones. Por favor, recarga la página.
                </div>
            )}

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700">Nombre del Ejercicio</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="Ej: Press de banca plano"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        disabled={exerciseMutation.isPending}
                                    />
                                </FormControl>
                                <FormMessage className="text-red-600 text-sm" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700">Descripción (opcional)</FormLabel>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        rows={3}
                                        placeholder="Describe cómo realizar el ejercicio, técnica, músculos trabajados..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        disabled={exerciseMutation.isPending}
                                    />
                                </FormControl>
                                <FormMessage className="text-red-600 text-sm" />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="muscle_group"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium text-gray-700">Grupo Muscular</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        disabled={exerciseMutation.isPending || loadingMuscleGroups}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
                                                <SelectValue placeholder="Selecciona grupo muscular">
                                                    {loadingMuscleGroups
                                                        ? 'Cargando grupos musculares...'
                                                        : muscleGroups.find((g) => g === field.value) || 'Selecciona grupo muscular'}
                                                </SelectValue>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="max-h-[200px]">
                                            {muscleGroups.map((group) => (
                                                <SelectItem key={group} value={group}>
                                                    {group}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="text-red-600 text-sm" />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium cursor-pointer"
                            disabled={exerciseMutation.isPending}
                        >
                            {exerciseMutation.isPending
                                ? isEditing
                                    ? 'Actualizando...'
                                    : 'Creando...'
                                : isEditing
                                ? 'Actualizar Ejercicio'
                                : 'Crear Ejercicio'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                if (setOpen) {
                                    setOpen(false);
                                } else if (isEditing && exercise) {
                                    // Resetear a los valores originales del ejercicio
                                    form.reset(defaultValues);
                                } else {
                                    form.reset({
                                        name: '',
                                        description: '',
                                        muscle_group: '',
                                        created_by: form.getValues('created_by'),
                                    });
                                }
                                if (onSuccess) {
                                    onSuccess();
                                }
                            }}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium cursor-pointer border-0"
                            disabled={exerciseMutation.isPending}
                        >
                            Cancelar
                        </Button>
                    </div>
                </form>
            </Form>
        </>
    );
}
