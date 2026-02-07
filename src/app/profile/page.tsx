
import { redirect } from "next/navigation"
import { getCurrentUserProfile } from "@/src/app/actions/users"
import { ProfileHeader } from "@/src/components/profile/profile-header"
import { ProfileSection } from "@/src/components/profile/profile-section"
import { ProfileInfoCard, ProfileInfoItem } from "@/src/components/profile/profile-info-card"
// import { ProfileEditForm } from "@/src/components/profile/profile-edit-form"
import { Mail, Phone, User, Building2 } from "lucide-react"
import { Suspense } from "react"
import { Card, CardContent } from "@/src/components/ui/card"

async function ProfileContent() {
  const { profile, error } = await getCurrentUserProfile()

  if (error || !profile) {
    redirect("/auth")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          <ProfileHeader profile={profile} />

          <div className="grid gap-6 md:grid-cols-2">
            <ProfileSection title="Información Personal" description="Tu información de perfil">
              <ProfileInfoCard>
                <ProfileInfoItem label="Nombre completo" value={profile.name} icon={<User className="size-4" />} />
                <ProfileInfoItem label="Email" value={profile.email} icon={<Mail className="size-4" />} />
                <ProfileInfoItem label="Teléfono" value={profile.phone ?? undefined} icon={<Phone className="size-4" />} />
                {profile.role && (
                  <ProfileInfoItem label="Rol" value={profile.role} icon={<Building2 className="size-4" />} />
                )}
              </ProfileInfoCard>
            </ProfileSection>

            {/* <ProfileSection title="Editar Perfil" description="Actualiza tu información personal">
              <ProfileEditForm profile={profile} />
            </ProfileSection> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
          <Card className="bg-card/40 border-yellow-500/20 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="text-foreground">Cargando perfil...</div>
            </CardContent>
          </Card>
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  )
}
