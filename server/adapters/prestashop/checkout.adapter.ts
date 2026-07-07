import type { Order } from '~~/shared/types/order.types'
import type { PlaceOrderPayload } from '~~/shared/types/api.types'
import { PrestashopClient } from './prestashop.client'
import { toOrder } from './mappers/order.mapper'
import type { PSOrderResponse } from './prestashop.types'

export interface CheckoutSummary {
  cartId: string
  shippingMethods: ShippingMethod[]
  paymentMethods: PaymentMethod[]
}

export interface ShippingMethod {
  id: number
  name: string
  price: number
  currency: string
  delay: string
}

export interface PaymentMethod {
  id: string
  name: string
  description: string
}

export const CheckoutAdapter = {
  async fetchSummary(cartId: string): Promise<CheckoutSummary> {
    return PrestashopClient.get<CheckoutSummary>(`/checkout/${cartId}/summary`)
  },

  async placeOrder(payload: PlaceOrderPayload): Promise<Order> {
    const raw = await PrestashopClient.post<PSOrderResponse>('/orders', {
      id_cart: payload.cartId,
      id_address_delivery: payload.shippingAddressId,
      id_address_invoice: payload.billingAddressId,
      id_carrier: payload.shippingMethodId,
      payment_module: payload.paymentMethodId,
    })
    return toOrder(raw)
  },
}
