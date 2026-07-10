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
import { validateRegisterPayload } from '~~/shared/validation/form.validation'

export default defineEventHandler(async (event) => {
  const body = await readBody<RegisterPayload>(event)

  const validationError = validateRegisterPayload(body ?? {} as RegisterPayload)
  if (validationError || !body) {
    throw createError({ statusCode: 400, statusMessage: validationError ?? 'Faltan campos obligatorios' })
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
