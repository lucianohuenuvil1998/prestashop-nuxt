/**
 * Utilidad para resolver el cliente autenticado desde la cookie de sesión.
 */

import { createError } from 'h3'
import type { H3Event } from 'h3'
import { getAuthToken } from './session'
import { mockAuthStore } from '../repositories/mock/mock-auth.store'
import type { Customer } from '~~/shared/types/customer.types'

export function getAuthenticatedCustomer(event: H3Event): Customer {
  const token = getAuthTokenOrThrow(event)
  const customer = mockAuthStore.getByToken(token)

  if (!customer) {
    throw createError({ statusCode: 401, statusMessage: 'Sesión inválida o expirada' })
  }

  return customer
}

export function getAuthTokenOrThrow(event: H3Event): string {
  const token = getAuthToken(event)

  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'No autenticado' })
  }

  return token
}

/** Devuelve el cliente autenticado si hay sesión, o null si es invitado. */
export function getOptionalCustomer(event: H3Event): Customer | null {
  const token = getAuthToken(event)
  if (!token) return null
  return mockAuthStore.getByToken(token) ?? null
}
