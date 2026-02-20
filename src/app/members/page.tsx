'use client';
import ConfirmAction from '@/src/components/common/confirm-action';
import SearchBar from '@/src/components/common/SearchBar';
import MemberForm from '@/src/components/trainer-dashboard/members/member-form';
import MembersDialog from '@/src/components/trainer-dashboard/members/members-dialog';
import { Dialog, DialogContent, DialogHeader } from '@/src/components/ui/dialog';
import { useApp } from '@/src/contexts/AppContext';
import { useInfiniteScroll } from '@/src/hooks/useInfiniteScroll';
import { Profile } from '@/src/modules/profiles/profiles.schema';
import { useMembersScroll } from '@/src/modules/profiles/useMembersScroll';
import { DialogTitle } from '@radix-ui/react-dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import { deleteProfile } from '../actions/users';
import MemberCard from './MemberCard';
import MembersLoading from './loading';

export default function MemberManager() {
    const queryClient = useQueryClient();
    const { userProfile } = useApp();
    const [nameMember, setNameMember] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<Profile | null>(null);
    const [isDeleteMemberOpen, setIsDeleteMemberOpen] = useState(false);

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } =
        useMembersScroll([], userProfile?.gym_id ?? '', nameMember);

    const members = useMemo(() => data?.pages.flatMap((page) => page) ?? [], [data]);

    const deleteMemberMutation = useMutation({
        mutationFn: (id: string) => deleteProfile(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['members'],
                exact: false,
            });
            setIsDeleteMemberOpen(false);
        },
        onError: (error) => {
            console.log('error delete member', error);
            setIsDeleteMemberOpen(false);
        },
    });

    const handleOpenModal = (member?: Profile) => {
        if (member) {
            setEditingMember(member);
        } else {
            setEditingMember(null);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingMember(null);
    };

    const handleDelete = (id: string) => {
        setEditingMember(members.find((m) => m.id === id) ?? null);
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
        [],
    );

    const handleLoadMore = useCallback(() => {
        if (!hasNextPage || isFetchingNextPage) {
            return;
        }
        void fetchNextPage();
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    const loadMoreRef = useInfiniteScroll(
        handleLoadMore,
        Boolean(hasNextPage) && !isLoading && !isFetchingNextPage,
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

            {isLoading ? (
                <MembersLoading />
            ) : error ? (
                <div className="text-center text-gray-600">
                    Error: {error instanceof Error ? error.message : 'Error loading members'}
                </div>
            ) : members.length === 0 ? (
                <div className="text-center text-gray-600">Lo siento, no se encontraron clientes</div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {members.map((member) => (
                            <MemberCard
                                key={member.id}
                                member={member}
                                handleOpenModal={() => handleOpenModal(member)}
                                handleDelete={() => handleDelete(member.id)}
                            />
                        ))}
                    </div>
                    <div ref={loadMoreRef} className="h-8 w-full" />
                    {isFetchingNextPage && (
                        <div className="mt-6 flex justify-center">
                            <p className="text-sm text-gray-600">Loading more members...</p>
                        </div>
                    )}
                    {!hasNextPage && members.length > 0 && (
                        <div className="mt-6 flex justify-center">
                            <p className="text-sm text-gray-500">No more members to show</p>
                        </div>
                    )}
                </>
            )}

            {/* UPDATE MEMBER MODAL */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogHeader>
                    <DialogTitle className="sr-only">Edit Member</DialogTitle>
                </DialogHeader>
                <DialogContent>
                    <MemberForm
                        gym_id={userProfile?.gym_id ?? ''}
                        member={editingMember ?? undefined}
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
