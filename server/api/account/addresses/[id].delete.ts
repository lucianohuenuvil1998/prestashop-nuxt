/**
 * DELETE /api/account/addresses/:id
 */

import { defineEventHandler, getRouterParam, createError } from 'h3'
import { CustomerService } from '../../../services/customer.service'
import { getAuthTokenOrThrow } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  const token = getAuthTokenOrThrow(event)
  const idParam = getRouterParam(event, 'id')
  const addressId = Number(idParam)

  if (!idParam || Number.isNaN(addressId)) {
    throw createError({ statusCode: 400, statusMessage: 'ID de dirección inválido' })
  }

  await CustomerService.deleteAddress(token, addressId)
  return { success: true }
})
