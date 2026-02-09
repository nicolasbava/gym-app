import { useApp } from '@/src/contexts/AppContext';
import { DialogTitle } from '@radix-ui/react-dialog';
import { Dumbbell, Link2 } from 'lucide-react';
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
        <div className="flex justify-end gap-2">
            {/* CREATE ROUTINE DIALOG */}
            <Dialog open={openCreateRoutine} onOpenChange={setOpenCreateRoutine}>
                <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700 cursor-pointer">
                        <Dumbbell className="h-4 w-4 mr-2" />
                        Nueva Rutina
                    </Button>
                </DialogTrigger>
                <DialogContent className="bg-white border border-gray-200 rounded-lg max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                            <Dumbbell className="h-6 w-6 text-blue-600" />
                            Crear Nueva Rutina
                        </DialogTitle>
                        <DialogDescription className="text-sm text-gray-600">
                            Completa los datos para crear una nueva rutina de entrenamiento
                        </DialogDescription>
                    </DialogHeader>
                    <CreateRoutineForm gymId={gymId ?? ''} onSuccess={() => setOpenCreateRoutine(false)} />
                </DialogContent>
            </Dialog>

            {/* ASSIGN ROUTINE DIALOG */}
            <Dialog open={openAssignRoutine} onOpenChange={setOpenAssignRoutine}>
                <DialogTrigger asChild>
                    <Button variant="outline" className="border border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer">
                        <Link2 className="h-4 w-4 mr-2" />
                        Asignar Rutina
                    </Button>
                </DialogTrigger>
                <DialogContent className="bg-white border border-gray-200 rounded-lg max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                            <Link2 className="h-6 w-6 text-blue-600" />
                            Asignar rutina a cliente
                        </DialogTitle>
                        <DialogDescription className="text-sm text-gray-600">Elige una rutina y el cliente al que asignarla</DialogDescription>
                    </DialogHeader>
                    <AssignRoutineForm gymId={gymId ?? ''} onSuccess={() => setOpenAssignRoutine(false)} />
                </DialogContent>
            </Dialog>
        </div>
    );
}
