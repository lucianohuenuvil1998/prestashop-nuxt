export type OrderStatus =
  | 'pending'
  | 'awaiting_payment'
  | 'awaiting_shipment'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'

export interface Order {
  id: number
  reference: string
  status: OrderStatus
  customer: OrderCustomer
  shippingAddress: Address
  billingAddress: Address
  lines: OrderLine[]
  totals: OrderTotals
  createdAt: string
}

export interface OrderLine {
  id: number
  productId: number
  name: string
  sku: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface OrderTotals {
  subtotal: number
  shipping: number
  tax: number
  discount: number
  total: number
  currency: string
}

export interface OrderCustomer {
  id: number
  firstName: string
  lastName: string
  email: string
}

export interface Address {
  id: number
  alias: string
  firstName: string
  lastName: string
  company: string | null
  address1: string
  address2: string | null
  city: string
  state: string | null
  postcode: string
  country: string
  countryCode: string
  phone: string | null
}
