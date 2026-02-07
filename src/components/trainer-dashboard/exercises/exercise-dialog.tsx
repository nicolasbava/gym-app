import { useApp } from '@/src/contexts/AppContext';
import { Dumbbell, Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import CreateExerciseForm from './exercise-form';

/// BUTTON TO OPEN DIALOG AND SHOW FORM TO CREATE EXERCISE

export default function ExerciseDialog() {
    const [openExerciseForm, setOpenExerciseForm] = useState(false);
    const { gymId } = useApp();

    return (
        <>
            {/* // Action Buttons */}
            {/* {(isTrialActive && trialDaysLeft > 0) || hasSubscription ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Crear rutina
            </Button>
          </DialogTrigger>
          <CreateRoutineDialog
            gymId={gymId ?? ""}
            onSuccess={() => {}}
            open={open}
            setOpen={setOpen}
          />
        </Dialog>
      ) : null}
      {(isTrialActive && trialDaysLeft > 0) || hasSubscription ? (
        
      ) : null} */}
            <Dialog open={openExerciseForm} onOpenChange={setOpenExerciseForm}>
                <DialogTrigger asChild>
                    <Button className="bg-purple-600 hover:bg-purple-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Crear Ejercicio
                    </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-900 border-purple-800/30 max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-white text-2xl flex items-center gap-2">
                            <Dumbbell className="h-6 w-6 text-purple-400" />
                            Crear Nuevo Ejercicio
                        </DialogTitle>
                        <DialogDescription className="text-purple-200">Completa los datos para agregar un nuevo ejercicio a tu biblioteca</DialogDescription>
                    </DialogHeader>
                    <CreateExerciseForm gymId={gymId ?? ''} onSuccess={() => {}} />
                </DialogContent>
            </Dialog>
        </>
    );
}
