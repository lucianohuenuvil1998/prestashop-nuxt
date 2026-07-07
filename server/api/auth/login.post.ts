import { defineEventHandler, readBody, createError } from 'h3'
import { AuthService } from '../../services/auth.service'
import { setAuthToken } from '../../utils/session'
import type { LoginCredentials } from '~~/shared/types/customer.types'

export default defineEventHandler(async (event) => {
  const body = await readBody<LoginCredentials>(event)

  if (!body?.email || !body?.password) {
    throw createError({ statusCode: 400, statusMessage: 'Email and password are required' })
  }

  const session = await AuthService.login(body)
  setAuthToken(event, session.token)

  return {
    id: session.customerId,
    email: session.email,
    firstName: session.firstName,
    lastName: session.lastName,
  }
})
