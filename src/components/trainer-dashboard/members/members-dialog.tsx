import { useApp } from '@/src/contexts/AppContext';
import { Profile } from '@/src/modules/profiles/profiles.schema';
import { UpdateUserProfileData } from '@/src/modules/users/register.schema';
import { DialogTitle } from '@radix-ui/react-dialog';
import { UserPlus, Users } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTrigger } from '../../ui/dialog';
import CreateMemberDialog from './member-form';

export default function MembersDialog({ member }: { member?: UpdateUserProfileData }) {
    const { gymId } = useApp();
    const [openCreateMember, setOpenCreateMember] = useState(false);
    return (
        <Dialog open={openCreateMember} onOpenChange={setOpenCreateMember}>
            <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 cursor-pointer">
                    <Users className="h-4 w-4 mr-2" />
                    Nuevo miembro
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-white border border-gray-200 rounded-lg max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                        <UserPlus className="h-6 w-6 text-blue-600" />
                        Crear usuario
                    </DialogTitle>
                    <DialogDescription className="text-sm text-gray-600">
                        Crea un nuevo miembro o entrenador y asígnalo al gimnasio.
                    </DialogDescription>
                </DialogHeader>
                <CreateMemberDialog
                    gym_id={gymId ?? ''}
                    member={member as unknown as Profile}
                    onSuccess={() => setOpenCreateMember(false)}
                    setOpen={setOpenCreateMember}
                />
            </DialogContent>
        </Dialog>
    );
}
