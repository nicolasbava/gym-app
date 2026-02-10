'use client';
import ConfirmAction from '@/src/components/common/confirm-action';
import MemberForm from '@/src/components/trainer-dashboard/members/member-form';
import MembersDialog from '@/src/components/trainer-dashboard/members/members-dialog';
import { Dialog, DialogContent, DialogHeader } from '@/src/components/ui/dialog';
import { useApp } from '@/src/contexts/AppContext';
import { Member, mockMembers, mockRoutines } from '@/src/lib/mock-data';
import { Profile } from '@/src/modules/profiles/profiles.schema';
import { useProfiles } from '@/src/modules/profiles/useProfiles';
import { DialogTitle } from '@radix-ui/react-dialog';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Calendar, Edit2, Mail, Phone, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { deleteProfile } from '../actions/users';
import MembersLoading from './loading';

export default function MemberManager() {
    const { userProfile } = useApp();
    const [members, setMembers] = useState<Member[]>(mockMembers);
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
        queryKey: ['members', userProfile?.gym_id],
        queryFn: () => getProfilesPerGym(userProfile?.gym_id ?? ''),
        enabled: !!userProfile?.gym_id,
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

    // const handleSubmit = (e: React.FormEvent) => {
    //     e.preventDefault();

    //     if (editingMember) {
    //         setMembers(members.map((m) => (m.id === editingMember.id ? ({ ...formData, id: m.id } as Member) : m)));
    //     } else {
    //         const newMember: Member = {
    //             ...formData,
    //             id: `m${Date.now()}`,
    //         } as Member;
    //         setMembers([...members, newMember]);
    //     }

    //     handleCloseModal();
    // };

    const handleDelete = (id: string) => {
        setEditingMember(membersData?.find((m) => m.id === id) || null);
        setIsDeleteMemberOpen(true);
    };

    const handleConfirmDelete = () => {
        if (editingMember?.id) {
            deleteMemberMutation.mutate(editingMember.id);
        }
    };

    const toggleRoutineAssignment = (routineId: string) => {
        const currentRoutines = formData.assignedRoutines || [];
        const newRoutines = currentRoutines.includes(routineId) ? currentRoutines.filter((id) => id !== routineId) : [...currentRoutines, routineId];
        setFormData({ ...formData, assignedRoutines: newRoutines });
    };

    const getRoutineName = (routineId: string) => {
        return mockRoutines.find((r) => r.id === routineId)?.name || 'Unknown';
    };

    if (isLoading) return <MembersLoading />;
    if (error) return <div>Error: {error.message}</div>;
    if (!membersData)
        return (
            <div>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-900">Clientes</h2>
                        <p className="text-gray-600 mt-1">Gestiona a tus clientes y sus rutinas</p>
                    </div>
                </div>
            </div>
        );

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-900">Clientes</h2>
                    <p className="text-gray-600 mt-1">Gestiona a tus clientes y sus rutinas</p>
                </div>
                <MembersDialog />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {membersData &&
                    membersData.map((member) => (
                        <div key={member.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-4 mb-4">
                                {/* <img src={member.profileImagze} alt={member.name} className="w-16 h-16 rounded-full object-cover" /> */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-lg text-gray-900 mb-1 truncate">{member.name}</h3>
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

            {/* Modal */}
            {/* {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                            <h3 className="text-xl font-semibold">{editingMember ? 'Edit Member' : 'Add New Member'}</h3>
                            <button onClick={handleCloseModal} className="p-2 hover:bg-gray-100 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Membership Start Date</label>
                                <input
                                    type="date"
                                    value={formData.membershipStart}
                                    onChange={(e) => setFormData({ ...formData, membershipStart: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image URL</label>
                                <input
                                    type="url"
                                    value={formData.profileImage}
                                    onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="https://..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Assign Routines</label>
                                <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
                                    {mockRoutines.map((routine) => (
                                        <label key={routine.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={(formData.assignedRoutines || []).includes(routine.id)}
                                                onChange={() => toggleRoutineAssignment(routine.id)}
                                                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                            />
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">{routine.name}</p>
                                                <p className="text-sm text-gray-600">{routine.description}</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                                    {editingMember ? 'Update Member' : 'Add Member'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )} */}
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
