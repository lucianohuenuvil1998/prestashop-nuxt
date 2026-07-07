import { defineEventHandler } from 'h3'
import { AuthService } from '../../services/auth.service'
import { getAuthToken, clearAuthToken } from '../../utils/session'

export default defineEventHandler(async (event) => {
  const token = getAuthToken(event)

  if (token) {
    await AuthService.logout(token)
  }

  clearAuthToken(event)

  return { success: true }
})
