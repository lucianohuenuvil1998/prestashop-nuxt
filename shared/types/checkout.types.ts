/**
 * Tipos de dominio para el flujo de checkout.
 *
 * Compartidos entre cliente y servidor.
 * Al conectar PrestaShop 8 real, los IDs y estructuras
 * mapearán directamente con los recursos de la API PS.
 */

export interface ShippingMethod {
  id: number
  name: string
  description: string
  price: number
  currency: string
  /** Ej.: "5-7 días hábiles" */
  delay: string
}

export interface PaymentMethod {
  id: string
  name: string
  description: string
}

export interface CheckoutSummary {
  shippingMethods: ShippingMethod[]
  paymentMethods: PaymentMethod[]
}

/** Dirección capturada en el formulario de checkout (cliente → servidor). */
export interface CheckoutAddressInput {
  firstName: string
  lastName: string
  company?: string
  address1: string
  address2?: string
  city: string
  state?: string
  postcode: string
  country: string
  phone?: string
}
