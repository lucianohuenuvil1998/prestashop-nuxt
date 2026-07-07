import type { Order, OrderLine, OrderTotals, OrderCustomer } from '~~/shared/types/order.types'
import type { PSOrderResponse, PSOrderRowResponse } from '../prestashop.types'

function toOrderLine(raw: PSOrderRowResponse): OrderLine {
  return {
    id: raw.id_order_detail,
    productId: raw.id_product,
    name: raw.product_name,
    sku: raw.product_reference,
    quantity: raw.product_quantity,
    unitPrice: parseFloat(raw.unit_price_tax_incl),
    totalPrice: parseFloat(raw.total_price_tax_incl),
  }
}

function toOrderTotals(raw: PSOrderResponse): OrderTotals {
  return {
    subtotal: parseFloat(raw.total_products_wt),
    shipping: parseFloat(raw.total_shipping_tax_incl),
    tax: parseFloat(raw.total_tax),
    discount: parseFloat(raw.total_discounts),
    total: parseFloat(raw.total_paid),
    currency: raw.currency,
  }
}

function toOrderCustomer(raw: PSOrderResponse): OrderCustomer {
  return {
    id: raw.id_customer,
    firstName: raw.firstname,
    lastName: raw.lastname,
    email: raw.email,
  }
}

export function toOrder(raw: PSOrderResponse): Order {
  return {
    id: raw.id_order,
    reference: raw.reference,
    status: mapOrderStatus(raw.current_state),
    customer: toOrderCustomer(raw),
    // Las direcciones completas requieren una llamada adicional al adapter
    shippingAddress: { id: raw.id_address_delivery } as Order['shippingAddress'],
    billingAddress: { id: raw.id_address_invoice } as Order['billingAddress'],
    lines: raw.order_rows.map(toOrderLine),
    totals: toOrderTotals(raw),
    createdAt: raw.date_add,
  }
}

/**
 * Mapea el id de estado de PrestaShop a los valores del dominio.
 * Los IDs exactos dependen de la configuración del módulo PS.
 */
function mapOrderStatus(psStateId: number): Order['status'] {
  const statusMap: Record<number, Order['status']> = {
    1: 'awaiting_payment',
    2: 'awaiting_payment',
    3: 'awaiting_shipment',
    4: 'awaiting_shipment',
    5: 'shipped',
    6: 'delivered',
    7: 'cancelled',
    8: 'refunded',
  }
  return statusMap[psStateId] ?? 'pending'
}
