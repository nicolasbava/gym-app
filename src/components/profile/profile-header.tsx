import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { Badge } from "@/src/components/ui/badge"
import { type UserProfile } from "@/src/app/actions/users"

interface ProfileHeaderProps {
  profile: UserProfile
  className?: string
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function getRoleLabel(role: string | null | undefined): string {
  const roleMap: Record<string, string> = {
    member: "Miembro",
    trainer: "Entrenador",
    gym_admin: "Administrador",
  }
  return roleMap[role ?? ""] ?? "Usuario";
}

function getRoleVariant(role: string | null | undefined): "default" | "secondary" | "outline" {
  if (role === "trainer") return "default";
  if (role === "gym_admin") return "secondary";
  return "outline"
};

export function ProfileHeader({ profile, className }: ProfileHeaderProps) {
  const initials = getInitials(profile.name)

  return (
    <div className={`flex flex-col items-center gap-4 sm:flex-row sm:items-start ${className ?? ""}`}>
      <Avatar className="size-24 sm:size-32">
        <AvatarImage src={profile.image_url ?? undefined} alt={profile.name} />
        <AvatarFallback className="bg-purple-600 text-white text-2xl sm:text-3xl">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col items-center gap-2 sm:items-start">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">{profile.name}</h1>
        {profile.role && (
          <Badge variant={getRoleVariant(profile.role)} className="w-fit">
            {getRoleLabel(profile.role)}
          </Badge>
        )}
        {profile.email && (
          <p className="text-sm text-purple-200 sm:text-base">{profile.email}</p>
        )}
      </div>
    </div>
  )
}
