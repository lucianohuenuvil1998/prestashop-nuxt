<script setup lang="ts">
/**
 * Historial de pedidos del cliente.
 * Alineado con "Historial y detalles de mis pedidos" de PrestaShop 8.
 */

definePageMeta({ middleware: 'auth' })

const {
  fetchOrders,
  formatOrderDate,
  formatOrderPrice,
} = useOrders()

const { data: orders, pending, error } = fetchOrders()

useSeoMeta({ title: 'Historial de pedidos' })
</script>

<template>
  <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

    <!-- Cabecera -->
    <div class="mb-8">
      <NuxtLink
        to="/account"
        class="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition-colors mb-4"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Volver a mi cuenta
      </NuxtLink>
      <h1 class="text-2xl font-bold tracking-tight text-gray-900">Historial de pedidos</h1>
      <p class="mt-1 text-sm text-gray-500">Consulta el estado y el detalle de todos tus pedidos.</p>
    </div>

    <!-- Loading -->
    <div v-if="pending" class="space-y-4">
      <div v-for="i in 3" :key="i" class="card p-5 animate-pulse">
        <div class="h-4 bg-gray-200 rounded w-1/4 mb-3" />
        <div class="h-3 bg-gray-100 rounded w-1/2" />
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="card p-8 text-center">
      <p class="text-sm text-red-600">No se pudieron cargar los pedidos. Intenta nuevamente.</p>
    </div>

    <!-- Vacío -->
    <div v-else-if="!orders?.length" class="card p-12 text-center">
      <div class="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </div>
      <h2 class="text-lg font-semibold text-gray-800 mb-1">Aún no tienes pedidos</h2>
      <p class="text-sm text-gray-500 mb-6">Cuando realices una compra, aparecerá aquí.</p>
      <NuxtLink to="/catalog" class="btn-primary text-sm">Ir al catálogo</NuxtLink>
    </div>

    <!-- Lista -->
    <div v-else class="card overflow-hidden">
      <div class="hidden sm:grid sm:grid-cols-12 gap-4 px-5 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        <div class="col-span-3">Pedido</div>
        <div class="col-span-2">Fecha</div>
        <div class="col-span-3">Estado</div>
        <div class="col-span-2 text-right">Total</div>
        <div class="col-span-2 text-right">Acción</div>
      </div>

      <ul class="divide-y divide-gray-100">
        <li
          v-for="order in orders"
          :key="order.id"
          class="px-5 py-4 hover:bg-gray-50 transition-colors"
        >
          <div class="sm:grid sm:grid-cols-12 sm:items-center gap-4">

            <!-- Referencia -->
            <div class="col-span-3 mb-2 sm:mb-0">
              <p class="text-xs text-gray-400 sm:hidden">Pedido</p>
              <p class="font-mono text-sm font-semibold text-gray-900">{{ order.reference }}</p>
              <p class="text-xs text-gray-500 mt-0.5">
                {{ order.lines.length }} {{ order.lines.length === 1 ? 'producto' : 'productos' }}
              </p>
            </div>

            <!-- Fecha -->
            <div class="col-span-2 mb-2 sm:mb-0">
              <p class="text-xs text-gray-400 sm:hidden">Fecha</p>
              <p class="text-sm text-gray-700">{{ formatOrderDate(order.createdAt) }}</p>
            </div>

            <!-- Estado -->
            <div class="col-span-3 mb-3 sm:mb-0">
              <p class="text-xs text-gray-400 sm:hidden">Estado</p>
              <span
                class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
                :class="ORDER_STATUS_CLASSES[order.status]"
              >
                {{ ORDER_STATUS_LABELS[order.status] }}
              </span>
            </div>

            <!-- Total -->
            <div class="col-span-2 mb-3 sm:mb-0 sm:text-right">
              <p class="text-xs text-gray-400 sm:hidden">Total</p>
              <p class="text-sm font-bold text-gray-900">
                {{ formatOrderPrice(order.totals.total, order.totals.currency) }}
              </p>
            </div>

            <!-- Acción -->
            <div class="col-span-2 sm:text-right">
              <NuxtLink
                :to="`/account/orders/${order.id}`"
                class="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Ver detalle
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </NuxtLink>
            </div>

          </div>
        </li>
      </ul>
    </div>

  </div>
</template>
