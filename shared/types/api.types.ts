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

export interface PlaceOrderPayload {
  cartId: string
  shippingAddressId: number
  billingAddressId: number
  shippingMethodId: number
  paymentMethodId: string
}
