'use client';

import { useApp } from '@/src/contexts/AppContext';
import { Calendar, ClipboardList, Dumbbell, Home, User, Users } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

export function BottomNavigation() {
    const { mode, setMode, isCoach, isAuthenticated } = useApp();
    const router = useRouter();
    const pathname = usePathname();

    const handleNavigation = (path: string) => {
        router.push(path);
    };

    if (!isAuthenticated) return null;

    // const navButtonsFiltered = useMemo(() => {
    //     return navButtons.filter((button: any) => button.role === mode);
    // }, [mode]);

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
            {/* Admin mode */}
            {mode === 'admin' && (
                <div className="grid grid-cols-2 gap-1 px-2 py-2">
                    {/* <button
                        onClick={() => handleNavigation('/dashboard')}
                        className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors ${
                            mode === 'admin' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
                        }`}
                    >
                        <BarChart3 className="w-6 h-6" />
                        <span className="text-xs mt-1 font-medium">Dashboard</span>
                    </button> */}
                    <button
                        onClick={() => setMode('coach')}
                        className="flex flex-col items-center justify-center py-2 px-3 rounded-lg text-gray-600 transition-colors active:bg-gray-50"
                    >
                        <Dumbbell className="w-6 h-6" />
                        <span className="text-xs mt-1 font-medium">Coach</span>
                    </button>
                    <button
                        onClick={() => setMode('member')}
                        className="flex flex-col items-center justify-center py-2 px-3 rounded-lg text-gray-600 transition-colors active:bg-gray-50"
                    >
                        <User className="w-6 h-6" />
                        <span className="text-xs mt-1 font-medium">Member</span>
                    </button>
                </div>
            )}

            {/* Coach mode */}
            {mode === 'coach' && (
                <div className="grid grid-cols-4 gap-1 px-2 py-2">
                    {isCoach && (
                        <button
                            onClick={() => setMode('admin')}
                            className="flex flex-col items-center justify-center py-2 px-2 rounded-lg text-gray-600 transition-colors active:bg-gray-50"
                        >
                            <Home className="w-6 h-6" />
                            <span className="text-xs mt-1 font-medium">Admin</span>
                        </button>
                    )}
                    <button
                        onClick={() => handleNavigation('/exercises')}
                        className={`flex flex-col items-center justify-center py-2 px-2 rounded-lg transition-colors ${
                            pathname === '/exercises' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
                        }`}
                    >
                        <Dumbbell className="w-6 h-6" />
                        <span className="text-xs mt-1 font-medium">Exercises</span>
                    </button>
                    <button
                        onClick={() => handleNavigation('/routines')}
                        className={`flex flex-col items-center justify-center py-2 px-2 rounded-lg transition-colors ${
                            pathname === '/routines' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
                        }`}
                    >
                        <ClipboardList className="w-6 h-6" />
                        <span className="text-xs mt-1 font-medium">Routines</span>
                    </button>
                    <button
                        onClick={() => handleNavigation('/members')}
                        className={`flex flex-col items-center justify-center py-2 px-2 rounded-lg transition-colors ${
                            pathname === '/members' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
                        }`}
                    >
                        <Users className="w-6 h-6" />
                        <span className="text-xs mt-1 font-medium">Members</span>
                    </button>
                </div>
            )}

            {/* Member mode */}
            {mode === 'member' && (
                <div className="grid grid-cols-3 gap-1 px-2 py-2">
                    {isCoach && (
                        <button
                            onClick={() => setMode('admin')}
                            className="flex flex-col items-center justify-center py-2 px-3 rounded-lg text-gray-600 transition-colors active:bg-gray-50"
                        >
                            <Home className="w-6 h-6" />
                            <span className="text-xs mt-1 font-medium">Admin</span>
                        </button>
                    )}
                    <button
                        onClick={() => handleNavigation('/home')}
                        className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors ${
                            pathname === '/home' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
                        }`}
                    >
                        <Calendar className="w-6 h-6" />
                        <span className="text-xs mt-1 font-medium">Rutinas</span>
                    </button>
                    <button
                        onClick={() => handleNavigation('/profile')}
                        className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors ${
                            pathname === '/profile' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
                        }`}
                    >
                        <User className="w-6 h-6" />
                        <span className="text-xs mt-1 font-medium">Perfil</span>
                    </button>
                </div>
            )}
        </nav>
    );
}
