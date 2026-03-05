'use client';

import { getUser } from '@/src/app/actions/auth';
import { createRoutine, getExercises, updateRoutine } from '@/src/app/actions/routines';
import { Button } from '@/src/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/src/components/ui/form';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/src/components/ui/select';
import { Textarea } from '@/src/components/ui/textarea';
import {
    createRoutineInputSchema,
    type CreateRoutineInput,
    type RoutineWithExercises,
    type UpdateRoutine,
} from '@/src/modules/routines/routines.schema';
import { uploadRoutineImage } from '@/src/modules/routines/useUploadRoutineImage';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { GripVertical, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_IMAGE_SIZE_MB = 5;

interface Exercise {
    id: string;
    name: string;
    description?: string;
    muscle_group?: string;
    equipment?: string;
}

interface CreateRoutineDialogProps {
    gymId: string;
    routine?: RoutineWithExercises; // Si existe, es modo edición
    onSuccess?: () => void;
    handleCancel?: () => void;
}

export default function CreateRoutineForm({
    gymId,
    routine,
    onSuccess,
    handleCancel = () => {},
}: CreateRoutineDialogProps) {
    const queryClient = useQueryClient();
    const isEditing = !!routine;
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
    const pendingImageFileRef = useRef<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Preparar valores por defecto basados en si estamos editando o creando
    const defaultValues = useMemo(() => {
        if (routine) {
            // Modo edición: prellenar con datos de la rutina
            return {
                gym_id: routine.gym_id,
                name: routine.name,
                description: routine.description || '',
                created_by: routine.created_by,
                image_url: routine.image_url,
                exercises:
                    routine.routine_exercises.length > 0
                        ? routine.routine_exercises.map((ex, index) => ({
                              exercise_id: ex.exercise_id,
                              order_index: index,
                              sets: parseInt(ex.sets) || 3,
                              reps: ex.reps || '8-12',
                              rest_seconds: parseInt(ex.rest_seconds) || 60,
                              notes: ex.notes || '',
                              weight: ex.weight || '',
                          }))
                        : [
                              {
                                  exercise_id: '',
                                  order_index: 0,
                                  sets: 3,
                                  reps: '8-12',
                                  rest_seconds: 60,
                                  notes: '',
                                  weight: '',
                              },
                          ],
            };
        }
        // Modo creación: valores por defecto
        return {
            gym_id: gymId,
            name: '',
            description: '',
            created_by: '',
            exercises: [
                {
                    exercise_id: '',
                    order_index: 0,
                    sets: 3,
                    reps: '8-12',
                    rest_seconds: 60,
                    notes: '',
                    weight: '',
                },
            ],
        };
    }, [routine, gymId]);

    const form = useForm<CreateRoutineInput>({
        resolver: zodResolver(createRoutineInputSchema),
        defaultValues,
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'exercises',
    });

    // Load exercises using React Query
    const {
        data: exercises = [],
        isLoading: loadingExercises,
        error: exercisesError,
    } = useQuery({
        queryKey: ['exercises'],
        queryFn: async () => {
            const result = await getExercises();
            if (!result.success || !result.data) {
                throw new Error(result.error || 'Error al cargar ejercicios');
            }
            return result.data as Exercise[];
        },
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

    // Reset form when routine prop changes
    useEffect(() => {
        if (routine) {
            form.reset(defaultValues);
        }
    }, [routine?.id]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        return () => {
            if (imagePreviewUrl) {
                URL.revokeObjectURL(imagePreviewUrl);
            }
        };
    }, [imagePreviewUrl]);

    const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            setImageFile(null);
            setImagePreviewUrl((prev) => {
                if (prev) URL.revokeObjectURL(prev);
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
        setImagePreviewUrl((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return URL.createObjectURL(file);
        });
        setImageFile(file);
    }, []);

    const handleClearImage = useCallback(() => {
        setImageFile(null);
        setImagePreviewUrl((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return null;
        });
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, []);

    // Create or update routine mutation
    const routineMutation = useMutation({
        mutationFn: async (data: CreateRoutineInput) => {
            if (isEditing && routine) {
                // UPDATE METHOD
                try {
                    let uploadedImageUrl: string | undefined;
                    if (pendingImageFileRef.current) {
                        const imageUrl = await uploadRoutineImage(pendingImageFileRef.current);
                        uploadedImageUrl = imageUrl;
                    }

                    const updateData: UpdateRoutine = {
                        id: routine.id,
                        name: data.name,
                        description: data.description,
                        exercises: data.exercises,
                        updated_at: new Date().toISOString(),
                        gym_id: data.gym_id,
                        image_url: uploadedImageUrl ?? routine.image_url ?? undefined,
                    };

                    const result = await updateRoutine(updateData);
                    if (!result.success) {
                        throw new Error(result.error || 'Error al actualizar la rutina');
                    }
                    return result;
                } catch (err) {
                    console.error('Error updating routine:', err);
                    throw err;
                } finally {
                    pendingImageFileRef.current = null;
                }
            } else {
                // Modo creación: crear nueva rutina
                try {
                    let uploadedImageUrl: string | undefined;
                    if (pendingImageFileRef.current) {
                        const imageUrl = await uploadRoutineImage(pendingImageFileRef.current);
                        uploadedImageUrl = imageUrl;
                    }

                    const newData = { ...data, image_url: uploadedImageUrl };

                    const result = await createRoutine(newData);

                    if (!result.success) {
                        throw new Error(result.error || 'Error al crear la rutina');
                    }
                    return result;
                } catch (err) {
                    console.error('Error uploading routine image:', err);
                }
                pendingImageFileRef.current = null;
            }
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['routines'],
                exact: false,
            });
            await queryClient.refetchQueries({
                queryKey: ['routines'],
                exact: false,
            });

            if (!isEditing) {
                form.reset({
                    gym_id: gymId,
                    name: '',
                    description: '',
                    image_url: undefined,
                    created_by: form.getValues('created_by'),
                    exercises: [
                        {
                            exercise_id: '',
                            order_index: 0,
                            sets: 3,
                            reps: '8-12',
                            rest_seconds: 60,
                            notes: '',
                            weight: '',
                        },
                    ],
                });
                handleClearImage();
            }

            if (onSuccess) {
                onSuccess();
            }
        },
    });

    const onSubmit = async (data: CreateRoutineInput) => {
        pendingImageFileRef.current = imageFile ?? null;
        routineMutation.mutate(data);
    };

    const addExercise = () => {
        append({
            exercise_id: '',
            order_index: fields.length,
            sets: 3,
            reps: '8-12',
            rest_seconds: 60,
            notes: '',
            weight: '',
        });
    };

    console.log('routine', routine);

    return (
        <>
            {routineMutation.isError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {routineMutation.error instanceof Error
                        ? routineMutation.error.message
                        : `Error al ${isEditing ? 'actualizar' : 'crear'} la rutina`}
                </div>
            )}

            {exercisesError && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm">
                    Error al cargar ejercicios. Por favor, recarga la página.
                </div>
            )}

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700">
                                    Nombre de la Rutina
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="Ej: Rutina de Fuerza - Push"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        disabled={routineMutation.isPending}
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
                                <FormLabel className="text-sm font-medium text-gray-700">
                                    Descripción
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        rows={2}
                                        placeholder="Ej: Rutina para el pecho, brazos y espalda"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        disabled={routineMutation.isPending}
                                    />
                                </FormControl>
                                <FormMessage className="text-red-600 text-sm" />
                            </FormItem>
                        )}
                    />

                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                            {isEditing ? 'Foto de la rutina' : 'Foto (opcional)'}
                        </Label>
                        <p className="text-xs text-muted-foreground">
                            Una sola imagen. JPG, PNG, WebP o GIF. Máx. {MAX_IMAGE_SIZE_MB} MB.
                            {isEditing && ' Sube una nueva imagen para reemplazar la actual.'}
                        </p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept={ACCEPTED_IMAGE_TYPES.join(',')}
                            onChange={handleImageChange}
                            className="hidden"
                            aria-label="Seleccionar imagen de la rutina"
                        />
                        {imagePreviewUrl ? (
                            <div className="flex items-start gap-3 rounded-lg border border-gray-300 bg-muted/30 p-3">
                                <img
                                    src={imagePreviewUrl}
                                    alt="Vista previa"
                                    className="h-20 w-20 shrink-0 rounded-md object-cover"
                                />
                                <div className="flex flex-1 flex-col gap-2">
                                    <p className="text-sm text-muted-foreground truncate">
                                        {imageFile?.name}
                                    </p>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={handleClearImage}
                                        disabled={routineMutation.isPending}
                                        className="w-fit cursor-pointer"
                                    >
                                        Quitar foto
                                    </Button>
                                </div>
                            </div>
                        ) : routine?.image_url ? (
                            <div className="flex items-start gap-3 rounded-lg border border-gray-300 bg-muted/30 p-3">
                                <img
                                    src={routine.image_url}
                                    alt="Imagen actual de la rutina"
                                    className="h-20 w-20 shrink-0 rounded-md object-cover"
                                />
                                <div className="flex flex-1 flex-col gap-2">
                                    <p className="text-sm text-muted-foreground">Imagen actual</p>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={routineMutation.isPending}
                                        className="w-fit cursor-pointer"
                                    >
                                        Cambiar imagen
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={routineMutation.isPending}
                                className="w-full cursor-pointer"
                            >
                                {isEditing ? 'Añadir imagen' : 'Añadir foto'}
                            </Button>
                        )}
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <FormLabel className="text-sm font-medium text-gray-700">
                                Ejercicios
                            </FormLabel>
                            <button
                                type="button"
                                onClick={addExercise}
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                                disabled={routineMutation.isPending || loadingExercises}
                            >
                                + Agregar Ejercicio
                            </button>
                        </div>

                        <div className="space-y-3  max-h-[200px] overflow-y-auto">
                            {fields.map((field, index) => (
                                <div
                                    key={field.id}
                                    className="bg-gray-50 p-4 rounded-lg space-y-3 border border-gray-200"
                                >
                                    <div className="flex items-center gap-2">
                                        <GripVertical className="w-5 h-5 text-gray-400 shrink-0" />
                                        <FormField
                                            control={form.control}
                                            name={`exercises.${index}.exercise_id`}
                                            render={({ field: selectField }) => (
                                                <FormItem className="flex-1 space-y-0">
                                                    <FormControl>
                                                        <Select
                                                            onValueChange={selectField.onChange}
                                                            value={selectField.value}
                                                            disabled={
                                                                routineMutation.isPending ||
                                                                loadingExercises
                                                            }
                                                        >
                                                            <SelectTrigger className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
                                                                <SelectValue placeholder="Selecciona un ejercicio">
                                                                    {loadingExercises
                                                                        ? 'Cargando ejercicios...'
                                                                        : exercises.find(
                                                                              (e) =>
                                                                                  e.id ===
                                                                                  selectField.value,
                                                                          )?.name ||
                                                                          'Selecciona un ejercicio'}
                                                                </SelectValue>
                                                            </SelectTrigger>
                                                            <SelectContent className="max-h-[200px]">
                                                                {exercises.map((exercise) => (
                                                                    <SelectItem
                                                                        key={exercise.id}
                                                                        value={exercise.id}
                                                                    >
                                                                        {exercise.name}
                                                                        {exercise.muscle_group && (
                                                                            <span className="text-gray-500 text-xs ml-2">
                                                                                (
                                                                                {
                                                                                    exercise.muscle_group
                                                                                }
                                                                                )
                                                                            </span>
                                                                        )}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </FormControl>
                                                    <FormMessage className="text-red-600 text-sm" />
                                                </FormItem>
                                            )}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                                            disabled={routineMutation.isPending}
                                            aria-label="Eliminar ejercicio"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        <FormField
                                            control={form.control}
                                            name={`exercises.${index}.sets`}
                                            render={({ field: setsField }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs font-medium text-gray-600">
                                                        Sets
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...setsField}
                                                            type="number"
                                                            min={1}
                                                            onChange={(e) =>
                                                                setsField.onChange(
                                                                    parseInt(e.target.value) || 0,
                                                                )
                                                            }
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                            disabled={routineMutation.isPending}
                                                        />
                                                    </FormControl>
                                                    <FormMessage className="text-red-600 text-xs" />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`exercises.${index}.reps`}
                                            render={({ field: repsField }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs font-medium text-gray-600">
                                                        Reps
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...repsField}
                                                            placeholder="8-12 o 10"
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                            disabled={routineMutation.isPending}
                                                        />
                                                    </FormControl>
                                                    <FormMessage className="text-red-600 text-xs" />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`exercises.${index}.weight`}
                                            render={({ field: weightField }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs font-medium text-gray-600">
                                                        Peso
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...weightField}
                                                            placeholder="100"
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                            disabled={routineMutation.isPending}
                                                        />
                                                    </FormControl>
                                                    <FormMessage className="text-red-600 text-xs" />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`exercises.${index}.rest_seconds`}
                                            render={({ field: restField }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs font-medium text-gray-600">
                                                        Rest (sec)
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...restField}
                                                            type="number"
                                                            min={0}
                                                            step={15}
                                                            onChange={(e) =>
                                                                restField.onChange(
                                                                    parseInt(e.target.value) || 0,
                                                                )
                                                            }
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                            disabled={routineMutation.isPending}
                                                        />
                                                    </FormControl>
                                                    <FormMessage className="text-red-600 text-xs" />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name={`exercises.${index}.notes`}
                                        render={({ field: notesField }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs font-medium text-gray-600">
                                                    Notas
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...notesField}
                                                        placeholder="Opcional"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        disabled={routineMutation.isPending}
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-red-600 text-xs" />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            ))}

                            {fields.length === 0 && (
                                <p className="text-gray-500 text-sm text-center py-8">
                                    No hay ejercicios agregados todavía. Haz clic en &quot;Agregar
                                    Ejercicio&quot; para empezar.
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium cursor-pointer"
                            disabled={routineMutation.isPending}
                        >
                            {routineMutation.isPending
                                ? isEditing
                                    ? 'Actualizando...'
                                    : 'Creando...'
                                : isEditing
                                  ? 'Actualizar Rutina'
                                  : 'Crear Rutina'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                if (isEditing && routine) {
                                    form.reset(defaultValues);
                                    handleCancel();
                                } else {
                                    form.reset();
                                    handleClearImage();
                                    handleCancel();
                                }
                            }}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium cursor-pointer border-0"
                            disabled={routineMutation.isPending}
                        >
                            Cancelar
                        </Button>
                    </div>
                </form>
            </Form>
        </>
    );
}
