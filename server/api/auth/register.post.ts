/**
 * POST /api/auth/register
 *
 * Crea una cuenta de cliente con datos mock en memoria.
 * AuthService.register() queda pendiente; esta ruta usa mockAuthStore directamente.
 */

import { defineEventHandler, readBody, createError } from 'h3'
import { mockAuthStore } from '../../repositories/mock/mock-auth.store'
import { setAuthToken } from '../../utils/session'
import type { RegisterPayload } from '~~/shared/types/customer.types'

export default defineEventHandler(async (event) => {
  const body = await readBody<RegisterPayload>(event)

  if (!body?.firstName?.trim() || !body?.lastName?.trim() || !body?.email?.trim() || !body?.password) {
    throw createError({ statusCode: 400, statusMessage: 'Faltan campos obligatorios' })
  }

  if (body.password.length < 8) {
    throw createError({ statusCode: 400, statusMessage: 'La contraseña debe tener al menos 8 caracteres' })
  }

  const email = body.email.toLowerCase().trim()

  if (mockAuthStore.emailExists(email)) {
    throw createError({ statusCode: 409, statusMessage: 'Ya existe una cuenta con este email' })
  }

  const session = mockAuthStore.register({
    civility: body.civility,
    firstName: body.firstName.trim(),
    lastName: body.lastName.trim(),
    email,
    password: body.password,
    birthDate: body.birthDate,
    newsletter: body.newsletter,
    partnerOffers: body.partnerOffers,
  })

  setAuthToken(event, session.token)

  return {
    id: session.customerId,
    email: session.email,
    firstName: session.firstName,
    lastName: session.lastName,
  }
})
