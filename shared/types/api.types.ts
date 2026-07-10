export interface ApiResponse<T> {
  data: T
  meta?: PaginationMeta
}

export interface PaginationMeta {
  total: number
  page: number
  perPage: number
  totalPages: number
}

export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  perPage: number
  totalPages: number
}

export interface ApiError {
  statusCode: number
  message: string
  details?: unknown
}

export interface ProductFilters {
  categoryId?: number
  search?: string
  page?: number
  perPage?: number
  sort?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'newest'
  minPrice?: number
  maxPrice?: number
}

export interface AddToCartPayload {
  productId: number
  variantId?: number
  quantity: number
}

export interface UpdateCartItemPayload {
  quantity: number
}

export interface GuestAddressPayload {
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

export interface PlaceOrderPayload {
  cartId: string
  shippingMethodId: number
  paymentMethodId: string
  /** Para usuarios autenticados */
  shippingAddressId?: number
  billingAddressId?: number
  /** Para invitados */
  guestEmail?: string
  guestAddress?: GuestAddressPayload
}

export interface PlaceOrderCustomer {
  id: number
  firstName: string
  lastName: string
  email: string
}
