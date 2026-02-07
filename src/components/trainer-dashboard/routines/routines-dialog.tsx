import { useApp } from '@/src/contexts/AppContext';
import { DialogTitle } from '@radix-ui/react-dialog';
import { Dumbbell, Link2, Users } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTrigger } from '../../ui/dialog';
import AssignRoutineForm from './assign-routine';
import CreateRoutineForm from './routine-form';

export default function RoutinesDialog() {
    const { gymId } = useApp();
    const [openCreateRoutine, setOpenCreateRoutine] = useState(false);
    const [openAssignRoutine, setOpenAssignRoutine] = useState(false);
    return (
        <>
            <Dialog open={openCreateRoutine} onOpenChange={setOpenCreateRoutine}>
                <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                        <Users className="h-4 w-4 mr-2" />
                        Nueva Rutina
                    </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-900 border-purple-800/30 max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-white text-2xl flex items-center gap-2">
                            <Dumbbell className="h-6 w-6 text-purple-400" />
                            Crear Nueva Rutina
                        </DialogTitle>
                        <DialogDescription className="text-purple-200">Completa los datos para crear una nueva rutina de entrenamiento</DialogDescription>
                    </DialogHeader>
                    <CreateRoutineForm gymId={gymId ?? ''} onSuccess={() => setOpenCreateRoutine(false)} />
                </DialogContent>
            </Dialog>
            <Dialog open={openAssignRoutine} onOpenChange={setOpenAssignRoutine}>
                <DialogTrigger asChild>
                    <Button variant="outline" className="border-green-600 text-green-300 hover:bg-green-900/20">
                        <Link2 className="h-4 w-4 mr-2" />
                        Asignar Rutina
                    </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-900 border-purple-800/30 max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-white text-2xl flex items-center gap-2">
                            <Link2 className="h-6 w-6 text-green-400" />
                            Asignar rutina a cliente
                        </DialogTitle>
                        <DialogDescription className="text-purple-200">Elige una rutina y el cliente al que asignarla</DialogDescription>
                    </DialogHeader>
                    <AssignRoutineForm gymId={gymId ?? ''} onSuccess={() => setOpenAssignRoutine(false)} />
                </DialogContent>
            </Dialog>
        </>
    );
}
