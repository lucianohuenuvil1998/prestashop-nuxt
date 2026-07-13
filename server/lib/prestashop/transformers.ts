/**
 * Funciones puras que convierten la estructura cruda del WebService de PS
 * a los tipos del dominio del proyecto.
 *
 * Toda la "traducción" entre PS y el resto del sistema vive aquí.
 * Si PS cambia un campo, solo se toca este archivo.
 */

import type {
  PsProduct,
  PsField,
  PsCategory,
  PsCombination,
  PsStockAvailable,
  PsProductOptionValue,
  PsProductOption,
  PsCart,
  PsCartRow,
  PsAddress,
  PsCountry,
  PsState,
  PsCustomer,
} from './types'
import type { Product, ProductVariant, ProductCategory, StockInfo } from '~~/shared/types/product.types'
import type { Category } from '~~/shared/types/category.types'
import type { Cart, CartItem, CartTotals } from '~~/shared/types/cart.types'
import type { Address } from '~~/shared/types/order.types'
import type { CustomerProfile } from '~~/shared/types/customer.types'
import { psImageUrl } from './client'
import { useRuntimeConfig } from '#imports'

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Extrae el valor de un campo de PS que puede ser:
 * - string plano (instalación un solo idioma)
 * - array multilang [{ id: "1", value: "Texto" }]
 */
export function psLang(field: PsField | undefined, fallback = ''): string {
  if (!field) return fallback
  if (typeof field === 'string') return field || fallback
  if (Array.isArray(field)) {
    const first = field[0]
    if (!first) return fallback
    return typeof first === 'string' ? first : (first.value || fallback)
  }
  return fallback
}

/** Convierte el string '0'/'1' de PS a boolean. */
export function psBool(value: string | undefined): boolean {
  return value === '1'
}

/** Convierte un precio string de PS (ej. "19.990000") a número. */
export function psPrice(value: string | undefined): number {
  return value ? Math.round(parseFloat(value) * 100) / 100 : 0
}

/** Elimina etiquetas HTML de un string. Útil para descripciones cortas usadas como texto plano. */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
}

// ─── Product ──────────────────────────────────────────────────────────────────

export interface ProductTransformContext {
  categories: PsCategory[]
  combinations: PsCombination[]
  stocks: PsStockAvailable[]
  /** Mapa id_combination → { groupName, valueName } */
  attributeMap: Map<number, { group: string; value: string }>
}

export function transformProduct(
  ps: PsProduct,
  ctx: ProductTransformContext,
): Product {
  const slug = psLang(ps.link_rewrite, String(ps.id))
  const name = psLang(ps.name)
  const imageIds = ps.associations?.images?.map(img => Number(img.id)) ?? []
  const categoryIds = new Set(ps.associations?.categories?.map(c => c.id) ?? [])
  const combinationIds = new Set(ps.associations?.combinations?.map(c => c.id) ?? [])

  // Categorías asociadas (excluye la raíz con id 1 y 2)
  const productCategories: ProductCategory[] = ctx.categories
    .filter(cat => categoryIds.has(String(cat.id)) && Number(cat.id) > 2)
    .map(cat => ({
      id: cat.id,
      name: psLang(cat.name),
      slug: psLang(cat.link_rewrite, String(cat.id)),
    }))

  // Stock del producto base usando el campo quantity raíz (id_product_attribute = 0)
  // o buscando en ctx.stocks si está disponible
  const baseStockFromCtx = ctx.stocks.find(
    s => String(s.id_product) === String(ps.id) && s.id_product_attribute === '0',
  )
  const baseQuantity = parseInt(baseStockFromCtx?.quantity ?? ps.quantity ?? '0', 10)
  const baseStockInfo: StockInfo = {
    quantity: baseQuantity,
    isInStock: baseQuantity > 0,
  }

  // Variantes (combinations)
  const variants: ProductVariant[] = ctx.combinations
    .filter(c => combinationIds.has(String(c.id)))
    .map(c => {
      // Buscar stock en ctx.stocks o en las stock_availables embebidas del producto
      const variantStock = ctx.stocks.find(
        s => String(s.id_product) === String(ps.id)
          && String(s.id_product_attribute) === String(c.id),
      )
      const qty = parseInt(variantStock?.quantity ?? '0', 10)
      const attrEntry = ctx.attributeMap.get(c.id)

      return {
        id: c.id,
        attributes: attrEntry
          ? { [attrEntry.group]: attrEntry.value }
          : { Variante: String(c.id) },
        price: psPrice(ps.price) + psPrice(c.price),
        sku: c.reference || ps.reference,
        stock: { quantity: qty, isInStock: qty > 0 },
      }
    })

  // Stock general: si hay variantes, está en stock si alguna lo está
  const stockInfo: StockInfo = variants.length > 0
    ? {
        quantity: variants.reduce((sum, v) => sum + v.stock.quantity, 0),
        isInStock: variants.some(v => v.stock.isInStock),
      }
    : baseStockInfo

  return {
    id: ps.id,
    slug,
    name,
    description: psLang(ps.description),
    shortDescription: psLang(ps.description_short),
    price: psPrice(ps.price),
    regularPrice: psPrice(ps.price),
    currency: 'ARS',
    images: imageIds.map((imgId, i) => ({
      id: imgId,
      url: psImageUrl(ps.id, imgId),
      alt: name,
      position: i,
    })),
    categories: productCategories,
    variants,
    stock: stockInfo,
    sku: ps.reference || String(ps.id),
    isAvailable: psBool(ps.available_for_order),
    createdAt: ps.date_add || new Date().toISOString(),
    updatedAt: ps.date_upd || new Date().toISOString(),
  }
}

// ─── Category ─────────────────────────────────────────────────────────────────

export function transformCategory(ps: PsCategory, withImage = false): Category {
  const { baseUrl, apiKey } = getCategoryImageConfig()
  return {
    id: ps.id,
    name: psLang(ps.name),
    slug: psLang(ps.link_rewrite, String(ps.id)),
    description: stripHtml(psLang(ps.description)),
    parentId: ps.id_parent ? Number(ps.id_parent) : null,
    image: withImage && baseUrl
      ? `${baseUrl}/api/images/categories/${ps.id}?ws_key=${apiKey}`
      : null,
    position: 0,
  }
}

function getCategoryImageConfig(): { baseUrl: string; apiKey: string } {
  try {
    const config = useRuntimeConfig()
    return {
      baseUrl: config.prestashop.baseUrl.replace(/\/$/, ''),
      apiKey: config.prestashop.apiKey,
    }
  }
  catch {
    return { baseUrl: '', apiKey: '' }
  }
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export interface CartTransformContext {
  /** Mapa productId → { name, slug, imageUrl, price, sku } */
  productMap: Map<number, { name: string; slug: string; imageUrl: string | null; price: number; sku: string }>
}

export function transformCart(ps: PsCart, ctx: CartTransformContext): Cart {
  const rows: PsCartRow[] = ps.associations?.cart_rows ?? []

  const items: CartItem[] = rows.map((row, idx) => {
    const productId = Number(row.id_product)
    const variantId = Number(row.id_product_attribute) || null
    const qty = Number(row.quantity)
    const product = ctx.productMap.get(productId)

    return {
      id: idx + 1,
      productId,
      variantId,
      name: product?.name ?? `Producto #${productId}`,
      slug: product?.slug ?? String(productId),
      image: product?.imageUrl ?? null,
      quantity: qty,
      unitPrice: product?.price ?? 0,
      totalPrice: (product?.price ?? 0) * qty,
      sku: product?.sku ?? '',
    }
  })

  const subtotal = items.reduce((acc, i) => acc + i.totalPrice, 0)
  const totals: CartTotals = {
    subtotal,
    shipping: 0,
    tax: 0,
    discount: 0,
    total: subtotal,
    currency: 'ARS',
  }

  return {
    id: String(ps.id),
    items,
    totals,
    itemCount: items.reduce((acc, i) => acc + i.quantity, 0),
  }
}

// ─── Address ──────────────────────────────────────────────────────────────────

export function transformAddress(
  ps: PsAddress,
  country?: PsCountry,
  state?: PsState,
): Address {
  return {
    id: ps.id,
    alias: ps.alias || 'Mi dirección',
    firstName: ps.firstname,
    lastName: ps.lastname,
    company: ps.company || null,
    address1: ps.address1,
    address2: ps.address2 || null,
    city: ps.city,
    state: state?.name || null,
    postcode: ps.postcode,
    country: country ? psLang(country.name) : String(ps.id_country),
    countryCode: country?.iso_code || '',
    phone: ps.phone || ps.phone_mobile || null,
  }
}

// ─── Customer ─────────────────────────────────────────────────────────────────

export function transformCustomer(ps: PsCustomer): CustomerProfile {
  const genderMap: Record<string, string> = { '1': 'M', '2': 'F' }
  return {
    id: ps.id,
    email: ps.email,
    firstName: ps.firstname,
    lastName: ps.lastname,
    civility: genderMap[ps.id_gender] ?? undefined,
    birthDate: ps.birthday && ps.birthday !== '0000-00-00' ? ps.birthday : null,
    newsletter: psBool(ps.newsletter),
    partnerOffers: psBool(ps.optin),
    addresses: [],
  }
}
