import { Profile } from '@/src/modules/profiles/profiles.schema';
import UserAvatar from '@/src/components/common/UserAvatar';
import { Edit2, Mail, Phone, Trash2 } from 'lucide-react';

export default function MemberCard({
    member,
    handleOpenModal,
    handleDelete,
}: {
    member: Profile;
    handleOpenModal: () => void;
    handleDelete: () => void;
}) {
    return (
        <div
            key={member.id}
            className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
        >
            <div className="flex items-start gap-4 mb-4">
                <UserAvatar
                    name={member.name}
                    imageUrl={member.image_url}
                    className="h-16 w-16"
                    fallbackClassName="text-lg"
                />
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg text-gray-900 mb-1 truncate">
                        {member.name}
                    </h3>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="w-4 h-4" />
                            <span className="truncate">{member.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4" />
                            <span>{member.phone}</span>
                        </div>
                        {/* <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>Iniciado el {member.created_at?.toLocaleDateString()}</span>
                        </div> */}
                    </div>
                </div>
            </div>

            <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Rutinas asignadas:</p>
                {/* <div className="flex flex-wrap gap-2">
                                    {member.assignedRoutines.map((routineId) => (
                                        <span key={routineId} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                            {getRoutineName(routineId)}
                                        </span>
                                    ))}
                                    {member.assignedRoutines.length === 0 && <span className="text-sm text-gray-500">No routines assigned</span>}
                                </div> */}
            </div>

            <div className="flex gap-2">
                <button
                    onClick={handleOpenModal}
                    className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium text-sm"
                >
                    <Edit2 className="w-4 h-4 inline mr-1" />
                    Edit
                </button>
                <button
                    onClick={handleDelete}
                    className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-medium text-sm"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
