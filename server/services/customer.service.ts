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

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateAddressInput(input: AddressInput): void {
  if (!input.alias?.trim() || !input.firstName?.trim() || !input.lastName?.trim()
    || !input.address1?.trim() || !input.city?.trim() || !input.postcode?.trim() || !input.country?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Faltan campos obligatorios' })
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
    if (!payload.firstName?.trim() || !payload.lastName?.trim() || !payload.email?.trim()) {
      throw createError({ statusCode: 400, statusMessage: 'Faltan campos obligatorios' })
    }

    if (!EMAIL_REGEX.test(payload.email.trim())) {
      throw createError({ statusCode: 400, statusMessage: 'El email no es válido' })
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
    if (!payload.currentPassword || !payload.newPassword) {
      throw createError({ statusCode: 400, statusMessage: 'Faltan campos de contraseña' })
    }

    if (payload.newPassword.length < 8) {
      throw createError({ statusCode: 400, statusMessage: 'La nueva contraseña debe tener al menos 8 caracteres' })
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
    validateAddressInput(payload)
    try {
      return mockAuthStore.addAddress(token, payload)
    }
    catch (err) {
      handleAddressError(err, 'Error al crear la dirección')
    }
  },

  async updateAddress(token: string, addressId: number, payload: AddressInput): Promise<Address> {
    validateAddressInput(payload)
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
