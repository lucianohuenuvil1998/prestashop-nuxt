/**
 * GET /api/account/profile
 *
 * Devuelve el perfil completo del cliente autenticado.
 */

import { defineEventHandler } from 'h3'
import { CustomerService } from '../../../services/customer.service'
import { getAuthTokenOrThrow } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  const token = getAuthTokenOrThrow(event)
  return CustomerService.getProfile(token)
})
