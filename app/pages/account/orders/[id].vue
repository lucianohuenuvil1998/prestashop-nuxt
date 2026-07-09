<script setup lang="ts">
/**
 * Detalle de un pedido del cliente.
 */

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const orderId = computed(() => Number(route.params.id))

const {
  fetchOrder,
  formatOrderDate,
  formatOrderPrice,
} = useOrders()

const { data: order, pending, error } = fetchOrder(orderId)

useSeoMeta({
  title: computed(() => order.value ? `Pedido ${order.value.reference}` : 'Detalle del pedido'),
})
</script>

<template>
  <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

    <!-- Volver -->
    <NuxtLink
      to="/account/orders"
      class="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition-colors mb-6"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Volver al historial
    </NuxtLink>

    <!-- Loading -->
    <div v-if="pending" class="space-y-4">
      <div class="card p-6 animate-pulse">
        <div class="h-6 bg-gray-200 rounded w-1/3 mb-4" />
        <div class="h-4 bg-gray-100 rounded w-1/2" />
      </div>
    </div>

    <!-- Error / no encontrado -->
    <div v-else-if="error || !order" class="card p-12 text-center">
      <h2 class="text-lg font-semibold text-gray-800 mb-2">Pedido no encontrado</h2>
      <p class="text-sm text-gray-500 mb-6">El pedido que buscas no existe o no tienes permiso para verlo.</p>
      <NuxtLink to="/account/orders" class="btn-primary text-sm">Ver mis pedidos</NuxtLink>
    </div>

    <!-- Detalle -->
    <template v-else>
      <!-- Cabecera del pedido -->
      <div class="card p-6 mb-6">
        <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Pedido</p>
            <h1 class="text-2xl font-bold font-mono text-gray-900">{{ order.reference }}</h1>
            <p class="text-sm text-gray-500 mt-1">
              Realizado el {{ formatOrderDate(order.createdAt) }}
            </p>
          </div>
          <span
            class="self-start inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold"
            :class="ORDER_STATUS_CLASSES[order.status]"
          >
            {{ ORDER_STATUS_LABELS[order.status] }}
          </span>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <!-- Columna principal -->
        <div class="lg:col-span-2 space-y-6">

          <!-- Productos -->
          <section class="card overflow-hidden">
            <div class="px-5 py-4 border-b border-gray-100">
              <h2 class="font-semibold text-gray-800">Productos</h2>
            </div>
            <ul class="divide-y divide-gray-100">
              <li
                v-for="line in order.lines"
                :key="line.id"
                class="px-5 py-4 flex items-center justify-between gap-4"
              >
                <div class="min-w-0">
                  <p class="text-sm font-medium text-gray-900">{{ line.name }}</p>
                  <p class="text-xs text-gray-400 mt-0.5">SKU: {{ line.sku }}</p>
                  <p class="text-xs text-gray-500 mt-1">
                    {{ formatOrderPrice(line.unitPrice, order.totals.currency) }} × {{ line.quantity }}
                  </p>
                </div>
                <p class="text-sm font-semibold text-gray-900 flex-shrink-0">
                  {{ formatOrderPrice(line.totalPrice, order.totals.currency) }}
                </p>
              </li>
            </ul>
          </section>

          <!-- Dirección de envío -->
          <section class="card p-5">
            <h2 class="font-semibold text-gray-800 mb-3">Dirección de envío</h2>
            <address class="text-sm text-gray-600 not-italic leading-relaxed">
              {{ order.shippingAddress.firstName }} {{ order.shippingAddress.lastName }}<br>
              {{ order.shippingAddress.address1 }}<br>
              <span v-if="order.shippingAddress.address2">{{ order.shippingAddress.address2 }}<br></span>
              {{ order.shippingAddress.city }}, {{ order.shippingAddress.postcode }}<br>
              {{ order.shippingAddress.country }}
              <span v-if="order.shippingAddress.phone"><br>{{ order.shippingAddress.phone }}</span>
            </address>
          </section>

        </div>

        <!-- Sidebar resumen -->
        <aside class="space-y-6">

          <section class="card p-5">
            <h2 class="font-semibold text-gray-800 mb-4">Resumen</h2>
            <div class="space-y-2.5 text-sm">
              <div class="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{{ formatOrderPrice(order.totals.subtotal, order.totals.currency) }}</span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span>Envío</span>
                <span>{{ formatOrderPrice(order.totals.shipping, order.totals.currency) }}</span>
              </div>
              <div v-if="order.totals.discount > 0" class="flex justify-between text-green-600">
                <span>Descuento</span>
                <span>-{{ formatOrderPrice(order.totals.discount, order.totals.currency) }}</span>
              </div>
              <div class="border-t border-gray-200 pt-2.5 flex justify-between font-bold text-gray-900">
                <span>Total</span>
                <span class="text-lg">{{ formatOrderPrice(order.totals.total, order.totals.currency) }}</span>
              </div>
            </div>
          </section>

          <section class="card p-5 space-y-4">
            <div v-if="order.shippingMethodName">
              <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Envío</p>
              <p class="text-sm text-gray-800">{{ order.shippingMethodName }}</p>
            </div>
            <div v-if="order.paymentMethodId">
              <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Pago</p>
              <p class="text-sm text-gray-800">
                {{ PAYMENT_METHOD_LABELS[order.paymentMethodId] ?? order.paymentMethodId }}
              </p>
            </div>
          </section>

        </aside>

      </div>
    </template>

  </div>
</template>
