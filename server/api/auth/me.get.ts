import { defineEventHandler, createError } from 'h3'
import { AuthService } from '../../services/auth.service'
import { getAuthToken } from '../../utils/session'

export default defineEventHandler(async (event) => {
  const token = getAuthToken(event)

  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  return AuthService.getCurrentCustomer(token)
})
