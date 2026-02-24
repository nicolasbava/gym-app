'use client';

import { signOut } from '@/src/app/actions/auth';
import { NavButton, useFilteredNavButtons } from '@/src/components/layout/nav';
import { Button } from '@/src/components/ui/button';
import { useApp } from '@/src/contexts/AppContext';
import { useAuth } from '@/src/hooks/useAuth';
import { Dumbbell, LogOut, Menu, X } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const { userProfile, mode, setMode } = useApp();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { isAuthenticated, clear, refetchSession, refetchUser } = useAuth();
    const { filteredButtons, showNav } = useFilteredNavButtons();

    const pageIsNotAuth = usePathname() !== '/auth';

    const handleLogout = async () => {
        clear();
        try {
            await signOut();
        } catch {
            await refetchSession();
            await refetchUser();
        }
    };

    const handleMobileNavClick = (path: string) => {
        setMobileMenuOpen(false);
        router.push(path);
    };

    return (
        <header className="bg-white shadow-sm border-b sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Dumbbell className="w-8 h-8 text-blue-600" />
                        <h1 className="text-xl font-semibold text-gray-900">FitPro Gym</h1>
                    </div>

                    {/* Role Switcher - Demo purposes */}
                    {isAuthenticated && userProfile?.role !== 'member' && (
                        <div className="hidden sm:flex items-center gap-2">
                            <Button
                                onClick={() => setMode('coach')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                                    mode === 'coach'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                Coach View
                            </Button>
                            <Button
                                onClick={() => setMode('member')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                                    mode === 'member'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                Member View
                            </Button>
                        </div>
                    )}

                    <div className="flex items-center gap-2">
                        {/* {!isAuthenticated && pageIsNotAuth && (
                            <>
                                <Button
                                    onClick={handleLogin}
                                    variant="ghost"
                                    size="sm"
                                    className="hidden sm:flex items-center gap-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 cursor-pointer"
                                >
                                    <LogIn className="w-4 h-4" />
                                    <span>Iniciar Sesión</span>
                                </Button>
                                <Button
                                    onClick={handleLogin}
                                    variant="ghost"
                                    size="icon"
                                    className="sm:hidden text-gray-700 hover:text-gray-900 hover:bg-gray-100 cursor-pointer"
                                >
                                    <LogIn className="w-5 h-5" />
                                </Button>
                            </>
                        )} */}
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
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="sm:hidden p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
                            aria-expanded={mobileMenuOpen}
                            aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
                        >
                            {mobileMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile menu panel with nav - only when open and on mobile */}
                {mobileMenuOpen && (
                    <div
                        className="sm:hidden mt-4 pt-4 border-t border-gray-200"
                        role="dialog"
                        aria-label="Menú de navegación"
                    >
                        {showNav && (
                            <nav className={'flex flex-col gap-1'}>
                                {filteredButtons.map((button) => (
                                    <NavButton
                                        key={button.link}
                                        label={button.label}
                                        icon={button.icon}
                                        isActive={pathname === button.link}
                                        onClick={() => handleMobileNavClick(button.link)}
                                        className="w-full justify-start"
                                    />
                                ))}
                            </nav>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
}
