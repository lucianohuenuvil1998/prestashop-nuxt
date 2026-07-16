import { defineEventHandler, readBody, createError } from 'h3'
import { setAuthToken } from '../../utils/session'
import { haPost } from '../../lib/headlessapi/client'
import { mockAuthStore } from '../../repositories/mock/mock-auth.store'
import type { RegisterPayload } from '~~/shared/types/customer.types'
import { validateRegisterPayload } from '~~/shared/validation/form.validation'

const useHeadlessApi = process.env.USE_PRESTASHOP === 'true'

export default defineEventHandler(async (event) => {
  const body = await readBody<RegisterPayload>(event)

  const validationError = validateRegisterPayload(body ?? {} as RegisterPayload)
  if (validationError || !body) {
    throw createError({ statusCode: 400, statusMessage: validationError ?? 'Faltan campos obligatorios' })
  }

  if (useHeadlessApi) {
    try {
      const res = await haPost<{ token: string; customer: { id: number; firstName: string; lastName: string; email: string } }>(
        'auth', 'register', {
          firstName: body.firstName.trim(),
          lastName: body.lastName.trim(),
          email: body.email.toLowerCase().trim(),
          password: body.password,
          birthDate: body.birthDate || null,
          newsletter: body.newsletter ?? false,
        },
      )
      setAuthToken(event, res.token)
      return { id: res.customer.id, email: res.customer.email, firstName: res.customer.firstName, lastName: res.customer.lastName }
    }
    catch (e) {
      const msg = e instanceof Error ? e.message : 'Error al crear la cuenta'
      const status = msg.includes('Ya existe') ? 409 : 400
      throw createError({ statusCode: status, statusMessage: msg })
    }
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
  return { id: session.customerId, email: session.email, firstName: session.firstName, lastName: session.lastName }
})
