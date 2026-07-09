/**
 * PUT /api/account/profile
 *
 * Actualiza los datos personales del cliente autenticado.
 */

import { defineEventHandler, readBody } from 'h3'
import { CustomerService } from '../../../services/customer.service'
import { getAuthTokenOrThrow } from '../../../utils/auth'
import type { UpdateProfilePayload } from '~~/shared/types/customer.types'

export default defineEventHandler(async (event) => {
  const token = getAuthTokenOrThrow(event)
  const body = await readBody<UpdateProfilePayload>(event)
  return CustomerService.updateProfile(token, body)
})
