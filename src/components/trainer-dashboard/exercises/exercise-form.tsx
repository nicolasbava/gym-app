'use client';

import { getUser } from '@/src/app/actions/auth';
import { createExercise, getEquipmentTypes, getMuscleGroups } from '@/src/app/actions/exercises';
import { Button } from '@/src/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form';
import { Input } from '@/src/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { Textarea } from '@/src/components/ui/textarea';
import { createExerciseSchema, type CreateExercise } from '@/src/modules/exercises/exercises.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

interface CreateExerciseFormProps {
    gymId: string;
    onSuccess?: () => void;
}

export default function CreateExerciseForm({ gymId, onSuccess }: CreateExerciseFormProps) {
    const [open, setOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [muscleGroups, setMuscleGroups] = useState<string[]>([]);
    const [equipmentTypes, setEquipmentTypes] = useState<string[]>([]);
    const [loadingOptions, setLoadingOptions] = useState(true);

    const form = useForm<CreateExercise>({
        resolver: zodResolver(createExerciseSchema),
        defaultValues: {
            // gym_id: undefined,
            name: '',
            description: undefined,
            // video_url: undefined,
            muscle_group: '',
            // equipment_needed: "",
            created_by: '',
            // is_global: false,
        },
    });

    useEffect(() => {
        if (open) {
            loadOptions();
            loadUser();
        }
    }, [open]);

    const loadOptions = async () => {
        try {
            setLoadingOptions(true);
            const [muscleGroupsData, equipmentData] = await Promise.all([getMuscleGroups(), getEquipmentTypes()]);
            setMuscleGroups(muscleGroupsData);
            setEquipmentTypes(equipmentData);
        } catch (err) {
            console.error('Error loading options:', err);
        } finally {
            setLoadingOptions(false);
        }
    };

    const loadUser = async () => {
        try {
            const user = await getUser();
            console.log('user', user);
            if (user) {
                form.setValue('created_by', user.id);
            }
        } catch (err) {
            console.error('Error loading user:', err);
        }
    };

    const onSubmit = async (data: CreateExercise) => {
        try {
            setError(null);
            setIsLoading(true);

            // Limpiar video_url si está vacío
            const submitData = {
                ...data,
                // video_url: data.video_url?.trim() || undefined,
                description: data.description?.trim() || undefined,
            };

            const result = await createExercise(submitData);

            if (!result.success) {
                setError(result.error || 'Error al crear el ejercicio');
                return;
            }

            // Resetear formulario
            form.reset({
                // gym_id: undefined,
                name: '',
                description: undefined,
                // video_url: undefined,
                // muscle_group: "",
                // equipment_needed: "",
                created_by: form.getValues('created_by'),
                // is_global: false,
            });
            setOpen(false);

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

    return (
        <>
            {error && <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-md text-red-200 text-sm">{error}</div>}

            <Form {...form}>
                <form className="space-y-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-purple-200">Nombre del Ejercicio</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Ej: Press de banca plano" className="bg-black/20 border-purple-800/50 text-white placeholder:text-purple-300" disabled={isLoading} />
                                </FormControl>
                                <FormMessage className="text-red-400" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-purple-200">Descripción (opcional)</FormLabel>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        placeholder="Describe cómo realizar el ejercicio, técnica, músculos trabajados..."
                                        className="bg-black/20 border-purple-800/50 text-white placeholder:text-purple-300 min-h-[100px]"
                                        disabled={isLoading}
                                    />
                                </FormControl>
                                <FormMessage className="text-red-400" />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="muscle_group"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-purple-200">Grupo Muscular</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value} disabled={isLoading || loadingOptions}>
                                        <FormControl>
                                            <SelectTrigger className="bg-black/20 border-purple-800/50 text-white">
                                                <SelectValue placeholder="Selecciona grupo muscular" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-slate-800 border-purple-800/50">
                                            {muscleGroups.map((group) => (
                                                <SelectItem key={group} value={group} className="text-white">
                                                    {group}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="text-red-400" />
                                </FormItem>
                            )}
                        />

                        {/* <FormField
                control={form.control}
                name="equipment_needed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-purple-200">Equipo Necesario</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isLoading || loadingOptions}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-black/20 border-purple-800/50 text-white">
                          <SelectValue placeholder="Selecciona equipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-slate-800 border-purple-800/50">
                        {equipmentTypes.map((equipment) => (
                          <SelectItem key={equipment} value={equipment} className="text-white">
                            {equipment}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              /> */}
                    </div>

                    {/* <FormField
              control={form.control}
              name="video_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-purple-200 flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    URL del Video (opcional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="url"
                      placeholder="https://youtube.com/watch?v=..."
                      className="bg-black/20 border-purple-800/50 text-white placeholder:text-purple-300"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription className="text-purple-300 text-xs">
                    Enlace a un video tutorial del ejercicio
                  </FormDescription>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            /> */}

                    {/* <FormField
              control={form.control}
              name="is_global"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-purple-800/30 p-4 bg-black/20">
                  <div className="space-y-0.5">
                    <FormLabel className="text-purple-200 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Ejercicio Global
                    </FormLabel>
                    <FormDescription className="text-purple-300 text-xs">
                      Si está activado, el ejercicio estará disponible para todos los gimnasios
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                </FormItem>
              )}
            /> */}

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} className="border-purple-800/50 text-purple-300 hover:bg-purple-900/20" disabled={isLoading}>
                            Cancelar
                        </Button>
                        <Button
                            // type="submit"
                            className="bg-purple-600 hover:bg-purple-700 cursor-pointer"
                            onClick={() => onSubmit(form.getValues())}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creando...' : 'Crear Ejercicio'}
                        </Button>
                    </div>
                </form>
            </Form>
        </>
    );
}
