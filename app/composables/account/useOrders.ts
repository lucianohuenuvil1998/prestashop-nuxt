/**
 * useOrders — consulta el historial y detalle de pedidos del cliente.
 */

import type { Order, OrderStatus } from '~~/shared/types/order.types'

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pendiente',
  awaiting_payment: 'Pendiente de pago',
  awaiting_shipment: 'Preparando envío',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
  refunded: 'Reembolsado',
}

export const ORDER_STATUS_CLASSES: Record<OrderStatus, string> = {
  pending: 'bg-gray-100 text-gray-700',
  awaiting_payment: 'bg-yellow-100 text-yellow-800',
  awaiting_shipment: 'bg-blue-100 text-blue-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  refunded: 'bg-purple-100 text-purple-800',
}

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  bank_wire: 'Transferencia bancaria',
  check: 'Pago con cheque',
  cash_on_delivery: 'Contra entrega',
}

export function formatOrderDate(isoDate: string): string {
  return new Intl.DateTimeFormat('es', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(isoDate))
}

export function formatOrderPrice(value: number, currency: string): string {
  return new Intl.NumberFormat('es', { style: 'currency', currency }).format(value)
}

export function useOrders() {
  function fetchOrders() {
    return useAsyncData<Order[]>('account-orders', () => $fetch('/api/account/orders'))
  }

  function fetchOrder(orderId: MaybeRefOrGetter<number>) {
    return useAsyncData<Order>(
      () => `account-order-${toValue(orderId)}`,
      () => $fetch(`/api/account/orders/${toValue(orderId)}`),
      { watch: [() => toValue(orderId)] },
    )
  }

  return {
    fetchOrders,
    fetchOrder,
    formatOrderDate,
    formatOrderPrice,
  }
}
