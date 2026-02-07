import { useApp } from '@/src/contexts/AppContext';
import { Users } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../ui/button';
import { Dialog, DialogContent, DialogTrigger } from '../../ui/dialog';
import CreateMemberDialog from './member-form';

export default function MembersDialog() {
    const { gymId } = useApp();
    const [openCreateMember, setOpenCreateMember] = useState(false);
    return (
        <>
            <Dialog open={openCreateMember} onOpenChange={setOpenCreateMember}>
                <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                        <Users className="h-4 w-4 mr-2" />
                        Nuevo miembro
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <CreateMemberDialog gymId={gymId ?? ''} onSuccess={() => {}} setOpen={setOpenCreateMember} />
                </DialogContent>
            </Dialog>
        </>
    );
}
