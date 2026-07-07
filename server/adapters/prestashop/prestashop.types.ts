/**
 * Tipos crudos de la API del módulo headless de PrestaShop.
 * Solo deben usarse dentro de server/adapters/prestashop/.
 * Nunca exportar estos tipos hacia los servicios ni hacia el cliente.
 */

export interface PSPaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

export interface PSProductResponse {
  id: number
  link_rewrite: string
  name: string
  description: string
  description_short: string
  price: string
  price_without_reduction: string
  id_currency: number
  id_default_image: number
  images: PSImageResponse[]
  categories: PSCategoryLightResponse[]
  combinations: PSCombinationResponse[]
  quantity: number
  out_of_stock: number
  reference: string
  active: number
  date_add: string
  date_upd: string
}

export interface PSImageResponse {
  id_image: number
  src: string
  legend: string
  cover: number
  position: number
}

export interface PSCategoryLightResponse {
  id_category: number
  name: string
  link_rewrite: string
}

export interface PSCombinationResponse {
  id_product_attribute: number
  attributes: PSAttributeResponse[]
  price: string
  reference: string
  quantity: number
}

export interface PSAttributeResponse {
  id_attribute_group: number
  group_name: string
  id_attribute: number
  attribute_name: string
}

export interface PSCategoryResponse {
  id_category: number
  name: string
  link_rewrite: string
  description: string
  id_parent: number | null
  image: string | null
  position: number
  children?: PSCategoryResponse[]
}

export interface PSCartResponse {
  id_cart: number
  products: PSCartProductResponse[]
  totals: PSCartTotalsResponse
}

export interface PSCartProductResponse {
  id_product: number
  id_product_attribute: number | null
  id_customization: number
  cart_quantity: number
  name: string
  link_rewrite: string
  cover: string | null
  price_with_reduction: string
  total_wt: string
  reference: string
}

export interface PSCartTotalsResponse {
  subtotal_products: string
  subtotal_shipping: string
  subtotal_tax: string
  subtotal_discounts: string
  total_price: string
  currency: string
}

export interface PSOrderResponse {
  id_order: number
  reference: string
  current_state: number
  status_name: string
  id_customer: number
  firstname: string
  lastname: string
  email: string
  id_address_delivery: number
  id_address_invoice: number
  order_rows: PSOrderRowResponse[]
  total_products_wt: string
  total_shipping_tax_incl: string
  total_tax: string
  total_discounts: string
  total_paid: string
  currency: string
  date_add: string
}

export interface PSOrderRowResponse {
  id_order_detail: number
  id_product: number
  product_name: string
  product_reference: string
  product_quantity: number
  unit_price_tax_incl: string
  total_price_tax_incl: string
}

export interface PSCustomerResponse {
  id_customer: number
  email: string
  firstname: string
  lastname: string
}

export interface PSAuthResponse {
  token: string
  customer: PSCustomerResponse
}

export interface PSAddressResponse {
  id_address: number
  alias: string
  firstname: string
  lastname: string
  company: string
  address1: string
  address2: string
  city: string
  id_state: number
  state_name: string
  postcode: string
  country: string
  country_iso: string
  phone: string
}
