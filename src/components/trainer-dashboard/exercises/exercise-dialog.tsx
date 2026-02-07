import { useState } from "react";
import { Dialog } from "../../ui/dialog";
import CreateExerciseForm from "./exercise-form";
import { useApp } from "@/src/contexts/AppContext";

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
        <Dialog open={openCreateUser} onOpenChange={setOpenCreateUser}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Users className="h-4 w-4 mr-2" />
              Nuevo miembro
            </Button>
          </DialogTrigger>
          <CreateUserDialog
            gymId={gymId ?? ""}
            onSuccess={() => {}}
            open={openCreateUser}
            setOpen={setOpenCreateUser}
          />
        </Dialog>
      ) : null} */}

      <Dialog open={openExerciseForm} onOpenChange={setOpenExerciseForm}>
        <CreateExerciseForm gymId={gymId ?? ""} onSuccess={() => {}} />
      </Dialog>
    </>
  );
}
