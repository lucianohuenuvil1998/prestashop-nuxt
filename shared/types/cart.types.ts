export interface Cart {
  id: string
  items: CartItem[]
  totals: CartTotals
  itemCount: number
}

export interface CartItem {
  id: number
  productId: number
  variantId: number | null
  name: string
  slug: string
  image: string | null
  quantity: number
  unitPrice: number
  totalPrice: number
  sku: string
}

export interface CartTotals {
  subtotal: number
  shipping: number
  tax: number
  discount: number
  total: number
  currency: string
}
