/**
 * CustomerService — lógica de negocio del perfil del cliente.
 *
 * Cuando USE_PRESTASHOP=true: delega en el módulo headlessapi de PS.
 * En modo mock: usa mockAuthStore en memoria.
 */

import type { CustomerProfile, UpdateProfilePayload, UpdatePasswordPayload, AddressInput } from '~~/shared/types/customer.types'
import type { Address } from '~~/shared/types/order.types'
import { createError } from 'h3'
import { mockAuthStore } from '../repositories/mock/mock-auth.store'
import { haGet, haPost, haPut, haDelete } from '../lib/headlessapi/client'
import {
  validateAddressInput,
  validatePassword,
  validateProfilePayload,
} from '~~/shared/validation/form.validation'

const useHeadlessApi = process.env.USE_PRESTASHOP === 'true'

function validateAddressInputOrThrow(input: AddressInput): void {
  const error = validateAddressInput(input)
  if (error) throw createError({ statusCode: 400, statusMessage: error })
}

function handleError(err: unknown, fallback: string): never {
  const message = err instanceof Error ? err.message : fallback
  const statusCode = message.includes('no encontrada') || message.includes('not found') ? 404 : 400
  throw createError({ statusCode, statusMessage: message })
}

/** Adapta la dirección devuelta por el módulo PS al tipo Address de Nuxt. */
function mapAddress(raw: Record<string, unknown>): Address {
  return {
    id: raw.id as number,
    alias: (raw.alias as string) || '',
    firstName: raw.firstName as string,
    lastName: raw.lastName as string,
    company: (raw.company as string) || null,
    address1: raw.address1 as string,
    address2: (raw.address2 as string) || null,
    city: raw.city as string,
    state: (raw.state as string) || null,
    postcode: (raw.postcode as string) || '',
    country: raw.country as string,
    countryCode: (raw.countryCode as string) || '',
    phone: (raw.phone as string) || null,
  }
}

export const CustomerService = {
  async getProfile(token: string): Promise<CustomerProfile> {
    if (useHeadlessApi) {
      try {
        const raw = await haGet<Record<string, unknown>>('profile', 'get', token)
        return {
          id: raw.id as number,
          email: raw.email as string,
          firstName: raw.firstName as string,
          lastName: raw.lastName as string,
          civility: (raw.civility as string) || '',
          birthDate: (raw.birthDate as string) || null,
          newsletter: !!(raw.newsletter),
          partnerOffers: false,
          addresses: [],
        }
      }
      catch (err) {
        handleError(err, 'Error al obtener el perfil')
      }
    }

    const profile = mockAuthStore.getProfileByToken(token)
    if (!profile) throw createError({ statusCode: 401, statusMessage: 'Sesión inválida o expirada' })
    return profile
  },

  async updateProfile(token: string, payload: UpdateProfilePayload): Promise<CustomerProfile> {
    const validationError = validateProfilePayload(payload)
    if (validationError) throw createError({ statusCode: 400, statusMessage: validationError })

    if (useHeadlessApi) {
      try {
        const raw = await haPut<Record<string, unknown>>('profile', 'update', {
          civility: payload.civility,
          firstName: payload.firstName.trim(),
          lastName: payload.lastName.trim(),
          email: payload.email.trim().toLowerCase(),
          birthDate: payload.birthDate || null,
          newsletter: payload.newsletter ?? false,
        }, token)
        return {
          id: raw.id as number,
          email: raw.email as string,
          firstName: raw.firstName as string,
          lastName: raw.lastName as string,
          civility: (raw.civility as string) || '',
          birthDate: (raw.birthDate as string) || null,
          newsletter: !!(raw.newsletter),
          partnerOffers: false,
          addresses: [],
        }
      }
      catch (err) {
        const message = err instanceof Error ? err.message : 'Error al actualizar el perfil'
        throw createError({ statusCode: message.includes('email') ? 409 : 400, statusMessage: message })
      }
    }

    try {
      return mockAuthStore.updateProfile(token, {
        civility: payload.civility,
        firstName: payload.firstName.trim(),
        lastName: payload.lastName.trim(),
        email: payload.email.trim().toLowerCase(),
        birthDate: payload.birthDate,
        newsletter: payload.newsletter,
        partnerOffers: payload.partnerOffers,
      })
    }
    catch (err) {
      const message = err instanceof Error ? err.message : 'Error al actualizar el perfil'
      throw createError({ statusCode: message.includes('email') ? 409 : 400, statusMessage: message })
    }
  },

  async updatePassword(token: string, payload: UpdatePasswordPayload): Promise<void> {
    if (!payload.currentPassword) throw createError({ statusCode: 400, statusMessage: 'La contraseña actual es requerida' })
    const passwordError = validatePassword(payload.newPassword, 'La nueva contraseña')
    if (passwordError) throw createError({ statusCode: 400, statusMessage: passwordError })

    if (useHeadlessApi) {
      try {
        await haPost<unknown>('profile', 'updatePassword', {
          currentPassword: payload.currentPassword,
          newPassword: payload.newPassword,
        }, token, 'PUT')
        return
      }
      catch (err) {
        handleError(err, 'Error al actualizar la contraseña')
      }
    }

    try {
      mockAuthStore.updatePassword(token, payload)
    }
    catch (err) {
      const message = err instanceof Error ? err.message : 'Error al actualizar la contraseña'
      throw createError({ statusCode: 400, statusMessage: message })
    }
  },

  async getAddresses(token: string): Promise<Address[]> {
    if (useHeadlessApi) {
      try {
        const list = await haGet<Record<string, unknown>[]>('addresses', 'list', token)
        return list.map(mapAddress)
      }
      catch (err) {
        handleError(err, 'Error al obtener las direcciones')
      }
    }
    return mockAuthStore.getAddresses(token)
  },

  async createAddress(token: string, payload: AddressInput): Promise<Address> {
    validateAddressInputOrThrow(payload)

    if (useHeadlessApi) {
      try {
        const raw = await haPost<Record<string, unknown>>('addresses', 'create', payload, token)
        return mapAddress(raw)
      }
      catch (err) {
        handleError(err, 'Error al crear la dirección')
      }
    }

    try {
      return mockAuthStore.addAddress(token, payload)
    }
    catch (err) {
      handleError(err, 'Error al crear la dirección')
    }
  },

  async updateAddress(token: string, addressId: number, payload: AddressInput): Promise<Address> {
    validateAddressInputOrThrow(payload)

    if (useHeadlessApi) {
      try {
        const raw = await haPut<Record<string, unknown>>('addresses', 'update', payload, token, { id: addressId })
        return mapAddress(raw)
      }
      catch (err) {
        handleError(err, 'Error al actualizar la dirección')
      }
    }

    try {
      return mockAuthStore.updateAddress(token, addressId, payload)
    }
    catch (err) {
      handleError(err, 'Error al actualizar la dirección')
    }
  },

  async deleteAddress(token: string, addressId: number): Promise<void> {
    if (useHeadlessApi) {
      try {
        await haDelete<unknown>('addresses', 'delete', token, { id: addressId })

        return
      }
      catch (err) {
        handleError(err, 'Error al eliminar la dirección')
      }
    }

    try {
      mockAuthStore.deleteAddress(token, addressId)
    }
    catch (err) {
      handleError(err, 'Error al eliminar la dirección')
    }
  },
}
