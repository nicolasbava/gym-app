import { Gym } from '@/src/modules/gym/gym.schema';
import { InfiniteData } from '@tanstack/react-query';
import { Building2, CheckCircle } from 'lucide-react';

interface StatsGridProps {
    gymsFetched: InfiniteData<Gym[]>;
}

export default function StatsGrid({ gymsFetched }: StatsGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <Building2 className="w-6 h-6 text-blue-600" />
                    </div>
                </div>
                <p className="text-gray-600 text-sm">Total Gyms</p>
                <p className="text-3xl font-semibold text-gray-900 mt-1">
                    {gymsFetched?.pages[0].length}
                </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-green-100 rounded-lg">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                </div>
                <p className="text-gray-600 text-sm">Active Gyms</p>
                <p className="text-3xl font-semibold text-gray-900 mt-1">
                    {
                        gymsFetched?.pages[0].filter((gym) => gym.subscription_status === 'active')
                            .length
                    }
                </p>
            </div>

            {/* <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-purple-100 rounded-lg">
                        <Users className="w-6 h-6 text-purple-600" />
                    </div>
                </div>
                <p className="text-gray-600 text-sm">Total Members</p>
                <p className="text-3xl font-semibold text-gray-900 mt-1">
                    {gymsFetched?.pages[0].reduce((sum, gym) => sum + gym.total_members, 0)}
                </p>
            </div> */}

            {/* <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-orange-100 rounded-lg">
                        <Award className="w-6 h-6 text-orange-600" />
                    </div>
                </div>
                <p className="text-gray-600 text-sm">Total Coaches</p>
                <p className="text-3xl font-semibold text-gray-900 mt-1">
                    {gymsFetched?.pages[0].reduce((sum, gym) => sum + gym.total_coaches, 0)}
                </p>
            </div> */}
        </div>
    );
}
