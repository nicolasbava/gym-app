import { SupabaseClient } from '@supabase/supabase-js';
import { CreateExercise, UpdateExercise } from './exercises.schema';

export class ExerciseService {
    constructor(private supabase: SupabaseClient) {}

    async getExercisesByGym(gymId: string) {
        const { data, error } = await this.supabase
            .from('exercises')
            .select('*')
            .eq('gym_id', gymId)
            .order('name', { ascending: true });

        if (error) {
            throw error;
        }
        return data;
    }

    async getGlobalExercises() {
        const { data, error } = await this.supabase
            .from('exercises')
            .select('*')
            .order('name', { ascending: true });

        if (error) throw error;
        return data;
    }

    async getAllExercises(gymId?: string) {
        if (gymId) {
            // Obtener ejercicios del gym y globales
            const { data, error } = await this.supabase
                .from('exercises')
                .select('*')
                .or(`gym_id.eq.${gymId}`)
                .order('name', { ascending: true });

            if (error) throw error;
            return data;
        } else {
            // Solo globales
            return this.getGlobalExercises();
        }
    }

    async createExercise(exercise: CreateExercise) {
        const insertData: CreateExercise = {
            name: exercise.name,
            description: exercise.description,
            created_by: exercise.created_by,
            muscle_group: exercise.muscle_group,
            equipment: exercise.equipment,
            mux_upload_id: exercise.mux_upload_id,
            mux_playback_id: exercise.mux_playback_id,
            mux_status: exercise.mux_status,
            images_url: exercise.images_url,
        };

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
            .from('exercises')
            .insert(insertData)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async updateExercise(exerciseId: string, updates: UpdateExercise) {
        const { data, error } = await this.supabase
            .from('exercises')
            .update({
                ...updates,
                updated_at: new Date().toISOString(),
            })
            .eq('id', exerciseId)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async deleteExercise(exerciseId: string) {
        // soft deleting the exercise
        const { error } = await this.supabase
            .from('exercises')
            .update({ deleted_at: new Date().toISOString() })
            .eq('id', exerciseId);

        if (error) throw error;
    }

    async getExerciseById(exerciseId: string) {
        const { data, error } = await this.supabase
            .from('exercises')
            .select('*')
            .eq('id', exerciseId)
            .single();

        if (error) throw error;
        return data;
    }
}
