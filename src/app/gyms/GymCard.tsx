import { Gym } from '@/src/modules/gym/gym.schema';
import { Building2, Edit2, Trash2, User } from 'lucide-react';

interface GymCardProps {
    gym: Gym;
    onEdit?: (gym: Gym) => void;
    onDelete?: (id: string) => void;
}

export default function GymCard({ gym, onEdit, onDelete }: GymCardProps) {
    return (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
            {/* Gym Header (brand colours from DB not available yet) */}
            <div
                className="h-24 p-4 flex items-center justify-between bg-gradient-to-r from-slate-900 to-slate-700"
                // style={{
                //     background: `linear-gradient(135deg, ${gym.primary_color} 0%, ${gym.secondary_color} 100%)`,
                // }}
            >
                <div className="flex items-center gap-3">
                    {gym.logo_url ? (
                        <img
                            src={gym.logo_url as string}
                            alt={gym.name}
                            className="w-12 h-12 rounded-lg bg-white object-cover"
                        />
                    ) : (
                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-gray-400" />
                        </div>
                    )}
                    <div>
                        <h3 className="font-semibold text-white">{gym.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span
                                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                    gym.subscription_status === 'active'
                                        ? 'bg-green-500/20 text-white'
                                        : 'bg-red-500/20 text-white'
                                }`}
                            >
                                {gym.subscription_status === 'active' ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Gym Details */}
            <div className="p-4">
                {/* Admin & Contact Info */}
                <div className="mb-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{gym.coach_admin}</span>
                    </div>
                    {/*
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{gym.phone_number}</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div>
                            <p>{gym.directions_address}</p>
                            <p className="text-gray-500">{gym.city}</p>
                        </div>
                    </div>
                    */}
                </div>

                {/*
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-semibold text-gray-900">{gym.total_members}</p>
                        <p className="text-xs text-gray-600">Members</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-semibold text-gray-900">{gym.total_coaches}</p>
                        <p className="text-xs text-gray-600">Coaches</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <Calendar className="w-4 h-4" />
                    <span>Created {gym.created_at}</span>
                </div>

                <div className="mb-3">
                    <p className="text-xs text-gray-600 mb-2">Brand Colors</p>
                    <div className="flex gap-2">
                        <div className="flex items-center gap-2 flex-1">
                            <div
                                className="w-8 h-8 rounded border"
                                style={{ backgroundColor: gym.primary_color }}
                            />
                            <span className="text-xs text-gray-600 font-mono">
                                {gym.primary_color}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 flex-1">
                            <div
                                className="w-8 h-8 rounded border"
                                style={{ backgroundColor: gym.secondary_color }}
                            />
                            <span className="text-xs text-gray-600 font-mono">
                                {gym.secondary_color}
                            </span>
                        </div>
                    </div>
                </div>
                */}

                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => onEdit?.(gym)}
                        className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium text-sm"
                    >
                        <Edit2 className="w-4 h-4 inline mr-1" />
                        Edit
                    </button>
                    <button
                        type="button"
                        onClick={() => onDelete?.(gym.id)}
                        className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-medium text-sm"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
