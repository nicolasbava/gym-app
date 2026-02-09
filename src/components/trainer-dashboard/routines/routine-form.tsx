'use client';

import { getUser } from '@/src/app/actions/auth';
import { createRoutine, getExercises } from '@/src/app/actions/routines';
import { Button } from '@/src/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form';
import { Input } from '@/src/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { Textarea } from '@/src/components/ui/textarea';
import { createRoutineSchema, type CreateRoutine } from '@/src/modules/routines/routines.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { GripVertical, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

interface Exercise {
    id: string;
    name: string;
    description?: string;
    muscle_group?: string;
    equipment?: string;
}

interface CreateRoutineDialogProps {
    gymId: string;
    onSuccess?: () => void;
}

export default function CreateRoutineForm({ gymId, onSuccess }: CreateRoutineDialogProps) {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [loadingExercises, setLoadingExercises] = useState(true);

    const form = useForm<CreateRoutine>({
        resolver: zodResolver(createRoutineSchema),
        defaultValues: {
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
                },
            ],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'exercises',
    });

    useEffect(() => {
        loadExercises();
        loadUser();
    }, []);

    const loadExercises = async () => {
        try {
            setLoadingExercises(true);
            const result = await getExercises();
            if (result.success && result.data) {
                setExercises(result.data as Exercise[]);
            }
        } catch (err) {
            console.error('Error loading exercises:', err);
        } finally {
            setLoadingExercises(false);
        }
    };

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

    const onSubmit = async (data: CreateRoutine) => {
        try {
            setError(null);
            setIsLoading(true);

            const result = await createRoutine(data);

            if (!result.success) {
                setError(result.error || 'Error al crear la rutina');
                return;
            }

            // Resetear formulario
            form.reset();

            // Llamar callback si existe
            if (onSuccess) {
                onSuccess();
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setIsLoading(false);
        }
    };

    const addExercise = () => {
        append({
            exercise_id: '',
            order_index: fields.length,
            sets: 3,
            reps: '8-12',
            rest_seconds: 60,
            notes: '',
        });
    };

    return (
        // <Dialog open={open} onOpenChange={setOpen}>
        //   <DialogTrigger asChild>
        //     <Button className="bg-purple-600 hover:bg-purple-700">
        //       <Plus className="h-4 w-4 mr-2" />
        //       Crear Rutina
        //     </Button>
        //   </DialogTrigger>

        <>
            {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700">Nombre de la Rutina</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="Ej: Rutina de Fuerza - Push"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        disabled={isLoading}
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
                                <FormLabel className="text-sm font-medium text-gray-700">Descripción</FormLabel>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        rows={2}
                                        placeholder="Ej: Rutina para el pecho, brazos y espalda"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        disabled={isLoading}
                                    />
                                </FormControl>
                                <FormMessage className="text-red-600 text-sm" />
                            </FormItem>
                        )}
                    />

                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <FormLabel className="text-sm font-medium text-gray-700">Ejercicios</FormLabel>
                            <button
                                type="button"
                                onClick={addExercise}
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                                disabled={isLoading || loadingExercises}
                            >
                                + Agregar Ejercicio
                            </button>
                        </div>

                        <div className="space-y-3  max-h-[200px] overflow-y-auto">
                            {fields.map((field, index) => (
                                <div key={field.id} className="bg-gray-50 p-4 rounded-lg space-y-3 border border-gray-200">
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
                                                            disabled={isLoading || loadingExercises}
                                                        >
                                                            <SelectTrigger className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
                                                                <SelectValue placeholder="Selecciona un ejercicio">
                                                                    {loadingExercises
                                                                        ? 'Cargando ejercicios...'
                                                                        : exercises.find((e) => e.id === selectField.value)?.name ||
                                                                          'Selecciona un ejercicio'}
                                                                </SelectValue>
                                                            </SelectTrigger>
                                                            <SelectContent className="max-h-[200px]">
                                                                {exercises.map((exercise) => (
                                                                    <SelectItem key={exercise.id} value={exercise.id}>
                                                                        {exercise.name}
                                                                        {exercise.muscle_group && (
                                                                            <span className="text-gray-500 text-xs ml-2">
                                                                                ({exercise.muscle_group})
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
                                            disabled={isLoading}
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
                                                    <FormLabel className="text-xs font-medium text-gray-600">Sets</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...setsField}
                                                            type="number"
                                                            min={1}
                                                            onChange={(e) => setsField.onChange(parseInt(e.target.value) || 0)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                            disabled={isLoading}
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
                                                    <FormLabel className="text-xs font-medium text-gray-600">Reps</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...repsField}
                                                            placeholder="8-12 o 10"
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                            disabled={isLoading}
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
                                                    <FormLabel className="text-xs font-medium text-gray-600">Rest (sec)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...restField}
                                                            type="number"
                                                            min={0}
                                                            step={15}
                                                            onChange={(e) => restField.onChange(parseInt(e.target.value) || 0)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                            disabled={isLoading}
                                                        />
                                                    </FormControl>
                                                    <FormMessage className="text-red-600 text-xs" />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`exercises.${index}.notes`}
                                            render={({ field: notesField }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs font-medium text-gray-600">Notas</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...notesField}
                                                            placeholder="Opcional"
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                            disabled={isLoading}
                                                        />
                                                    </FormControl>
                                                    <FormMessage className="text-red-600 text-xs" />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            ))}

                            {fields.length === 0 && (
                                <p className="text-gray-500 text-sm text-center py-8">
                                    No hay ejercicios agregados todavía. Haz clic en &quot;Agregar Ejercicio&quot; para empezar.
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium cursor-pointer"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creando...' : 'Crear Rutina'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => form.reset()}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium cursor-pointer border-0"
                            disabled={isLoading}
                        >
                            Cancelar
                        </Button>
                    </div>
                </form>
            </Form>
        </>
    );
}
