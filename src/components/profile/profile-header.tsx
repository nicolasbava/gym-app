import { type UserProfile } from '@/src/app/actions/users';
import UserAvatar from '@/src/components/common/UserAvatar';
import { Badge } from '@/src/components/ui/badge';

interface ProfileHeaderProps {
    profile: UserProfile;
    className?: string;
}

function getRoleLabel(role: string | null | undefined): string {
    const roleMap: Record<string, string> = {
        member: 'Miembro',
        trainer: 'Entrenador',
        gym_admin: 'Administrador',
    };
    return roleMap[role ?? ''] ?? 'Usuario';
}

function getRoleVariant(role: string | null | undefined): 'default' | 'secondary' | 'outline' {
    if (role === 'trainer') return 'default';
    if (role === 'gym_admin') return 'secondary';
    return 'outline';
}

export function ProfileHeader({ profile, className }: ProfileHeaderProps) {
    return (
        <div className={`flex flex-col items-center gap-4 sm:flex-row sm:items-start ${className ?? ''}`}>
            <UserAvatar
                name={profile.name}
                imageUrl={profile.image_url}
                className="size-24 sm:size-32"
                fallbackClassName="text-2xl sm:text-3xl"
            />
            <div className="flex flex-col items-center gap-2 sm:items-start">
                <h2 className="text-2xl font-bold text-foreground sm:text-3xl">{profile.name}</h2>
                {profile.role && (
                    <Badge variant={getRoleVariant(profile.role)} className="w-fit">
                        {getRoleLabel(profile.role)}
                    </Badge>
                )}
                {profile.email && <p className="text-sm text-muted-foreground sm:text-base">{profile.email}</p>}
            </div>
        </div>
    );
}
