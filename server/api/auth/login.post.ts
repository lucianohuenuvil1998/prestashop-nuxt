import { defineEventHandler, readBody, createError } from 'h3'
import { setAuthToken } from '../../utils/session'
import { haPost } from '../../lib/headlessapi/client'
import { AuthService } from '../../services/auth.service'
import type { LoginCredentials } from '~~/shared/types/customer.types'

const useHeadlessApi = process.env.USE_PRESTASHOP === 'true'

export default defineEventHandler(async (event) => {
  const body = await readBody<LoginCredentials>(event)

  if (!body?.email || !body?.password) {
    throw createError({ statusCode: 400, statusMessage: 'Email y contraseña son requeridos' })
  }

  if (useHeadlessApi) {
    try {
      const res = await haPost<{ token: string; customer: { id: number; firstName: string; lastName: string; email: string } }>(
        'auth', 'login', { email: body.email, password: body.password },
      )
      setAuthToken(event, res.token)
      return { id: res.customer.id, email: res.customer.email, firstName: res.customer.firstName, lastName: res.customer.lastName }
    }
    catch (e) {
      const msg = e instanceof Error ? e.message : 'Email o contraseña incorrectos'
      throw createError({ statusCode: 401, statusMessage: msg })
    }
  }

  const session = await AuthService.login(body)
  setAuthToken(event, session.token)
  return { id: session.customerId, email: session.email, firstName: session.firstName, lastName: session.lastName }
})
