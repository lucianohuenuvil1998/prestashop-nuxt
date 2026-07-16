import { defineEventHandler, createError } from 'h3'
import { getAuthToken } from '../../utils/session'
import { verifyJwt } from '../../lib/headlessapi/jwt'
import { AuthService } from '../../services/auth.service'

const useHeadlessApi = process.env.USE_PRESTASHOP === 'true'

export default defineEventHandler(async (event) => {
  const token = getAuthToken(event)

  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'No autenticado' })
  }

  if (useHeadlessApi) {
    try {
      const payload = verifyJwt(token)
      return {
        id: payload.sub,
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
      }
    }
    catch (e) {
      const msg = e instanceof Error ? e.message : 'Sesión inválida'
      throw createError({ statusCode: 401, statusMessage: msg })
    }
  }

  return AuthService.getCurrentCustomer(token)
})
