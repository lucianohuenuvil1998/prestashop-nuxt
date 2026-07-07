/**
 * Implementación en memoria de ICartRepository.
 *
 * Almacena los carritos en un Map módulo-nivel que persiste
 * durante la vida del proceso del servidor (se reinicia al hacer restart).
 *
 * Al integrar PrestaShop, se reemplazará por PrestashopCartRepository
 * cambiando únicamente server/repositories/index.ts.
 */

import type { ICartRepository } from '../../types/cart.repository'
import type { Cart, CartItem, CartTotals } from '~~/shared/types/cart.types'
import type { AddToCartPayload } from '~~/shared/types/api.types'
import { MOCK_PRODUCTS } from './products.data'

// ─── Almacenamiento en memoria ────────────────────────────────────────────────
const CART_STORE = new Map<string, Cart>()

// ─── Helpers privados ─────────────────────────────────────────────────────────
function round(value: number): number {
  return Math.round(value * 100) / 100
}

function computeTotals(items: CartItem[]): CartTotals {
  const subtotal = round(items.reduce((sum, i) => sum + i.totalPrice, 0))
  return {
    subtotal,
    shipping: 0,    // Se calcula en el checkout
    tax: 0,         // Los precios incluyen IVA (configuración PS8 por defecto)
    discount: 0,
    total: subtotal,
    currency: 'USD',
  }
}

function countItems(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.quantity, 0)
}

function cloneCart(cart: Cart): Cart {
  return JSON.parse(JSON.stringify(cart)) as Cart
}

// ─── Repositorio ──────────────────────────────────────────────────────────────
export class MockCartRepository implements ICartRepository {
  async findById(cartId: string): Promise<Cart | null> {
    const cart = CART_STORE.get(cartId)
    return cart ? cloneCart(cart) : null
  }

  async create(): Promise<Cart> {
    const id = crypto.randomUUID()
    const cart: Cart = {
      id,
      items: [],
      totals: computeTotals([]),
      itemCount: 0,
    }
    CART_STORE.set(id, cart)
    return cloneCart(cart)
  }

  async addItem(cartId: string, payload: AddToCartPayload): Promise<Cart> {
    const cart = CART_STORE.get(cartId)
    if (!cart) throw new Error('Carrito no encontrado')

    const product = MOCK_PRODUCTS.find((p) => p.id === payload.productId)
    if (!product) throw new Error(`Producto ${payload.productId} no encontrado`)

    const variant = payload.variantId
      ? (product.variants.find((v) => v.id === payload.variantId) ?? null)
      : null

    const unitPrice = variant?.price ?? product.price

    // Si el item ya existe, incrementa la cantidad
    const existingIdx = cart.items.findIndex(
      (i) =>
        i.productId === payload.productId &&
        i.variantId === (payload.variantId ?? null),
    )

    if (existingIdx >= 0) {
      const item = cart.items[existingIdx]!
      item.quantity += payload.quantity
      item.totalPrice = round(item.unitPrice * item.quantity)
    }
    else {
      cart.items.push({
        id: payload.productId,         // En PS8 sería el id_cart_product
        productId: product.id,
        variantId: payload.variantId ?? null,
        name: product.name,
        slug: product.slug,
        image: product.images[0]?.url ?? null,
        quantity: payload.quantity,
        unitPrice,
        totalPrice: round(unitPrice * payload.quantity),
        sku: variant?.sku ?? product.sku,
      })
    }

    cart.totals = computeTotals(cart.items)
    cart.itemCount = countItems(cart.items)
    CART_STORE.set(cartId, cart)
    return cloneCart(cart)
  }

  async removeItem(cartId: string, itemId: number): Promise<Cart> {
    const cart = CART_STORE.get(cartId)
    if (!cart) throw new Error('Carrito no encontrado')

    cart.items = cart.items.filter((i) => i.id !== itemId)
    cart.totals = computeTotals(cart.items)
    cart.itemCount = countItems(cart.items)
    CART_STORE.set(cartId, cart)
    return cloneCart(cart)
  }

  async updateItemQuantity(cartId: string, itemId: number, quantity: number): Promise<Cart> {
    const cart = CART_STORE.get(cartId)
    if (!cart) throw new Error('Carrito no encontrado')

    if (quantity <= 0) {
      return this.removeItem(cartId, itemId)
    }

    const item = cart.items.find((i) => i.id === itemId)
    if (!item) throw new Error('Item no encontrado en el carrito')

    item.quantity = quantity
    item.totalPrice = round(item.unitPrice * quantity)
    cart.totals = computeTotals(cart.items)
    cart.itemCount = countItems(cart.items)
    CART_STORE.set(cartId, cart)
    return cloneCart(cart)
  }
}
