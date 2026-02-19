'use client';
import ConfirmAction from '@/src/components/common/confirm-action';
import SearchBar from '@/src/components/common/SearchBar';
import MemberForm from '@/src/components/trainer-dashboard/members/member-form';
import MembersDialog from '@/src/components/trainer-dashboard/members/members-dialog';
import { Dialog, DialogContent, DialogHeader } from '@/src/components/ui/dialog';
import { useApp } from '@/src/contexts/AppContext';
import { Member } from '@/src/lib/mock-data';
import { Profile } from '@/src/modules/profiles/profiles.schema';
import { useProfiles } from '@/src/modules/profiles/useProfiles';
import { DialogTitle } from '@radix-ui/react-dialog';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Calendar, Edit2, Mail, Phone, Trash2 } from 'lucide-react';
import { useCallback, useState } from 'react';
import { getProfilesByGymName } from '../actions/profile';
import { deleteProfile } from '../actions/users';

export default function MemberManager() {
    const { userProfile } = useApp();
    const [nameMember, setNameMember] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<Member | null>(null);
    const [isDeleteMemberOpen, setIsDeleteMemberOpen] = useState(false);
    const { getProfilesPerGym } = useProfiles();
    const [formData, setFormData] = useState<Partial<Member>>({
        name: '',
        email: '',
        phone: '',
        membershipStart: '',
        assignedRoutines: [],
        profileImage: '',
    });

    const {
        data: membersData,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['members', userProfile?.gym_id, nameMember],
        queryFn: () => getProfilesByGymName(userProfile?.gym_id ?? '', nameMember),
        enabled: !!userProfile?.gym_id,
        gcTime: 50,
        staleTime: 50,
    });

    const deleteMemberMutation = useMutation({
        mutationFn: (id: string) => deleteProfile(id),
        onSuccess: () => {
            console.log('member deleted');
            setIsDeleteMemberOpen(false);
        },
        onError: (error) => {
            console.log('error delete member', error);
            setIsDeleteMemberOpen(false);
        },
    });

    const handleOpenModal = (member?: Member) => {
        if (member) {
            setEditingMember(member);
            setFormData(member);
        } else {
            setEditingMember(null);
            setFormData({
                name: '',
                email: '',
                phone: '',
                membershipStart: new Date().toISOString().split('T')[0],
                assignedRoutines: [],
                profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingMember(null);
    };

    const handleDelete = (id: string) => {
        setEditingMember(membersData?.find((m) => m.id === id) || null);
        setIsDeleteMemberOpen(true);
    };

    const handleConfirmDelete = () => {
        try {
            if (editingMember?.id) {
                deleteMemberMutation.mutate(editingMember.id);
            }
        } catch (error) {
            console.log('error', deleteMemberMutation.error);
            console.log('error delete member', error);
        }
    };

    // Members search
    const onSearch = useCallback(
        (query: string) => {
            setNameMember(query);
        },
        [nameMember.length],
    );
    const clearSearch = useCallback(() => {
        setNameMember('');
    }, []);

    return (
        <div>
            {/* Header members */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-900">Clientes</h2>
                    <p className="text-gray-600 mt-1">Gestiona a tus clientes y sus rutinas</p>
                </div>
                <div className="flex items-center gap-2">
                    <SearchBar
                        fetchFunction={onSearch}
                        query={nameMember}
                        clearSearch={clearSearch}
                    />
                    <MembersDialog />
                </div>
            </div>

            {/* Loading and error states */}
            {isLoading && <div>Cargando...</div>}
            {error && <div>Error: {error.message}</div>}
            {membersData && membersData.length === 0 && (
                <div>Lo siento, no se encontraron clientes</div>
            )}

            {/* Members list */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {membersData &&
                    membersData.map((member) => (
                        <div
                            key={member.id}
                            className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start gap-4 mb-4">
                                {/* <img src={member.profileImagze} alt={member.name} className="w-16 h-16 rounded-full object-cover" /> */}
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
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Calendar className="w-4 h-4" />
                                            <span>Iniciado el {member.membershipStart}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <p className="text-sm font-medium text-gray-700 mb-2">
                                    Rutinas asignadas:
                                </p>
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
                                    onClick={() => handleOpenModal(member)}
                                    className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium text-sm"
                                >
                                    <Edit2 className="w-4 h-4 inline mr-1" />
                                    Edit
                                </button>
                                <button
                                    onClick={() => {
                                        setEditingMember(member);
                                        setIsDeleteMemberOpen(true);
                                    }}
                                    className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-medium text-sm"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
            </div>

            {/* UPDATE MEMBER MODAL */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogHeader>
                    <DialogTitle className="sr-only">Edit Member</DialogTitle>
                </DialogHeader>
                <DialogContent>
                    <MemberForm
                        gym_id={userProfile?.gym_id ?? ''}
                        member={editingMember as unknown as Profile}
                        onSuccess={handleCloseModal}
                        setOpen={setIsModalOpen}
                    />
                </DialogContent>
            </Dialog>

            {/* DELETE MEMBER MODAL */}
            <ConfirmAction
                open={isDeleteMemberOpen}
                onOpenChange={setIsDeleteMemberOpen}
                title="Delete Member"
                description="Are you sure you want to delete this member?"
                onConfirm={handleConfirmDelete}
                variant="destructive"
            />
        </div>
    );
}
