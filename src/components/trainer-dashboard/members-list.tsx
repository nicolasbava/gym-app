import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";
import { UserProfile } from "@/src/app/actions/users";
import { useProfiles } from "@/src/modules/profiles/useProfiles";
import { useApp } from "@/src/contexts/AppContext";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Profile } from "@/src/modules/profiles/profiles.schema";
export default function MembersList() {
  const router = useRouter();
  const { gymId } = useApp();
  const [members, setMembers] = useState<Profile[]>([]);
  const { getProfilesPerGym, loading: membersPerGymLoading } = useProfiles();

  const getMembers = useCallback(async () => {
    if (!gymId) return console.error("Gym ID is required");
    const data = await getProfilesPerGym(gymId);
    setMembers(data as Profile[]);
  }, [gymId]);

  useEffect(() => {
    getMembers();
  }, [getMembers]);

  const handleMemberDetails = (id: string) => {
    router.push(`/member/${id}`);
  };

  if (membersPerGymLoading) return <div>Cargando...</div>;

  return (
    <Card className="bg-black/40 border-purple-800/30 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white">Clientes Activos</CardTitle>
        <CardDescription className="text-purple-200">
          Gestiona y supervisa el progreso de tus clientes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {members.map((member, index) => (
          <div
            key={index}
            onClick={() => handleMemberDetails(member.id)}
            className="flex items-center justify-between p-4 bg-purple-900/20 rounded-lg cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarFallback className="bg-purple-600">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="text-white font-medium">{member.name}</h4>
                {/* <p className="text-sm text-purple-300">
                  Plan {member.plan} • {member.lastWorkout}
                </p> */}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/assign-program">
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  Ver
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

{
  /* <div>
<h4 className="text-white font-medium">{member.name}</h4>
<p className="text-sm text-purple-300">
    Plan {member.plan} • {member.lastWorkout}
</p>
</div> */
}

{
  /* <div className="text-right">
<p className="text-white">{member.progress}%</p>
<Progress value={member.progress} className="w-20 mt-1" />
</div> */
}
