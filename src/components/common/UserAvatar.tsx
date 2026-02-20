'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar';
import { cn } from '@/src/lib/utils';

const AVATAR_COLOURS = [
    'bg-rose-500',
    'bg-pink-500',
    'bg-fuchsia-500',
    'bg-purple-500',
    'bg-violet-500',
    'bg-indigo-500',
    'bg-blue-500',
    'bg-cyan-500',
    'bg-teal-500',
    'bg-emerald-500',
    'bg-lime-500',
    'bg-amber-500',
    'bg-orange-500',
];

function getInitials(name?: string) {
    if (!name) {
        return 'NA';
    }

    const words = name.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) {
        return 'NA';
    }

    const [firstWord = '', secondWord = ''] = words;

    if (words.length === 1) {
        return firstWord.slice(0, 2).toUpperCase();
    }

    return `${firstWord.charAt(0)}${secondWord.charAt(0)}`.toUpperCase();
}

function getAvatarColourClass(seed: string) {
    let hash = 0;
    for (let index = 0; index < seed.length; index++) {
        hash = seed.charCodeAt(index) + ((hash << 5) - hash);
    }

    return AVATAR_COLOURS[Math.abs(hash) % AVATAR_COLOURS.length];
}

interface UserAvatarProps {
    name?: string | null;
    imageUrl?: string | null;
    className?: string;
    imageClassName?: string;
    fallbackClassName?: string;
}

export default function UserAvatar({
    name,
    imageUrl,
    className,
    imageClassName,
    fallbackClassName,
}: UserAvatarProps) {
    const safeName = name ?? '';
    const initials = getInitials(safeName);
    const colourClass = getAvatarColourClass(safeName || 'user-avatar');

    return (
        <Avatar className={className}>
            <AvatarImage src={imageUrl ?? undefined} alt={safeName} className={cn('object-cover', imageClassName)} />
            <AvatarFallback className={cn(colourClass, 'text-white font-semibold', fallbackClassName)}>
                {initials}
            </AvatarFallback>
        </Avatar>
    );
}
