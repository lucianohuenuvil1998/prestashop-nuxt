/**
 * Utilidad para resolver el cliente autenticado desde la cookie de sesión.
 *
 * Cuando USE_PRESTASHOP=true: verifica el JWT firmado por el módulo headlessapi.
 * En modo mock: consulta el mockAuthStore.
 */

import { createError } from 'h3'
import type { H3Event } from 'h3'
import { getAuthToken } from './session'
import { verifyJwt, tryVerifyJwt } from '../lib/headlessapi/jwt'
import { mockAuthStore } from '../repositories/mock/mock-auth.store'
import type { Customer } from '~~/shared/types/customer.types'

const useHeadlessApi = process.env.USE_PRESTASHOP === 'true'

function jwtPayloadToCustomer(payload: { sub: number; email: string; firstName: string; lastName: string }): Customer {
  return {
    id: payload.sub,
    email: payload.email,
    firstName: payload.firstName,
    lastName: payload.lastName,
    addresses: [],
  }
}

export function getAuthenticatedCustomer(event: H3Event): Customer {
  const token = getAuthToken(event)

  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'No autenticado' })
  }

  if (useHeadlessApi) {
    try {
      return jwtPayloadToCustomer(verifyJwt(token))
    }
    catch (e) {
      const msg = e instanceof Error ? e.message : 'Sesión inválida'
      throw createError({ statusCode: 401, statusMessage: msg })
    }
  }

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

export function getOptionalCustomer(event: H3Event): Customer | null {
  const token = getAuthToken(event)
  if (!token) return null

  if (useHeadlessApi) {
    const payload = tryVerifyJwt(token)
    return payload ? jwtPayloadToCustomer(payload) : null
  }

  return mockAuthStore.getByToken(token) ?? null
}
