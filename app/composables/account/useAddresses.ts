/**
 * useAddresses — CRUD de direcciones del cliente (PS8).
 */

import type { Address } from '~~/shared/types/order.types'
import type { AddressInput } from '~~/shared/types/customer.types'
import { useUiStore } from '../../stores/ui.store'

export const COUNTRIES = [
  'Argentina',
  'Chile',
  'Uruguay',
  'Paraguay',
  'Bolivia',
  'Perú',
  'Colombia',
  'México',
  'España',
] as const

export function useAddresses() {
  const uiStore = useUiStore()

  function fetchAddresses() {
    return useAsyncData<Address[]>('account-addresses', () =>
      $fetch('/api/account/addresses'),
    )
  }

  function fetchAddress(id: MaybeRefOrGetter<number>) {
    return useAsyncData<Address | null>(
      () => `account-address-${toValue(id)}`,
      async () => {
        const addressId = toValue(id)
        const addresses = await $fetch<Address[]>('/api/account/addresses')
        return addresses.find((a) => a.id === addressId) ?? null
      },
      { watch: [() => toValue(id)] },
    )
  }

  async function createAddress(payload: AddressInput): Promise<Address> {
    const address = await $fetch<Address>('/api/account/addresses', { method: 'POST', body: payload })
    uiStore.addToast('Dirección guardada correctamente', 'success')
    return address
  }

  async function updateAddress(id: number, payload: AddressInput): Promise<Address> {
    const address = await $fetch<Address>(`/api/account/addresses/${id}`, { method: 'PUT', body: payload })
    uiStore.addToast('Dirección actualizada correctamente', 'success')
    return address
  }

  async function deleteAddress(id: number): Promise<void> {
    await $fetch(`/api/account/addresses/${id}`, { method: 'DELETE' })
    uiStore.addToast('Dirección eliminada', 'info')
  }

  return {
    fetchAddresses,
    fetchAddress,
    createAddress,
    updateAddress,
    deleteAddress,
    COUNTRIES,
  }
}
