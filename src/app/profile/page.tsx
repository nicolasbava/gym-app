'use client';
import UserAvatar from '@/src/components/common/UserAvatar';
import { useApp } from '@/src/contexts/AppContext';
import { Profile } from '@/src/modules/profiles/profiles.schema';
import { Calendar, Edit2, Mail, Phone, Save, User, X } from 'lucide-react';
import { useState } from 'react';
import { updateMember } from '../actions/users';

export default function ProfilePage() {
    const { userProfile: profile } = useApp();
    const [isEditing, setIsEditing] = useState(false);
    // const [profile, setProfile] = useState({
    //     name: 'John Smith',
    //     email: 'john.smith@email.com',
    //     phone: '+1 (555) 123-4567',
    //     membershipStart: '2024-01-01',
    //     profileImage: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400',
    //     age: 28,
    //     weight: 75,
    //     height: 180,
    //     goals: 'Build muscle and increase strength',
    // });

    const [editForm, setEditForm] = useState<Profile | null>(profile as Profile);

    const handleSave = async () => {
        const { success, error } = await updateMember(profile?.id ?? '', editForm as Profile);
        if (success) {
            setIsEditing(false);
        } else {
            console.error(error);
        }
    };

    const handleCancel = () => {
        setEditForm(profile as Profile);
        setIsEditing(false);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Mi Perfil</h2>
                <p className="text-gray-600 mt-1">Gestiona tu información personal</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                {/* Header with Profile Image */}
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 h-32"></div>

                <div className="px-6 pb-6">
                    <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-16 mb-6">
                        <div className="relative">
                            <UserAvatar
                                name={profile?.name}
                                imageUrl={profile?.image_url}
                                className="w-32 h-32 border-4 border-white shadow-lg"
                                fallbackClassName="text-3xl"
                            />
                            {isEditing && (
                                <button className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-lg">
                                    <Edit2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        <div className="flex-1 text-center sm:text-left">
                            <h3 className="text-2xl font-semibold text-gray-900">{profile?.name}</h3>
                            <p className="text-gray-600">
                                Miembro desde {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : ''}
                            </p>
                        </div>

                        <button
                            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium cursor-pointer"
                        >
                            {isEditing ? (
                                <>
                                    <Save className="w-4 h-4" />
                                    Guardar cambios
                                </>
                            ) : (
                                <>
                                    <Edit2 className="w-4 h-4" />
                                    Editar perfil
                                </>
                            )}
                        </button>

                        {isEditing && (
                            <button
                                onClick={handleCancel}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                                Cancelar
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Contact Information */}
                        <div className="space-y-4">
                            <h4 className="font-semibold text-gray-900">Información de contacto</h4>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        Nombre completo
                                    </div>
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editForm?.name ?? ''}
                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value as string } as Profile)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                ) : (
                                    <p className="text-gray-900">{profile?.name}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        Email:
                                    </div>
                                </label>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        value={editForm?.email ?? ''}
                                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value as string } as Profile)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                ) : (
                                    <p className="text-gray-900">{profile?.email}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        Teléfono:
                                    </div>
                                </label>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        value={editForm?.phone ?? ''}
                                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value as string } as Profile)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                ) : (
                                    <p className="text-gray-900">{profile?.phone}</p>
                                )}
                            </div>
                        </div>

                        {/* Physical Stats */}
                        <div className="space-y-4">
                            <h4 className="font-semibold text-gray-900">Estadísticas físicas</h4>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Edad</label>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            value={editForm?.birthdate ? new Date(editForm.birthdate).getFullYear() : 0}
                                            onChange={(e) => setEditForm({ ...editForm, age: parseInt(e.target.value as string) } as Profile)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    ) : (
                                        <p className="text-gray-900">
                                            {profile?.birthdate ? new Date().getFullYear() - new Date(profile.birthdate).getFullYear() : 0} años
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Peso</label>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            value={editForm?.weight ?? 0}
                                            onChange={(e) => setEditForm({ ...editForm, weight: parseFloat(e.target.value as string) } as Profile)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    ) : (
                                        <p className="text-gray-900">{profile?.weight} kg</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Altura</label>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            value={editForm?.height ?? 0}
                                            onChange={(e) => setEditForm({ ...editForm, height: parseInt(e.target.value as string) } as Profile)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    ) : (
                                        <p className="text-gray-900">{profile?.height} cm</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            Miembro desde
                                        </div>
                                    </label>
                                    <p className="text-gray-900">{profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : ''}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Goals */}
                    <div className="mt-6">
                        <h4 className="font-semibold text-gray-900 mb-3">Objetivos de fitness</h4>
                        {isEditing ? (
                            <textarea
                                value={editForm?.objective ?? ''}
                                onChange={(e) => setEditForm({ ...editForm, goals: e.target.value as string } as Profile)}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        ) : (
                            <p className="text-gray-900">{profile?.objective}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* // Stats Cards
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
                    <p className="text-3xl font-semibold text-blue-600 mb-1">{profile?.workout_completed ?? 0}</p>
                    <p className="text-gray-600">Entrenamientos completados</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
                    <p className="text-3xl font-semibold text-green-600 mb-1">{profile?.active_routines ?? 0}</p>
                    <p className="text-gray-600">Rutinas activas</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
                    <p className="text-3xl font-semibold text-orange-600 mb-1">{profile?.week_streak ?? 0}</p>
                    <p className="text-gray-600">Semana de seguimiento</p>
                </div>
            </div> */}
        </div>
    );
}
