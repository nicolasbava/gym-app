'use client';

import { createMember, updateMember } from '@/src/app/actions/users';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { Profile } from '@/src/modules/profiles/profiles.schema';
import { updateUserProfileSchema } from '@/src/modules/users/register.schema';
import { createUserSchema, memberRole } from '@/src/modules/users/user.schema';
import { useState } from 'react';

interface MemberFormProps {
    gym_id: string;
    member?: Profile; // ← Si existe, es modo edición
    onSuccess?: () => void;
    setOpen: (open: boolean) => void;
}

export default function MemberForm({ gym_id, member, onSuccess, setOpen }: MemberFormProps) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [role, setRole] = useState<memberRole>((member?.role as memberRole) || 'member');

    const isEditing = !!member;

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const formData = new FormData(e.currentTarget);

        const userData = {
            email: (formData.get('email') as string) || member?.email,
            name: (formData.get('name') as string) || member?.name,
            phone: (formData.get('phone') as string) || undefined,
            gym_id: gym_id,
            role,
        };

        console.log('userData', userData);
        console.log('isEditing', isEditing);
        const createMemberParsed = createUserSchema.parse(userData);
        const updateMemberParsed = updateUserProfileSchema.parse(userData);
        console.log('updateMemberParsed', updateMemberParsed);
        const result = isEditing ? await updateMember(member.id, updateMemberParsed) : await createMember(createMemberParsed);

        if (result.success) {
            setMessage(result.message ?? (isEditing ? 'Usuario actualizado' : 'Usuario creado correctamente'));
            setTimeout(() => {
                setOpen(false);
                setMessage('');
                onSuccess?.();
            }, 1500);
        } else {
            setMessage('Error: ' + (result.error ?? `Error al ${isEditing ? 'actualizar' : 'crear'} el usuario`));
        }

        setLoading(false);
    }

    console.log('member', member);
    const inputClassName = 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent';

    return (
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                <Input
                    type="text"
                    name="name"
                    required
                    placeholder="Juan Pérez"
                    className={inputClassName}
                    disabled={loading}
                    defaultValue={member?.name}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <Input
                        type="email"
                        name="email"
                        required
                        placeholder="usuario@ejemplo.com"
                        className={inputClassName}
                        disabled={loading || isEditing} // ← No editar email si ya existe
                        defaultValue={member?.email}
                    />
                    {isEditing && <p className="text-xs text-gray-500 mt-1">El email no se puede modificar</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono (opcional)</label>
                    <Input
                        type="tel"
                        name="phone"
                        placeholder="+54 911 1234 5678"
                        className={inputClassName}
                        disabled={loading}
                        defaultValue={member?.phone}
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                <Select value={role} onValueChange={(v) => setRole(v as memberRole)} disabled={loading}>
                    <SelectTrigger className={`${inputClassName} bg-white w-full`}>
                        <SelectValue placeholder="Seleccionar rol" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px]">
                        <SelectItem value={memberRole.MEMBER}>Miembro</SelectItem>
                        <SelectItem value={memberRole.COACH}>Entrenador</SelectItem>
                        {/* <SelectItem value={memberRole.COACH_ADMIN}>Administrador de entrenadores</SelectItem> */}
                    </SelectContent>
                </Select>
            </div>

            {message && (
                <p
                    className={
                        message.includes('Error')
                            ? 'text-sm text-red-600 p-3 bg-red-50 border border-red-200 rounded-lg'
                            : 'text-sm text-green-700 p-3 bg-green-50 border border-green-200 rounded-lg'
                    }
                >
                    {message}
                </p>
            )}

            <div className="flex gap-3 pt-4">
                <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium cursor-pointer"
                >
                    {loading ? (isEditing ? 'Actualizando...' : 'Creando usuario...') : isEditing ? 'Actualizar usuario' : 'Crear usuario'}
                </Button>
                <Button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium cursor-pointer border-0"
                    disabled={loading}
                >
                    Cancelar
                </Button>
            </div>
        </form>
    );
}
