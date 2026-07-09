/**
 * GET /api/account/addresses
 */

import { defineEventHandler } from 'h3'
import { CustomerService } from '../../../services/customer.service'
import { getAuthTokenOrThrow } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  const token = getAuthTokenOrThrow(event)
  return CustomerService.getAddresses(token)
})
