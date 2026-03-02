'use client';
import { UserRole } from '@/src/config/routes';
import { useApp } from '@/src/contexts/AppContext';
import { useAuth } from '@/src/hooks/useAuth';
import { Building, Calendar, ClipboardList, Dumbbell, User, Users } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';

export const navButtons = [
    {
        link: '/exercises',
        icon: <Dumbbell className="w-5 h-5" />,
        label: 'Ejercicios',
        role: ['coach', 'coach_admin'],
    },
    {
        link: '/routines',
        icon: <ClipboardList className="w-5 h-5" />,
        label: 'Rutinas',
        role: ['coach', 'coach_admin'],
    },
    {
        link: '/members',
        icon: <Users className="w-5 h-5" />,
        label: 'Miembros',
        role: ['coach', 'coach_admin'],
    },
    {
        link: '/home',
        icon: <Calendar className="w-5 h-5" />,
        label: 'Rutinas',
        role: ['member', 'coach', 'coach_admin'],
    },
    {
        link: '/profile',
        icon: <User className="w-5 h-5" />,
        label: 'Perfil',
        role: ['member', 'coach', 'coach_admin', 'admin'],
    },
    {
        link: '/gyms',
        icon: <Building className="w-5 h-5" />,
        label: 'Gimnasios',
        role: ['admin'],
    },
];

function getFilteredNavButtons(role: string, mode: string) {
    if ((role === 'coach' || role === 'coach_admin' || role === 'admin') && mode === 'member') {
        return navButtons.filter((button) => button.role.includes(mode));
    }
    if (role === 'member' && mode === 'member') {
        return navButtons.filter((button) => button.role.includes(mode));
    }
    if ((role === 'coach' || role === 'coach_admin' || role === 'admin') && mode === 'coach') {
        return navButtons.filter((button) => button.role.includes(mode));
    }
    if (role === 'admin' && mode === 'admin') {
        return navButtons.filter((button) => button.role.includes(mode));
    }
    return [];
}

export function useFilteredNavButtons() {
    const { userProfile, mode } = useApp();
    const { isAuthenticated } = useAuth();
    const showNav = Boolean(isAuthenticated) && Boolean(userProfile?.role) && Boolean(mode);
    const filteredButtons = useMemo(
        () =>
            showNav && userProfile?.role && mode
                ? getFilteredNavButtons(userProfile.role as UserRole, mode)
                : [],
        [showNav, userProfile?.role, mode],
    );
    return { filteredButtons, showNav };
}

export function NavButton({
    label,
    icon,
    onClick,
    isActive,
    className = '',
}: {
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
    isActive: boolean;
    className?: string;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${className} ${
                isActive ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
        >
            {icon}
            {label}
        </button>
    );
}

export default function NavBar() {
    const router = useRouter();
    const pathname = usePathname();
    const { filteredButtons, showNav } = useFilteredNavButtons();

    if (!showNav) {
        return null;
    }

    const handleNavigation = (path: string) => {
        router.push(path);
    };

    return (
        <nav className="flex gap-2 overflow-x-auto pb-2 mt-8">
            {filteredButtons.map((button) => (
                <NavButton
                    key={button.link}
                    onClick={() => handleNavigation(button.link)}
                    label={button.label}
                    icon={button.icon}
                    isActive={pathname === button.link}
                />
            ))}
        </nav>
    );
}
