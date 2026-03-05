'use client';

import {
    createExercise,
    getEquipmentTypes,
    getMuscleGroups,
    removeExerciseImage,
    removeExerciseVideo,
    updateExercise,
} from '@/src/app/actions/exercises';
import { getImageUrls } from '@/src/app/actions/images';
import { VideoPlayer } from '@/src/components/common/video-player';
import { VideoUploader } from '@/src/components/common/video-uploader';
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
import { useApp } from '@/src/contexts/AppContext';
import {
    createExerciseSchema,
    Exercise,
    type CreateExercise,
    type UpdateExercise,
} from '@/src/modules/exercises/exercises.schema';
import { uploadImagesExercises } from '@/src/modules/exercises/useUploadExImage';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

interface CreateExerciseFormProps {
    exercise?: Exercise;
    onSuccess?: () => void;
    onExerciseUpdated?: (exercise: Exercise) => void;
    setOpen?: (open: boolean) => void;
}

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jfif'];
const MAX_IMAGE_SIZE_MB = 5;
const MAX_IMAGES = 5;

export default function CreateExerciseForm({
    exercise,
    onSuccess,
    onExerciseUpdated,
    setOpen,
}: CreateExerciseFormProps) {
    const { userProfile } = useApp();
    const queryClient = useQueryClient();
    const isEditing = !!exercise;
    const [exerciseOverride, setExerciseOverride] = useState<Exercise | null>(null);
    const exerciseDisplay = exerciseOverride ?? exercise;
    const [imageFiles, setImageFiles] = useState<Array<{ file: File; previewUrl: string }>>([]);
    const pendingImageFilesRef = useRef<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [displayUrls, setDisplayUrls] = useState<string[]>([]);

    // GET IMAGES URLS AND CHECK FOR URL OR PATH
    useEffect(() => {
        if (!exercise?.images_url?.length) {
            setDisplayUrls([]);
            return;
        }
        const paths = exercise.images_url;
        // If they're already full URLs (e.g. public bucket), use as-is
        const isAlreadyUrl = (s: string) => s.startsWith('http://') || s.startsWith('https://');
        if (paths.every(isAlreadyUrl)) {
            setDisplayUrls(paths);
            setImageFiles(paths.map((url) => ({ file: new File([], ''), previewUrl: url })));
            return;
        }
        // Otherwise resolve paths to signed URLs
        getImageUrls(paths)
            .then((urls) => setDisplayUrls(urls.filter((u): u is string => u !== null)))
            .catch(console.error);
    }, [exercise?.id, exercise?.images_url]);

    // Prepare default values based on whether we are editing or creating
    const defaultValues = useMemo(() => {
        if (exercise) {
            // Editing mode: pre-fill with exercise data
            return {
                name: exercise.name,
                description: exercise.description || '',
                muscle_group: exercise.muscle_group || '',
                created_by: exercise.created_by,
                equipment: exercise.equipment || '',
                images_url: exercise.images_url || [],
            };
        }
        // Creation mode: default values
        return {
            name: '',
            description: '',
            muscle_group: '',
            created_by: userProfile?.id ?? '',
            equipment: '',
            images_url: [],
        };
    }, [exercise, userProfile]);

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

    // Reset form and override when exercise prop changes
    useEffect(() => {
        if (exercise) {
            form.reset(defaultValues);
        }
        setExerciseOverride(null);
    }, [exercise?.id]); // eslint-disable-line react-hooks/exhaustive-deps

    // Cleanup object URLs on unmount
    useEffect(() => {
        return () => {
            imageFiles.forEach((item) => URL.revokeObjectURL(item.previewUrl));
        };
    }, [imageFiles]);

    const existingImagesCount = Array.isArray(exerciseDisplay?.images_url)
        ? exerciseDisplay.images_url.length
        : 0;
    const totalImagesCount = existingImagesCount + imageFiles.length;
    const canAddMore = totalImagesCount < MAX_IMAGES;

    const handleImageChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files;
            if (!files?.length) return;

            const newItems: Array<{ file: File; previewUrl: string }> = [];

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) continue;
                if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) continue;

                newItems.push({
                    file,
                    previewUrl: URL.createObjectURL(file),
                });
            }

            setImageFiles((prev) => {
                const maxNew = MAX_IMAGES - existingImagesCount;
                return [...prev, ...newItems].slice(0, maxNew);
            });

            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        },
        [existingImagesCount],
    );

    const handleRemovePendingImage = useCallback((index: number) => {
        setImageFiles((prev) => {
            const item = prev[index];
            if (item) URL.revokeObjectURL(item.previewUrl);
            return prev.filter((_, i) => i !== index);
        });
    }, []);

    const handleClearAllImages = useCallback(() => {
        setImageFiles((prev) => {
            prev.forEach((p) => URL.revokeObjectURL(p.previewUrl));
            return [];
        });
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, []);

    const removeImageMutation = useMutation({
        mutationFn: ({ exerciseId, imageUrl }: { exerciseId: string; imageUrl: string }) =>
            removeExerciseImage(exerciseId, imageUrl),
        onSuccess: async (result) => {
            if (result?.success && result.data) {
                setExerciseOverride(result.data as Exercise);
                await queryClient.invalidateQueries({ queryKey: ['exercises'], exact: false });
                onExerciseUpdated?.(result.data as Exercise);
            }
        },
    });

    // Create or update exercise mutation
    const removeVideoMutation = useMutation({
        mutationFn: (exerciseId: string) => removeExerciseVideo(exerciseId),
        onSuccess: async (result) => {
            if (result?.success && result.data) {
                setExerciseOverride(null);
                await queryClient.invalidateQueries({ queryKey: ['exercises'], exact: false });
                onExerciseUpdated?.(result.data as Exercise);
            }
        },
    });

    const exerciseMutation = useMutation({
        mutationFn: async (data: CreateExercise) => {
            if (isEditing && exercise) {
                // Editing mode: update exercise
                const newImagesUrl = await uploadImagesExercises(pendingImageFilesRef.current);
                const updateData: UpdateExercise = {
                    name: data.name,
                    description: data.description,
                    muscle_group: data.muscle_group,
                    created_by: data.created_by,
                    equipment: data.equipment,
                    mux_upload_id: data.mux_upload_id,
                    mux_playback_id: data.mux_playback_id,
                    mux_status: data.mux_status,
                    images_url: [...(data.images_url ?? []), ...(newImagesUrl ?? [])],
                };
                console.log('>>>> updateData', updateData);
                const result = await updateExercise(exercise.id, updateData);
                if (!result.success) {
                    throw new Error(result.error || 'Error al actualizar el ejercicio');
                }
                return result;
            } else {
                // Creation mode: create new exercise
                const newImagesUrl = await uploadImagesExercises(pendingImageFilesRef.current);
                const newData = {
                    ...data,
                    images_url: [...(data.images_url ?? []), ...(newImagesUrl ?? [])],
                };
                console.log('>>>> newData', newData);
                const result = await createExercise(newData);
                if (!result.success) {
                    throw new Error(result.error || 'Error al crear el ejercicio');
                }
                return result;
            }
        },
        onSuccess: async () => {
            if (!isEditing) {
                form.reset({
                    name: '',
                    description: '',
                    muscle_group: '',
                    created_by: form.getValues('created_by'),
                    equipment: '',
                    images_url: [],
                });
                handleClearAllImages();
            }

            if (onSuccess) {
                onSuccess();
            }

            await queryClient.invalidateQueries({
                queryKey: ['exercises'],
                exact: false,
            });
            // Force refetch to ensure immediate update
            await queryClient.refetchQueries({
                queryKey: ['exercises'],
                exact: false,
            });
        },
    });

    const onSubmit = async (data: CreateExercise) => {
        pendingImageFilesRef.current = imageFiles.map((item) => item.file);
        exerciseMutation.mutate(data);
    };

    return (
        <>
            {(exerciseMutation.isError || removeVideoMutation.isError) && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {removeVideoMutation.isError
                        ? removeVideoMutation.error instanceof Error
                            ? removeVideoMutation.error.message
                            : 'Error al eliminar el vídeo'
                        : exerciseMutation.error instanceof Error
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
                                <FormLabel className="text-sm font-medium text-gray-700">
                                    Nombre del Ejercicio
                                </FormLabel>
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
                                <FormLabel className="text-sm font-medium text-gray-700">
                                    Descripción (opcional)
                                </FormLabel>
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

                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                            Fotos (opcional)
                        </Label>
                        <p className="text-xs text-muted-foreground">
                            Hasta {MAX_IMAGES} imágenes. JPG, PNG, WebP o GIF. Máx.{' '}
                            {MAX_IMAGE_SIZE_MB} MB cada una.
                        </p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept={ACCEPTED_IMAGE_TYPES.join(',')}
                            multiple
                            onChange={handleImageChange}
                            disabled={!canAddMore || exerciseMutation.isPending}
                            className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                            aria-label="Seleccionar imágenes del ejercicio"
                        />

                        <div className="flex flex-wrap gap-3">
                            {Array.isArray(exerciseDisplay?.images_url) &&
                                exerciseDisplay.images_url.map((url) => (
                                    <div
                                        key={url}
                                        className="relative group rounded-lg border border-gray-300 bg-muted/30 overflow-hidden"
                                    >
                                        <img
                                            src={url}
                                            alt="Ejercicio"
                                            className="h-20 w-20 object-cover"
                                        />
                                        {exercise && (
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-1 right-1 h-6 w-6 cursor-pointer opacity-90 hover:opacity-100"
                                                disabled={
                                                    removeImageMutation.isPending ||
                                                    exerciseMutation.isPending
                                                }
                                                onClick={() => {
                                                    removeImageMutation.mutate({
                                                        exerciseId: exercise.id,
                                                        imageUrl: url,
                                                    });
                                                }}
                                                aria-label="Eliminar imagen"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}

                            {imageFiles.map((item, index) => (
                                <div
                                    key={item.previewUrl}
                                    className="relative group rounded-lg border border-gray-300 bg-muted/30 overflow-hidden"
                                >
                                    <img
                                        src={item.previewUrl}
                                        alt={`Vista previa ${index + 1}`}
                                        className="h-20 w-20 object-cover"
                                    />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-1 right-1 h-6 w-6 cursor-pointer opacity-90 hover:opacity-100"
                                        disabled={exerciseMutation.isPending}
                                        onClick={() => handleRemovePendingImage(index)}
                                        aria-label="Quitar foto"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}

                            {canAddMore && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={exerciseMutation.isPending}
                                    className="h-20 w-20 shrink-0 cursor-pointer border-dashed"
                                    aria-label="Añadir foto"
                                >
                                    +
                                </Button>
                            )}
                        </div>

                        {totalImagesCount > 0 && (
                            <p className="text-xs text-muted-foreground">
                                {totalImagesCount} de {MAX_IMAGES} fotos
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        {exercise ? (
                            exerciseDisplay?.mux_playback_id || exerciseDisplay?.mux_upload_id ? (
                                <div className="space-y-2 rounded-lg border border-gray-300 bg-muted/30 p-3">
                                    {exerciseDisplay.mux_playback_id ? (
                                        <VideoPlayer
                                            playbackId={exerciseDisplay.mux_playback_id}
                                            title={exerciseDisplay.name}
                                        />
                                    ) : (
                                        <div className="bg-gray-200 aspect-video flex items-center justify-center rounded-xl">
                                            Procesando...
                                        </div>
                                    )}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="w-fit cursor-pointer"
                                        disabled={removeVideoMutation.isPending}
                                        onClick={() => {
                                            removeVideoMutation.mutate(exercise.id);
                                        }}
                                    >
                                        {removeVideoMutation.isPending
                                            ? 'Eliminando...'
                                            : 'Quitar vídeo'}
                                    </Button>
                                </div>
                            ) : (
                                <VideoUploader
                                    exerciseId={exercise.id}
                                    onUploadSuccess={(uploadId) => {
                                        setExerciseOverride((prev) => ({
                                            ...(prev ?? exercise),
                                            mux_upload_id: uploadId,
                                        }));
                                    }}
                                />
                            )
                        ) : (
                            <p className="text-sm text-muted-foreground rounded-lg border border-dashed border-gray-300 bg-muted/20 px-4 py-6 text-center">
                                Guarda el ejercicio primero para poder añadir un vídeo.
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="muscle_group"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium text-gray-700">
                                        Grupo Muscular
                                    </FormLabel>
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
                                                        : muscleGroups.find(
                                                              (g) => g === field.value,
                                                          ) || 'Selecciona grupo muscular'}
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
                                    form.reset(defaultValues);
                                } else {
                                    form.reset({
                                        name: '',
                                        description: '',
                                        muscle_group: '',
                                        created_by: form.getValues('created_by'),
                                    });
                                    handleClearAllImages();
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
