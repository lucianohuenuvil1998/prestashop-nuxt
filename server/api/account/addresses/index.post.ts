/**
 * POST /api/account/addresses
 */

import { defineEventHandler, readBody } from 'h3'
import { CustomerService } from '../../../services/customer.service'
import { getAuthTokenOrThrow } from '../../../utils/auth'
import type { AddressInput } from '~~/shared/types/customer.types'

export default defineEventHandler(async (event) => {
  const token = getAuthTokenOrThrow(event)
  const body = await readBody<AddressInput>(event)
  return CustomerService.createAddress(token, body)
})
