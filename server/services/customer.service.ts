/**
 * CustomerService — lógica de negocio del perfil del cliente.
 *
 * Phase 2: usa mockAuthStore en memoria.
 * Phase 3: delegar en CustomerAdapter → PrestaShop 8.
 */

import type { CustomerProfile, UpdateProfilePayload, UpdatePasswordPayload, AddressInput } from '~~/shared/types/customer.types'
import type { Address } from '~~/shared/types/order.types'
import { createError } from 'h3'
import { mockAuthStore } from '../repositories/mock/mock-auth.store'
import {
  validateAddressInput,
  validatePassword,
  validateProfilePayload,
} from '~~/shared/validation/form.validation'

function validateAddressInputOrThrow(input: AddressInput): void {
  const error = validateAddressInput(input)
  if (error) {
    throw createError({ statusCode: 400, statusMessage: error })
  }
}

function handleAddressError(err: unknown, fallback: string): never {
  const message = err instanceof Error ? err.message : fallback
  const statusCode = message.includes('no encontrada') ? 404 : 400
  throw createError({ statusCode, statusMessage: message })
}

export const CustomerService = {
  async getProfile(token: string): Promise<CustomerProfile> {
    const profile = mockAuthStore.getProfileByToken(token)

    if (!profile) {
      throw createError({ statusCode: 401, statusMessage: 'Sesión inválida o expirada' })
    }

    return profile
  },

  async updateProfile(token: string, payload: UpdateProfilePayload): Promise<CustomerProfile> {
    const validationError = validateProfilePayload(payload)
    if (validationError) {
      throw createError({ statusCode: 400, statusMessage: validationError })
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
      const statusCode = message.includes('email') ? 409 : 400
      throw createError({ statusCode, statusMessage: message })
    }
  },

  async updatePassword(token: string, payload: UpdatePasswordPayload): Promise<void> {
    if (!payload.currentPassword) {
      throw createError({ statusCode: 400, statusMessage: 'La contraseña actual es requerida' })
    }

    const passwordError = validatePassword(payload.newPassword, 'La nueva contraseña')
    if (passwordError) {
      throw createError({ statusCode: 400, statusMessage: passwordError })
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
    return mockAuthStore.getAddresses(token)
  },

  async createAddress(token: string, payload: AddressInput): Promise<Address> {
    validateAddressInputOrThrow(payload)
    try {
      return mockAuthStore.addAddress(token, payload)
    }
    catch (err) {
      handleAddressError(err, 'Error al crear la dirección')
    }
  },

  async updateAddress(token: string, addressId: number, payload: AddressInput): Promise<Address> {
    validateAddressInputOrThrow(payload)
    try {
      return mockAuthStore.updateAddress(token, addressId, payload)
    }
    catch (err) {
      handleAddressError(err, 'Error al actualizar la dirección')
    }
  },

  async deleteAddress(token: string, addressId: number): Promise<void> {
    try {
      mockAuthStore.deleteAddress(token, addressId)
    }
    catch (err) {
      handleAddressError(err, 'Error al eliminar la dirección')
    }
  },
}
