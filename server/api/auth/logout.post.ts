import { defineEventHandler } from 'h3'
import { getAuthToken, clearAuthToken } from '../../utils/session'
import { AuthService } from '../../services/auth.service'

const useHeadlessApi = process.env.USE_PRESTASHOP === 'true'

export default defineEventHandler(async (event) => {
  const token = getAuthToken(event)

  // En modo headless el JWT es stateless — solo borramos la cookie
  if (token && !useHeadlessApi) {
    await AuthService.logout(token)
  }

  clearAuthToken(event)
  return { success: true }
})
