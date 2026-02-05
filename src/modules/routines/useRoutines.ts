// src/hooks/useRoutines.ts
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/src/utils/supabase/client'
import { RoutineService } from '@/src/modules/routines/routines.service'
import { CreateRoutine } from './routines.schema'

export function useRoutines(gymId: string) {
  const [routines, setRoutines] = useState<CreateRoutine[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const supabase = createClient()
  const routineService = new RoutineService(supabase)

  useEffect(() => {
    fetchRoutines()
  }, [gymId])

  async function fetchRoutines() {
    try {
      setLoading(true)
      const data = await routineService.getRoutinesByGym(gymId)
      setRoutines(data as never[])
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  async function createRoutine(routineData: any) {
    try {
      const newRoutine = await routineService.createRoutine(routineData)
      setRoutines(prev => [newRoutine, ...prev])
      return newRoutine
    } catch (err) {
        console.log('err', err)
      setError(err as Error)
      throw err
    }
  }

  return {
    routines,
    loading,
    error,
    createRoutine,
    refresh: fetchRoutines,
  }
}