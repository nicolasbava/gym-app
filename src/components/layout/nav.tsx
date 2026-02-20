'use client';
import { useApp } from '@/src/contexts/AppContext';
import { useAuth } from '@/src/hooks/useAuth';
import { Calendar, ClipboardList, Dumbbell, User, Users } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

type CoachView = 'exercises' | 'routines' | 'members';
type MemberView = 'home' | 'exercises' | 'routines' | 'workout' | 'profile';

export default function NavBar() {
    const router = useRouter();
    const { userProfile, mode } = useApp();
    const { isAuthenticated } = useAuth();
    const [memberView, setMemberView] = useState<MemberView>('routines');

    const handleViewChange = (view: MemberView) => {
        setMemberView(view);
        router.push(`/${view}`);
    };
    console.log('isAuthenticated', isAuthenticated);

    if (!isAuthenticated) {
        return null;
    }

    return (
        <nav className="flex gap-2 mb-6 overflow-x-auto pb-2 mt-8">
            {userProfile?.role === 'coach' && <CoachNavBar setCoachView={handleViewChange} />}
            {userProfile?.role === 'member' ||
                (userProfile?.role === 'coach' && mode === 'member' && (
                    <MemberNavBar handleViewChange={handleViewChange} />
                ))}
        </nav>
    );
}

const CoachNavBar = ({ setCoachView }: { setCoachView: (view: any) => void }) => {
    const pathname = usePathname();

    return (
        <nav className="flex gap-2 mb-6 overflow-x-auto pb-2">
            <button
                onClick={() => setCoachView('exercises')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    pathname === '/exercises'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
            >
                <Dumbbell className="w-5 h-5" />
                Ejercicios
            </button>
            <button
                onClick={() => setCoachView('routines')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    pathname === '/routines'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
            >
                <ClipboardList className="w-5 h-5" />
                Rutinas
            </button>
            <button
                onClick={() => setCoachView('members')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    pathname === '/members'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
            >
                <Users className="w-5 h-5" />
                Miembros
            </button>
        </nav>
    );
};

const MemberNavBar = ({ handleViewChange }: { handleViewChange: (view: any) => void }) => {
    const pathname = usePathname();
    return (
        <nav className="flex gap-2 mb-6 overflow-x-auto pb-2">
            <button
                onClick={() => handleViewChange('home')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    pathname === '/home'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
            >
                <Calendar className="w-5 h-5" />
                Home
            </button>
            <button
                onClick={() => handleViewChange('profile')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    pathname === '/profile'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
            >
                <User className="w-5 h-5" />
                Perfil
            </button>
        </nav>
    );
};
