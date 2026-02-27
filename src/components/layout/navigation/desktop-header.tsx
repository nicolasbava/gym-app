'use client';
import { signOut } from '@/src/app/actions/auth';
import { useApp } from '@/src/contexts/AppContext';
import { LogOut } from 'lucide-react';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import Image from 'next/image';
import { Button } from '../../ui/button';

export function DesktopHeader() {
    const { mode, setMode, isCoach, isAuthenticated, gymData } = useApp();

    const handleLogout = async () => {
        try {
            const response = await signOut();
            if (response.success) {
                window.location.href = '/auth';
            }
        } catch (error) {
            if (isRedirectError(error)) return;
            console.error('Logout error:', error);
        }
    };

    return (
        <header className="hidden md:block bg-white shadow-sm border-b sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {/* <Dumbbell className="w-8 h-8 text-blue-600" /> */}
                        <Image
                            src={gymData?.logo_url ?? ''}
                            alt={gymData?.name ?? ''}
                            width={32}
                            height={32}
                        />
                        <h1 className="text-xl font-semibold text-gray-900">{gymData?.name}</h1>
                    </div>

                    {isCoach && (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setMode('admin')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    mode === 'admin'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                Admin View
                            </button>
                            <button
                                onClick={() => setMode('coach')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    mode === 'coach'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                Coach View
                            </button>
                            <button
                                onClick={() => setMode('member')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    mode === 'member'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                Member View
                            </button>
                        </div>
                    )}

                    {isAuthenticated && (
                        <>
                            <Button
                                onClick={handleLogout}
                                variant="ghost"
                                size="sm"
                                className="hidden sm:flex items-center gap-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 cursor-pointer"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Cerrar Sesión</span>
                            </Button>
                            <Button
                                onClick={handleLogout}
                                variant="ghost"
                                size="icon"
                                className="sm:hidden text-gray-700 hover:text-gray-900 hover:bg-gray-100 cursor-pointer"
                            >
                                <LogOut className="w-5 h-5" />
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
