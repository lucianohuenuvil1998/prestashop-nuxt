/**
 * PUT /api/account/profile/password
 *
 * Actualiza la contraseña del cliente autenticado.
 */

import { defineEventHandler, readBody } from 'h3'
import { CustomerService } from '../../../services/customer.service'
import { getAuthTokenOrThrow } from '../../../utils/auth'
import type { UpdatePasswordPayload } from '~~/shared/types/customer.types'

export default defineEventHandler(async (event) => {
  const token = getAuthTokenOrThrow(event)
  const body = await readBody<UpdatePasswordPayload>(event)
  await CustomerService.updatePassword(token, body)
  return { success: true }
})
