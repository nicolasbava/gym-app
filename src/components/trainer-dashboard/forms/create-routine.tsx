"use client"

import { useState, useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/src/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form"
import { Input } from "@/src/components/ui/input"
import { Textarea } from "@/src/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select"
import { Plus, Trash2, Dumbbell } from "lucide-react"
import { createRoutineSchema, type CreateRoutine, type RoutineExercise } from "@/src/modules/routines/routines.schema"
import { createRoutine, getExercises } from "@/src/app/actions/routines"
import { getUser } from "@/src/app/actions/auth"

interface Exercise {
  id: string
  name: string
  description?: string
  muscle_group?: string
  equipment?: string
}

interface CreateRoutineDialogProps {
  gymId: string
  onSuccess?: () => void
  open: boolean
  setOpen: (open: boolean) => void
}

export default function CreateRoutineDialog({ gymId, onSuccess, open, setOpen }: CreateRoutineDialogProps) {
  // const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loadingExercises, setLoadingExercises] = useState(true)

  const form = useForm<CreateRoutine>({
    resolver: zodResolver(createRoutineSchema),
    defaultValues: {
      gym_id: gymId,
      name: "",
      description: "",
      created_by: "",
      exercises: [
        {
          exercise_id: "",
          order_index: 0,
          sets: 3,
          reps: "8-12",
          rest_seconds: 60,
          notes: "",
        },
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "exercises",
  })

  useEffect(() => {
    console.log('open', open)
    if (open) {
      console.log('loading exercises')
      loadExercises()
      loadUser()
    }
  }, [open])

  const loadExercises = async () => {
    try {
      setLoadingExercises(true)
      const result = await getExercises()
      console.log('result', result)
      if (result.success && result.data) {
        setExercises(result.data as Exercise[])
      }
    } catch (err) {
      console.error("Error loading exercises:", err)
    } finally {
      setLoadingExercises(false)
    }
  }

  const loadUser = async () => {
    try {
      const user = await getUser()
      if (user) {
        form.setValue("created_by", user.id)
      }
    } catch (err) {
      console.error("Error loading user:", err)
    }
  }

  const onSubmit = async (data: CreateRoutine) => {
    try {
      setError(null)
      setIsLoading(true)
      
      const result = await createRoutine(data)
      
      if (!result.success) {
        setError(result.error || "Error al crear la rutina")
        return
      }

      // Resetear formulario
      form.reset()
      setOpen(false)
      
      // Llamar callback si existe
      if (onSuccess) {
        onSuccess()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setIsLoading(false)
    }
  }

  const addExercise = () => {
    append({
      exercise_id: "",
      order_index: fields.length,
      sets: 3,
      reps: "8-12",
      rest_seconds: 60,
      notes: "",
    })
  }

  return (
    // <Dialog open={open} onOpenChange={setOpen}>
    //   <DialogTrigger asChild>
    //     <Button className="bg-purple-600 hover:bg-purple-700">
    //       <Plus className="h-4 w-4 mr-2" />
    //       Crear Rutina
    //     </Button>
    //   </DialogTrigger>
      <DialogContent className="bg-slate-900 border-purple-800/30 max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white text-2xl flex items-center gap-2">
            <Dumbbell className="h-6 w-6 text-purple-400" />
            Crear Nueva Rutina
          </DialogTitle>
          <DialogDescription className="text-purple-200">
            Completa los datos para crear una nueva rutina de entrenamiento
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-md text-red-200 text-sm">
            {error}
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-purple-200">Nombre de la Rutina</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Ej: Rutina de Fuerza - Push"
                      className="bg-black/20 border-purple-800/50 text-white placeholder:text-purple-300"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-purple-200">Descripción (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Describe el objetivo y características de esta rutina..."
                      className="bg-black/20 border-purple-800/50 text-white placeholder:text-purple-300 min-h-[100px]"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel className="text-purple-200 text-lg">Ejercicios</FormLabel>
                <Button
                  type="button"
                  onClick={addExercise}
                  variant="outline"
                  size="sm"
                  className="border-purple-600 text-purple-300 hover:bg-purple-900/20"
                  disabled={isLoading || loadingExercises}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Ejercicio
                </Button>
              </div>

              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="p-4 bg-black/20 border border-purple-800/30 rounded-lg space-y-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-purple-300 font-semibold">Ejercicio {index + 1}</span>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => remove(index)}
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                        disabled={isLoading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`exercises.${index}.exercise_id`}
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="text-purple-200">Ejercicio</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={isLoading || loadingExercises}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-black/20 border-purple-800/50 text-white">
                                <SelectValue placeholder="Selecciona un ejercicio">
                                  {loadingExercises
                                    ? "Cargando ejercicios..."
                                    : exercises.find((e) => e.id === field.value)?.name || "Selecciona un ejercicio"}
                                </SelectValue>
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-slate-800 border-purple-800/50 max-h-[200px]">
                              {exercises.map((exercise) => (
                                <SelectItem
                                  key={exercise.id}
                                  value={exercise.id}
                                  className="text-white"
                                >
                                  {exercise.name}
                                  {exercise.muscle_group && (
                                    <span className="text-purple-400 text-xs ml-2">
                                      ({exercise.muscle_group})
                                    </span>
                                  )}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`exercises.${index}.sets`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-purple-200">Series</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              min="1"
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              className="bg-black/20 border-purple-800/50 text-white"
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`exercises.${index}.reps`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-purple-200">Repeticiones</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Ej: 8-12 o 10"
                              className="bg-black/20 border-purple-800/50 text-white placeholder:text-purple-300"
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`exercises.${index}.rest_seconds`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-purple-200">Descanso (segundos)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              min="0"
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              className="bg-black/20 border-purple-800/50 text-white"
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`exercises.${index}.notes`}
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="text-purple-200">Notas (opcional)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Técnica, variaciones, etc."
                              className="bg-black/20 border-purple-800/50 text-white placeholder:text-purple-300"
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="border-purple-800/50 text-purple-300 hover:bg-purple-900/20"
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                // type="submit"
                onClick={() => onSubmit(form.getValues())}
                className="bg-purple-600 hover:bg-purple-700"
                disabled={isLoading}
              >
                {isLoading ? "Creando..." : "Crear Rutina"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    // </Dialog>
  )
}
