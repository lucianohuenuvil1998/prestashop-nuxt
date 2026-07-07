/**
 * GET /api/checkout/summary
 *
 * Devuelve los métodos de envío y pago disponibles.
 * En Phase 2 (mock) no requiere carrito activo.
 * En PS8 real, el cartId se puede usar para filtrar carriers por zona.
 */

import { defineEventHandler } from 'h3'
import { CheckoutService } from '../../services/checkout.service'

export default defineEventHandler(async () => {
  return CheckoutService.getSummary()
})
