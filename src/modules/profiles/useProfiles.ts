// src/hooks/useRoutines.ts
'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/src/utils/supabase/client'
import { Profile } from './profiles.schema'
import { ProfilesService } from './profiles.service'
import { useQuery } from '@tanstack/react-query';

export function useProfiles() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const [loadingMemberDetails, setLoadingMemberDetails] = useState(true)
  const [errorMemberDetails, setErrorMemberDetails] = useState<Error | null>(null)

  const supabase = createClient()
  const profileService = new ProfilesService(supabase)


  async function getProfilesPerGym(gymId: string) {
    if(!gymId) return console.error('Gym ID is required')
    try {
      setLoading(true)
      const data = await profileService.getProfilesByGymId(gymId)
      return data
    } catch (err) {
      console.error(err)
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  // // Get member details by profile ID
  // const { data: memberDetails, isLoading: loadingMemberDetails, error: errorMemberDetails } = useQuery({
  //   queryKey: ['profile', profileId],
  //   queryFn: () => profileService.getProfileById(profileId ?? ''),
  // });

  async function getProfileById(profileId: string) {
    if(!profileId) return console.error('profileId is required')
    try {
      setLoading(true)
      const data = await profileService.getProfileById(profileId);
      console.log('dataaaaa ', data)
      return data
    } catch (err) {
      console.error(err)
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    getProfilesPerGym,
    getProfileById,
    loadingMemberDetails,
    errorMemberDetails,
  }
}