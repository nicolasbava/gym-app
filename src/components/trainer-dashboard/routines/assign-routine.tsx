'use client';

import { assignRoutine, getRoutinesByGym } from '@/src/app/actions/routines';
import type { UserProfile } from '@/src/app/actions/users';
import { getProfilesByGym } from '@/src/app/actions/users';
import { Button } from '@/src/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { AssignRoutine, assignRoutineSchema, type Routine } from '@/src/modules/routines/routines.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

interface AssignRoutineFormProps {
    gymId: string;
    onSuccess?: () => void;
}

export default function AssignRoutineForm({ gymId, onSuccess }: AssignRoutineFormProps) {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [routines, setRoutines] = useState<Routine[]>([]);
    const [loadingRoutines, setLoadingRoutines] = useState(true);
    const [members, setMembers] = useState<UserProfile[]>([]);
    const [loadingMembers, setLoadingMembers] = useState(true);

    const form = useForm<AssignRoutine>({
        resolver: zodResolver(assignRoutineSchema),
        defaultValues: {
            routine_id: '',
            profile_id: '',
        },
    });

    useEffect(() => {
        if (!gymId) return;
        let cancelled = false;
        setLoadingRoutines(true);
        getRoutinesByGym(gymId)
            .then((result) => {
                if (!cancelled && result.success && result.data) setRoutines(result.data as Routine[]);
            })
            .finally(() => {
                if (!cancelled) setLoadingRoutines(false);
            });
        return () => {
            cancelled = true;
        };
    }, [gymId]);

    useEffect(() => {
        if (!gymId) return;
        let cancelled = false;
        setLoadingMembers(true);
        getProfilesByGym(gymId)
            .then((result) => {
                if (!cancelled && result.success && result.data) setMembers(result.data);
            })
            .finally(() => {
                if (!cancelled) setLoadingMembers(false);
            });
        return () => {
            cancelled = true;
        };
    }, [gymId]);

    const onSubmit = async (data: AssignRoutine) => {
        try {
            setError(null);
            setIsLoading(true);
            const result = await assignRoutine(data);
            if (!result.success) {
                setError(result.error ?? 'Error al asignar la rutina');
                return;
            }
            form.reset({ routine_id: '', profile_id: '' });
            onSuccess?.();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setIsLoading(false);
        }
    };

    const loading = loadingRoutines || loadingMembers;

    return (
        <>
            {error && <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-md text-red-200 text-sm">{error}</div>}

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="routine_id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-purple-200">Rutina</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value} disabled={isLoading || loading}>
                                    <FormControl>
                                        <SelectTrigger className="bg-black/20 border-purple-800/50 text-white">
                                            <SelectValue placeholder={loadingRoutines ? 'Cargando rutinas...' : 'Selecciona una rutina'}>
                                                {loadingRoutines ? 'Cargando rutinas...' : routines.find((r) => r.id === field.value)?.name ?? 'Selecciona una rutina'}
                                            </SelectValue>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-slate-800 border-purple-800/50 max-h-[200px]">
                                        {routines.map((routine) => (
                                            <SelectItem key={routine.id} value={routine.id} className="text-white">
                                                {routine.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage className="text-red-400" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="profile_id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-purple-200">Cliente</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value} disabled={isLoading || loading}>
                                    <FormControl>
                                        <SelectTrigger className="bg-black/20 border-purple-800/50 text-white">
                                            <SelectValue placeholder={loadingMembers ? 'Cargando clientes...' : 'Selecciona un cliente'}>
                                                {loadingMembers ? 'Cargando clientes...' : members.find((m) => m.id === field.value)?.name ?? 'Selecciona un cliente'}
                                            </SelectValue>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-slate-800 border-purple-800/50 max-h-[200px]">
                                        {members.map((member) => (
                                            <SelectItem key={member.id} value={member.id} className="text-white">
                                                {member.name}
                                                {member.email && <span className="text-purple-400 text-xs ml-2">({member.email})</span>}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage className="text-red-400" />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => form.reset()} className="border-purple-800/50 text-purple-300 hover:bg-purple-900/20" disabled={isLoading}>
                            Limpiar
                        </Button>
                        <Button type="submit" className="bg-purple-600 hover:bg-purple-700" disabled={isLoading || loading}>
                            {isLoading ? 'Asignando...' : 'Asignar rutina'}
                        </Button>
                    </div>
                </form>
            </Form>
        </>
    );
}
