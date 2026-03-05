import { useApp } from '@/src/contexts/AppContext';
import { Exercise } from '@/src/modules/exercises/exercises.schema';
import { Dumbbell, Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../ui/dialog';
import CreateExerciseForm from './ExerciseForm';

interface ExerciseDialogProps {
    exercise?: Exercise; // Si existe, es modo edición
    onSuccess?: () => void;
}

/// BUTTON TO OPEN DIALOG AND SHOW FORM TO CREATE/EDIT EXERCISE

export default function ExerciseDialog({ exercise, onSuccess }: ExerciseDialogProps) {
    const [openExerciseForm, setOpenExerciseForm] = useState(false);
    const { gymId } = useApp();
    const isEditing = !!exercise;

    const handleSuccess = () => {
        setOpenExerciseForm(false);
        if (onSuccess) {
            onSuccess();
        }
    };

    return (
        <Dialog open={openExerciseForm} onOpenChange={setOpenExerciseForm}>
            <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 cursor-pointer">
                    <Plus className="h-4 w-4 mr-2" />
                    {isEditing ? 'Editar Ejercicio' : 'Crear Ejercicio'}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl flex items-center gap-2">
                        <Dumbbell className="h-6 w-6 text-blue-600" />
                        {isEditing ? 'Editar Ejercicio' : 'Crear Nuevo Ejercicio'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? 'Modifica los datos del ejercicio'
                            : 'Completa los datos para agregar un nuevo ejercicio a tu biblioteca'}
                    </DialogDescription>
                </DialogHeader>
                <CreateExerciseForm
                    exercise={exercise}
                    onSuccess={handleSuccess}
                    setOpen={setOpenExerciseForm}
                />
            </DialogContent>
        </Dialog>
    );
}
