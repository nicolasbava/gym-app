'use client';

import GymForm from '@/src/components/gyms/gym-form';
import type { Gym } from '@/src/modules/gym/gym.schema';
import { useGymsScroll } from '@/src/modules/gym/useGymScroll';
import { Building2, Plus, X } from 'lucide-react';
import { useState } from 'react';
import GymCard from './GymCard';
import StatsGrid from './StatsGrid';

export default function GymsDashboard() {
    const { data: gymsFetched, isLoading, isError } = useGymsScroll([], '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGym, setEditingGym] = useState<Gym | null>(null);

    const handleOpenModal = (gym?: Gym) => {
        setEditingGym(gym ?? null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingGym(null);
    };

    if (isLoading) {
        return <div>Loading gyms...</div>;
    }

    if (isError || !gymsFetched) {
        return <div>Error loading gyms</div>;
    }

    const gymsPage = gymsFetched.pages[0] ?? [];

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-900">Super Admin Dashboard</h2>
                    <p className="text-gray-600 mt-1">Manage all gyms in the platform</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Create Gym
                </button>
            </div>

            {/* Stats Cards */}
            <StatsGrid gymsFetched={gymsFetched} />

            {/* Gyms Grid */}
            <h2 className="text-2xl font-semibold text-gray-900 mb-2 mt-16">List of Gyms</h2>
            <p className="text-gray-600 text-sm mb-4">List of all gyms in the platform</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {gymsPage.map((gym) => (
                    <GymCard
                        key={gym.id}
                        gym={gym}
                        onEdit={handleOpenModal}
                    />
                ))}
            </div>

            {gymsPage.length === 0 && (
                <div className="text-center py-12">
                    <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No gyms created yet</p>
                    <p className="text-gray-400 text-sm mt-2">Click &quot;Create Gym&quot; to get started</p>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                            <h3 className="text-xl font-semibold">
                                {editingGym ? 'Edit Gym' : 'Create New Gym'}
                            </h3>
                            <button
                                onClick={handleCloseModal}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <GymForm
                            gym={editingGym ?? undefined}
                            onSuccess={handleCloseModal}
                            onCancel={handleCloseModal}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
