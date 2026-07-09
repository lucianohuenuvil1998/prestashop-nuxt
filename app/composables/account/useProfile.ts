/**
 * useProfile — gestiona los datos personales del cliente (PS8).
 */

import type { CustomerProfile, UpdateProfilePayload, UpdatePasswordPayload } from '~~/shared/types/customer.types'
import { useAuthStore } from '../../stores/auth.store'

export function useProfile() {
  const authStore = useAuthStore()

  function fetchProfile() {
    return useAsyncData<CustomerProfile>('account-profile', () =>
      $fetch('/api/account/profile'),
    )
  }

  async function updateProfile(payload: UpdateProfilePayload): Promise<CustomerProfile> {
    const profile = await $fetch<CustomerProfile>('/api/account/profile', {
      method: 'PUT',
      body: payload,
    })

    authStore.setSession({
      id: profile.id,
      email: profile.email,
      firstName: profile.firstName,
      lastName: profile.lastName,
    })

    return profile
  }

  async function updatePassword(payload: UpdatePasswordPayload): Promise<void> {
    await $fetch('/api/account/profile/password', {
      method: 'PUT',
      body: payload,
    })
  }

  return {
    fetchProfile,
    updateProfile,
    updatePassword,
  }
}
