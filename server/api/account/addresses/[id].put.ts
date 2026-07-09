/**
 * PUT /api/account/addresses/:id
 */

import { defineEventHandler, readBody, getRouterParam, createError } from 'h3'
import { CustomerService } from '../../../services/customer.service'
import { getAuthTokenOrThrow } from '../../../utils/auth'
import type { AddressInput } from '~~/shared/types/customer.types'

export default defineEventHandler(async (event) => {
  const token = getAuthTokenOrThrow(event)
  const idParam = getRouterParam(event, 'id')
  const addressId = Number(idParam)

  if (!idParam || Number.isNaN(addressId)) {
    throw createError({ statusCode: 400, statusMessage: 'ID de dirección inválido' })
  }

  const body = await readBody<AddressInput>(event)
  return CustomerService.updateAddress(token, addressId, body)
})
