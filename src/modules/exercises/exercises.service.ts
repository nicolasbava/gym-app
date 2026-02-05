import { SupabaseClient } from '@supabase/supabase-js'

export class ExerciseService {
  constructor(private supabase: SupabaseClient) {}

  async getExercisesByGym(gymId: string) {
    const { data, error } = await this.supabase
      .from('exercises2')
      .select('*')
      .eq('gym_id', gymId)
      .order('name', { ascending: true })

    if (error) throw error
    return data
  }

  async getGlobalExercises() {
    const { data, error } = await this.supabase
      .from('exercises2')
      .select('*')
      .eq('is_global', true)
      .order('name', { ascending: true })

    if (error) throw error
    return data
  }

  async getAllExercises(gymId?: string) {
    if (gymId) {
      // Obtener ejercicios del gym y globales
      const { data, error } = await this.supabase
        .from('exercises2')
        .select('*')
        .or(`gym_id.eq.${gymId},is_global.eq.true`)
        .order('name', { ascending: true })

      if (error) throw error
      return data
    } else {
      // Solo globales
      return this.getGlobalExercises()
    }
  }

  async createExercise(exercise: {
    // gym_id?: string
    name: string
    description?: string
    // video_url?: string
    // muscle_group: string
    // equipment_needed: string
    created_by: string
    // is_global?: boolean
  }) {
    const insertData: any = {
      name: exercise.name,
      description: exercise.description,
      created_by: exercise.created_by,
      // video_url: exercise.video_url,
      // muscle_group: exercise.muscle_group,
      // equipment_needed: exercise.equipment_needed,
      // is_global: exercise.is_global || false,
    }

    // Solo agregar gym_id si existe y es un número válido (no UUID)
    // if (exercise.gym_id && typeof exercise.gym_id === 'string') {
    //   // Verificar si es un número (no UUID)
    //   const numValue = parseInt(exercise.gym_id, 10)
    //   if (!isNaN(numValue) && exercise.gym_id === String(numValue)) {
    //     insertData.gym_id = numValue
    //   }
    //   // Si es UUID o no es número válido, no lo agregamos
    // } else if (exercise.gym_id && typeof exercise.gym_id === 'number') {
    //   insertData.gym_id = exercise.gym_id
    // }

    const { data, error } = await this.supabase
      .from('exercises2')
      .insert(insertData)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateExercise(exerciseId: string, updates: {
    name?: string
    description?: string
    video_url?: string
    muscle_group?: string
    equipment_needed?: string
  }) {
    const { data, error } = await this.supabase
      .from('exercises2')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', exerciseId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteExercise(exerciseId: string) {
    const { error } = await this.supabase
      .from('exercises2')
      .delete()
      .eq('id', exerciseId)

    if (error) throw error
  }

  async getExerciseById(exerciseId: string) {
    const { data, error } = await this.supabase
      .from('exercises2')
      .select('*')
      .eq('id', exerciseId)
      .single()

    if (error) throw error
    return data
  }
}
