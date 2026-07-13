/**
 * Tipos que refleja la estructura JSON cruda que devuelve el WebService de PS 8.
 *
 * PS usa campos con nombres en snake_case con prefijo id_ y valores siempre como string.
 * Los campos multiidioma son arrays: [{ id: "1", value: "Texto" }]
 */

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Campo multiidioma de PS.
 * - Multi-idioma: array [{ id: "1", value: "Texto" }]
 * - Un solo idioma: string plano "Texto"
 */
export type PsLang = { id: string; value: string } | string

/** Un campo de PS que puede ser string plano o array multilang */
export type PsField = string | PsLang[]

// ─── Product ──────────────────────────────────────────────────────────────────

export interface PsProductListResponse {
  products: PsProductSummary[]
}

export interface PsProductDetailResponse {
  product: PsProduct
}

/** Producto en listado (display=full). */
export interface PsProductSummary {
  id: number
  id_category_default: string
  link_rewrite: PsField
  name: PsField
  price: string
  show_price: string
  available_for_order: string
  active: string
  product_type: string   // 'simple' | 'combinations' | 'pack' | 'virtual'
  quantity: string       // stock total del producto base
  associations: {
    categories?: { id: string }[]
    images?: { id: string }[]
    combinations?: { id: string }[]
    product_option_values?: { id: string }[]
    stock_availables?: { id: string; id_product_attribute: string }[]
  }
}

/** Producto completo. */
export interface PsProduct extends PsProductSummary {
  description: PsField
  description_short: PsField
  reference: string
  ean13: string
  upc: string
  weight: string
  width: string
  height: string
  depth: string
  minimal_quantity: string
  id_tax_rules_group: string
  date_add: string
  date_upd: string
}

// ─── Category ─────────────────────────────────────────────────────────────────

export interface PsCategoryListResponse {
  categories: PsCategory[]
}

export interface PsCategoryDetailResponse {
  category: PsCategory
}

export interface PsCategory {
  id: number
  id_parent: string
  active: string
  name: PsField
  description: PsField
  link_rewrite: PsField
  associations?: {
    products?: { id: string }[]
  }
}

// ─── Combination (variante) ────────────────────────────────────────────────────

export interface PsCombinationListResponse {
  combinations: PsCombination[]
}

export interface PsCombinationDetailResponse {
  combination: PsCombination
}

export interface PsCombination {
  id: number
  id_product: string
  reference: string
  ean13: string
  price: string          // precio diferencial (suma al base)
  minimal_quantity: string
  associations: {
    product_option_values?: { id: string }[]
    images?: { id: string }[]
  }
}

// ─── Stock ────────────────────────────────────────────────────────────────────

export interface PsStockAvailableListResponse {
  stock_availables: PsStockAvailable[]
}

export interface PsStockAvailableDetailResponse {
  stock_available: PsStockAvailable
}

export interface PsStockAvailable {
  id: number
  id_product: string
  id_product_attribute: string   // 0 = producto base, >0 = combinación
  quantity: string
  out_of_stock: string           // 0=deny, 1=allow, 2=use global
}

// ─── Product Option Value (atributo de variante) ──────────────────────────────

export interface PsProductOptionValueDetailResponse {
  product_option_value: PsProductOptionValue
}

export interface PsProductOptionValue {
  id: number
  id_attribute_group: string
  name: PsField
}

export interface PsProductOptionDetailResponse {
  product_option: PsProductOption
}

export interface PsProductOption {
  id: number
  name: PsField
  public_name: PsField
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export interface PsCartDetailResponse {
  cart: PsCart
}

export interface PsCartCreateResponse {
  cart: PsCart
}

export interface PsCart {
  id: number
  id_customer: string
  id_guest: string
  id_currency: string
  id_lang: string
  id_carrier: string
  id_shop: string
  id_shop_group: string
  id_address_delivery: string
  id_address_invoice: string
  secure_key: string
  recyclable: string
  gift: string
  gift_message: string
  mobile_theme: string
  delivery_option: string
  allow_seperated_package: string
  date_add: string
  date_upd: string
  associations: {
    cart_rows?: PsCartRow[]
  }
}

export interface PsCartRow {
  id_product: string
  id_product_attribute: string   // 0 = sin variante
  id_address_delivery: string
  quantity: string
}

// ─── Order ────────────────────────────────────────────────────────────────────

export interface PsOrderDetailResponse {
  order: PsOrder
}

export interface PsOrder {
  id: number
  id_customer: string
  id_cart: string
  id_currency: string
  id_carrier: string
  id_address_delivery: string
  id_address_invoice: string
  current_state: string
  reference: string
  total_paid: string
  total_paid_tax_incl: string
  total_products_wt: string
  total_shipping: string
  date_add: string
  secure_key: string
  associations: {
    order_rows?: PsOrderRow[]
  }
}

export interface PsOrderRow {
  id: string
  product_id: string
  product_attribute_id: string
  product_name: string
  product_quantity: string
  unit_price_tax_incl: string
  unit_price_tax_excl: string
}

// ─── Customer ─────────────────────────────────────────────────────────────────

export interface PsCustomerDetailResponse {
  customer: PsCustomer
}

export interface PsCustomer {
  id: number
  id_gender: string
  firstname: string
  lastname: string
  email: string
  birthday: string            // YYYY-MM-DD o '0000-00-00'
  newsletter: string          // '0' | '1'
  optin: string               // '0' | '1' (partner offers)
  passwd: string              // hash MD5
  secure_key: string
  active: string
  is_guest: string
  date_add: string
  date_upd: string
  associations?: {
    addresses?: { id: string }[]
    orders?: { id: string }[]
  }
}

// ─── Address ──────────────────────────────────────────────────────────────────

export interface PsAddressDetailResponse {
  address: PsAddress
}

export interface PsAddress {
  id: number
  id_customer: string
  id_country: string
  id_state: string
  alias: string
  company: string
  lastname: string
  firstname: string
  address1: string
  address2: string
  postcode: string
  city: string
  phone: string
  phone_mobile: string
  active: string
  deleted: string
}

// ─── Country ──────────────────────────────────────────────────────────────────

export interface PsCountryDetailResponse {
  country: PsCountry
}

export interface PsCountry {
  id: number
  id_zone: string
  iso_code: string
  name: PsField
  active: string
}

// ─── State (provincia) ────────────────────────────────────────────────────────

export interface PsStateDetailResponse {
  state: PsState
}

export interface PsState {
  id: number
  id_country: string
  iso_code: string
  name: string
  active: string
}
