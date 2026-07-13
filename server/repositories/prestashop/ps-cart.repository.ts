/**
 * Implementación de ICartRepository para PrestaShop 8.
 *
 * El carrito en PS es un recurso `/api/carts` con cart_rows asociadas.
 * Modificar ítems requiere PUT sobre el recurso completo (PS WS no tiene PATCH).
 *
 * El `cartId` que maneja el frontend es el id numérico del cart de PS (como string).
 */

import type { ICartRepository } from '../../types/cart.repository'
import type { Cart } from '~~/shared/types/cart.types'
import type { AddToCartPayload } from '~~/shared/types/api.types'
import { psGet, psPost, psPut, buildPsXml } from '../../lib/prestashop/client'
import { transformCart, type CartTransformContext, psPrice, psLang } from '../../lib/prestashop/transformers'
import type {
  PsCartDetailResponse,
  PsCartCreateResponse,
  PsCart,
  PsCartRow,
  PsProductListResponse,
  PsProduct,
} from '../../lib/prestashop/types'
import { psImageUrl } from '../../lib/prestashop/client'

export class PsCartRepository implements ICartRepository {
  async findById(cartId: string): Promise<Cart | null> {
    try {
      const res = await psGet<PsCartDetailResponse>(`carts/${cartId}`)
      const psCart = res.cart
      const ctx = await this.buildCartContext(psCart)
      return transformCart(psCart, ctx)
    }
    catch {
      return null
    }
  }

  async create(): Promise<Cart> {
    const xml = buildPsXml('cart', { id_currency: 1, id_lang: 1 })
    const res = await psPost<PsCartCreateResponse>('carts', xml)
    const psCart = res.cart
    const ctx = await this.buildCartContext(psCart)
    return transformCart(psCart, ctx)
  }

  async addItem(cartId: string, payload: AddToCartPayload, _product?: import('../../types/cart.repository').CartProductSnapshot): Promise<Cart> {
    const res = await psGet<PsCartDetailResponse>(`carts/${cartId}`)
    const psCart = res.cart
    const rows: PsCartRow[] = psCart.associations?.cart_rows ?? []

    const existingIdx = rows.findIndex(
      r => String(r.id_product) === String(payload.productId)
        && String(r.id_product_attribute) === String(payload.variantId ?? 0),
    )

    if (existingIdx >= 0) {
      const existing = rows[existingIdx]!
      rows[existingIdx] = {
        ...existing,
        quantity: String(Number(existing.quantity) + payload.quantity),
      }
    }
    else {
      rows.push({
        id_product: String(payload.productId),
        id_product_attribute: String(payload.variantId ?? 0),
        id_address_delivery: psCart.id_address_delivery || '0',
        quantity: String(payload.quantity),
      })
    }

    return this.putCart(cartId, psCart, rows)
  }

  async removeItem(cartId: string, itemId: number): Promise<Cart> {
    const res = await psGet<PsCartDetailResponse>(`carts/${cartId}`)
    const psCart = res.cart
    const rows = (psCart.associations?.cart_rows ?? []).filter(
      (_, idx) => idx + 1 !== itemId,
    )
    return this.putCart(cartId, psCart, rows)
  }

  async updateItemQuantity(cartId: string, itemId: number, quantity: number): Promise<Cart> {
    if (quantity <= 0) return this.removeItem(cartId, itemId)

    const res = await psGet<PsCartDetailResponse>(`carts/${cartId}`)
    const psCart = res.cart
    const rows = psCart.associations?.cart_rows ?? []
    const idx = itemId - 1

    if (rows[idx]) {
      rows[idx] = { ...rows[idx]!, quantity: String(quantity) }
    }

    return this.putCart(cartId, psCart, rows)
  }

  // ─── Helpers privados ──────────────────────────────────────────────────────

  private async putCart(
    cartId: string,
    psCart: PsCart,
    rows: PsCartRow[],
  ): Promise<Cart> {
    // Solo incluimos los campos que PS necesita para un PUT de carrito.
    // Campos como delivery_option (PHP serialized) o date_add/date_upd causan 500.
    const xml = buildPsXml('cart', {
      id: psCart.id,
      id_address_delivery: psCart.id_address_delivery || '0',
      id_address_invoice: psCart.id_address_invoice || '0',
      id_currency: psCart.id_currency || '1',
      id_customer: psCart.id_customer || '0',
      id_guest: psCart.id_guest || '0',
      id_lang: psCart.id_lang || '1',
      id_shop_group: psCart.id_shop_group || '1',
      id_shop: psCart.id_shop || '1',
      id_carrier: psCart.id_carrier || '0',
      recyclable: psCart.recyclable || '0',
      gift: psCart.gift || '0',
      gift_message: psCart.gift_message || '',
      mobile_theme: psCart.mobile_theme || '0',
      delivery_option: psCart.delivery_option || '',
      secure_key: psCart.secure_key || '',
      allow_seperated_package: psCart.allow_seperated_package || '0',
      associations: {
        cart_rows: rows.map(r => ({
          id_product: r.id_product,
          id_product_attribute: r.id_product_attribute,
          id_address_delivery: r.id_address_delivery || '0',
          quantity: r.quantity,
        })),
      },
    })

    const updated = await psPut<PsCartDetailResponse>(`carts/${cartId}`, xml)
    const ctx = await this.buildCartContext(updated.cart)
    return transformCart(updated.cart, ctx)
  }

  private async buildCartContext(psCart: PsCart): Promise<CartTransformContext> {
    const rows = psCart.associations?.cart_rows ?? []
    const productIds = [...new Set(rows.map(r => Number(r.id_product)))]

    if (productIds.length === 0) {
      return { productMap: new Map() }
    }

    const res = await psGet<PsProductListResponse>('products', {
      params: {
        display: 'full',
        'filter[id]': `[${productIds.join('|')}]`,
      },
    })

    const productMap = new Map<number, {
      name: string
      slug: string
      imageUrl: string | null
      price: number
      sku: string
    }>()

    for (const p of (res.products ?? []) as PsProduct[]) {
      const firstImageId = p.associations?.images?.[0]?.id
      productMap.set(p.id, {
        name: psLang(p.name),
        slug: psLang(p.link_rewrite, String(p.id)),
        imageUrl: firstImageId ? psImageUrl(p.id, Number(firstImageId)) : null,
        price: psPrice(p.price),
        sku: p.reference || String(p.id),
      })
    }

    return { productMap }
  }
}
