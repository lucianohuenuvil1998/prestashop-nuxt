import type { Cart, CartItem, CartTotals } from '~~/shared/types/cart.types'
import type { PSCartResponse, PSCartProductResponse, PSCartTotalsResponse } from '../prestashop.types'

function toCartItem(raw: PSCartProductResponse): CartItem {
  return {
    id: raw.id_product,
    productId: raw.id_product,
    variantId: raw.id_product_attribute || null,
    name: raw.name,
    slug: raw.link_rewrite,
    image: raw.cover,
    quantity: raw.cart_quantity,
    unitPrice: parseFloat(raw.price_with_reduction),
    totalPrice: parseFloat(raw.total_wt),
    sku: raw.reference,
  }
}

function toCartTotals(raw: PSCartTotalsResponse): CartTotals {
  return {
    subtotal: parseFloat(raw.subtotal_products),
    shipping: parseFloat(raw.subtotal_shipping),
    tax: parseFloat(raw.subtotal_tax),
    discount: parseFloat(raw.subtotal_discounts),
    total: parseFloat(raw.total_price),
    currency: raw.currency,
  }
}

export function toCart(raw: PSCartResponse): Cart {
  const items = raw.products.map(toCartItem)

  return {
    id: String(raw.id_cart),
    items,
    totals: toCartTotals(raw.totals),
    itemCount: items.reduce((acc, item) => acc + item.quantity, 0),
  }
}
