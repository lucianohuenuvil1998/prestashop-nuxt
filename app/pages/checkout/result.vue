<script setup lang="ts">
definePageMeta({ layout: 'default' })
useHead({ title: 'Resultado del pago — NuxtShop' })

const route = useRoute()

const status = computed(() => {
  const s = String(route.query.status ?? '')
  if (['success', 'error', 'cancel'].includes(s)) return s as 'success' | 'error' | 'cancel'
  return 'error'
})

const orderId = computed(() => {
  const id = Number(route.query.orderId)
  return Number.isNaN(id) ? null : id
})

type OrderSummary = { reference: string; totals: { total: number; currency: string }; paymentMethodId?: string }

const { data: orderSummary, status: fetchStatus } = await useAsyncData<OrderSummary | null>(
  'checkout-result',
  async () => {
    if (status.value !== 'success' || !orderId.value) return null
    return $fetch<OrderSummary>(`/api/checkout/result?orderId=${orderId.value}`)
  },
)

// Redirigir a confirmación cuando el pedido esté disponible
watch(orderSummary, (order) => {
  if (!order) return
  navigateTo({
    path: '/checkout/confirmation',
    query: {
      reference: order.reference,
      total: String(order.totals.total),
      currency: order.totals.currency,
      payment: order.paymentMethodId ?? '',
    },
  }, { replace: true })
}, { immediate: true })

const statusConfig = computed(() => {
  switch (status.value) {
    case 'success':
      return {
        icon: 'check',
        color: 'green',
        title: '¡Pago exitoso!',
        description: 'Tu pedido fue confirmado correctamente. Redirigiendo...',
      }
    case 'cancel':
      return {
        icon: 'x',
        color: 'yellow',
        title: 'Pago cancelado',
        description: 'Cancelaste el proceso de pago. Tu pedido no fue procesado. Puedes volver al carrito e intentarlo nuevamente.',
      }
    default:
      return {
        icon: 'error',
        color: 'red',
        title: 'Error en el pago',
        description: 'Ocurrió un problema al procesar tu pago. No se realizó ningún cargo. Por favor, intenta nuevamente.',
      }
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="mx-auto max-w-2xl px-4">

      <!-- Estado de carga -->
      <div v-if="fetchStatus === 'pending'" class="flex justify-center py-20">
        <svg class="h-8 w-8 animate-spin text-indigo-600" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>

      <template v-else>
        <!-- Ícono de resultado -->
        <div class="mb-8 flex justify-center">
          <div
            class="flex h-20 w-20 items-center justify-center rounded-full"
            :class="{
              'bg-green-100': statusConfig.color === 'green',
              'bg-yellow-100': statusConfig.color === 'yellow',
              'bg-red-100': statusConfig.color === 'red',
            }"
          >
            <!-- Éxito -->
            <svg
              v-if="statusConfig.icon === 'check'"
              class="h-10 w-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <!-- Cancelado -->
            <svg
              v-else-if="statusConfig.icon === 'x'"
              class="h-10 w-10 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <!-- Error -->
            <svg
              v-else
              class="h-10 w-10 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>
        </div>

        <!-- Título y descripción -->
        <div class="mb-8 text-center">
          <h1 class="text-2xl font-bold text-gray-900">{{ statusConfig.title }}</h1>
          <p class="mt-2 text-gray-600">{{ statusConfig.description }}</p>
        </div>

        <!-- Resumen del pedido (solo en éxito) -->
        <div v-if="status === 'success' && order" class="mb-8 rounded-xl border border-gray-200 bg-white shadow-sm">
          <div class="border-b border-gray-100 px-6 py-4">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-500">Referencia</span>
              <span class="font-mono font-semibold text-gray-900">{{ order.reference }}</span>
            </div>
          </div>

          <!-- Productos -->
          <div class="divide-y divide-gray-100">
            <div
              v-for="line in order.lines"
              :key="line.id"
              class="flex items-center justify-between px-6 py-3"
            >
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">{{ line.name }}</p>
                <p class="text-xs text-gray-500">Cant. {{ line.quantity }}</p>
              </div>
              <span class="ml-4 text-sm font-medium text-gray-900">
                {{ formatPrice(line.totalPrice, order.totals.currency) }}
              </span>
            </div>
          </div>

          <!-- Totales -->
          <div class="border-t border-gray-100 px-6 py-4 space-y-2">
            <div class="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>{{ formatPrice(order.totals.subtotal, order.totals.currency) }}</span>
            </div>
            <div class="flex justify-between text-sm text-gray-600">
              <span>Envío</span>
              <span>{{ formatPrice(order.totals.shipping, order.totals.currency) }}</span>
            </div>
            <div class="flex justify-between border-t border-gray-100 pt-2 text-base font-bold text-gray-900">
              <span>Total</span>
              <span>{{ formatPrice(order.totals.total, order.totals.currency) }}</span>
            </div>
          </div>

          <!-- Dirección -->
          <div class="border-t border-gray-100 px-6 py-4">
            <p class="mb-1 text-xs font-medium uppercase tracking-wide text-gray-400">Dirección de entrega</p>
            <p class="text-sm text-gray-700">
              {{ order.shippingAddress.firstName }} {{ order.shippingAddress.lastName }},
              {{ order.shippingAddress.address1 }}, {{ order.shippingAddress.city }}
            </p>
          </div>
        </div>

        <!-- Acciones -->
        <div class="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <!-- Éxito: ver pedidos o volver al inicio -->
          <template v-if="status === 'success'">
            <NuxtLink
              to="/account/orders"
              class="btn-primary text-center"
            >
              Ver mis pedidos
            </NuxtLink>
            <NuxtLink
              to="/"
              class="btn-secondary text-center"
            >
              Seguir comprando
            </NuxtLink>
          </template>

          <!-- Cancelado: volver al carrito -->
          <template v-else-if="status === 'cancel'">
            <NuxtLink
              to="/checkout"
              class="btn-primary text-center"
            >
              Volver al checkout
            </NuxtLink>
            <NuxtLink
              to="/catalog"
              class="btn-secondary text-center"
            >
              Ver productos
            </NuxtLink>
          </template>

          <!-- Error: reintentar -->
          <template v-else>
            <NuxtLink
              to="/checkout"
              class="btn-primary text-center"
            >
              Intentar nuevamente
            </NuxtLink>
            <NuxtLink
              to="/"
              class="btn-secondary text-center"
            >
              Ir al inicio
            </NuxtLink>
          </template>
        </div>

      </template>
    </div>
  </div>
</template>
