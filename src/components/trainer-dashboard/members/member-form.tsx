'use client';

import { createMember } from '@/src/app/actions/users';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { useState } from 'react';

interface CreateMemberFormProps {
    gymId: string;
    onSuccess?: () => void;
    setOpen: (open: boolean) => void;
}

export default function CreateMemberForm({ gymId, onSuccess, setOpen }: CreateMemberFormProps) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [role, setRole] = useState<'member' | 'trainer'>('member');

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const formData = new FormData(e.currentTarget);

        const result = await createMember({
            email: formData.get('email') as string,
            name: formData.get('name') as string,
            phone: (formData.get('phone') as string) || undefined,
            gymId,
            role,
        });

        if (result.success) {
            setMessage(result.message ?? 'Usuario creado correctamente');
            e.currentTarget.reset();
            setTimeout(() => {
                setOpen(false);
                setMessage('');
                onSuccess?.();
            }, 1500);
        } else {
            setMessage('Error: ' + (result.error ?? 'Error al crear el usuario'));
        }

        setLoading(false);
    }

    return (
        <>
            {/* <DialogContent className="bg-slate-900 border-purple-800/30 max-w-md">
            <DialogHeader>
                <DialogTitle className="text-white text-xl flex items-center gap-2">
                    <UserPlus className="h-5 w-5" />
                    Crear usuario
                </DialogTitle>
                <DialogDescription className="text-purple-200">Crea un nuevo miembro o entrenador y asígnalo al gimnasio.</DialogDescription>
            </DialogHeader> */}
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div>
                    <label className="block text-sm font-medium text-purple-200 mb-1">Email</label>
                    <Input type="email" name="email" required placeholder="usuario@ejemplo.com" className="bg-black/20 border-purple-800/50 text-white placeholder:text-purple-300" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-purple-200 mb-1">Nombre completo</label>
                    <Input type="text" name="name" required placeholder="Juan Pérez" className="bg-black/20 border-purple-800/50 text-white placeholder:text-purple-300" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-purple-200 mb-1">Teléfono (opcional)</label>
                    <Input type="tel" name="phone" placeholder="+54 911 1234 5678" className="bg-black/20 border-purple-800/50 text-white placeholder:text-purple-300" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-purple-200 mb-1">Rol</label>
                    <Select value={role} onValueChange={(v) => setRole(v as 'member' | 'trainer')}>
                        <SelectTrigger className="bg-black/20 border-purple-800/50 text-white w-full">
                            <SelectValue placeholder="Seleccionar rol" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-purple-800/50">
                            <SelectItem value="member" className="text-white">
                                Miembro
                            </SelectItem>
                            <SelectItem value="trainer" className="text-white">
                                Entrenador
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {message && <p className={message.includes('Error') ? 'text-red-400 text-sm' : 'text-green-400 text-sm'}>{message}</p>}

                <div className="flex gap-2 justify-end pt-2">
                    <Button type="button" variant="ghost" className="text-purple-200 hover:text-white" onClick={() => setOpen(false)}>
                        Cancelar
                    </Button>
                    <Button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto">
                        {loading ? 'Creando usuario...' : 'Crear usuario'}
                    </Button>
                </div>
            </form>
        </>
    );
}
