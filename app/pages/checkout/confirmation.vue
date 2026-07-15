<script setup lang="ts">
definePageMeta({ layout: false })

const route = useRoute()
const cartStore = useCartStore()

onMounted(() => {
  cartStore.clearCart()
})

const reference = computed(() => String(route.query.reference ?? ''))
const total = computed(() => Number(route.query.total ?? 0))
const currency = computed(() => String(route.query.currency ?? 'USD'))
const paymentId = computed(() => String(route.query.payment ?? ''))

const paymentLabels: Record<string, string> = {
  bank_wire: 'Transferencia bancaria',
  cash_on_delivery: 'Contra entrega',
  webpay: 'Webpay',
}

const paymentLabel = computed(() => paymentLabels[paymentId.value] ?? paymentId.value)

function formatPrice(value: number): string {
  return new Intl.NumberFormat('es', { style: 'currency', currency: currency.value }).format(value)
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">

    <!-- Header simplificado -->
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <NuxtLink to="/" class="text-xl font-bold text-indigo-600 tracking-tight">
          PrestaShop
        </NuxtLink>
      </div>
    </header>

    <!-- Contenido principal -->
    <div class="max-w-2xl mx-auto px-4 py-16">

      <!-- Ícono de éxito -->
      <div class="text-center mb-8">
        <div class="inline-flex w-20 h-20 bg-green-100 rounded-full items-center justify-center mb-5">
          <svg class="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">¡Pedido confirmado!</h1>
        <p class="text-gray-500 text-base">Gracias por tu compra. Te enviaremos un email con los detalles.</p>
      </div>

      <!-- Card con detalles del pedido -->
      <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">

        <!-- Referencia + estado -->
        <div class="bg-green-50 border-b border-green-100 px-6 py-5 flex items-center justify-between">
          <div>
            <p class="text-xs text-green-600 font-semibold uppercase tracking-wider mb-1">Número de pedido</p>
            <p class="text-2xl font-bold text-gray-900 font-mono tracking-wide">{{ reference }}</p>
          </div>
          <span
            v-if="paymentId === 'webpay'"
            class="inline-flex items-center gap-1.5 bg-green-100 text-green-800 text-xs font-semibold px-3 py-1.5 rounded-full"
          >
            <span class="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
            Pago confirmado
          </span>
          <span
            v-else
            class="inline-flex items-center gap-1.5 bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1.5 rounded-full"
          >
            <span class="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
            Pendiente de pago
          </span>
        </div>

        <!-- Detalles -->
        <div class="divide-y divide-gray-100">

          <!-- Total -->
          <div class="px-6 py-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p class="text-xs text-gray-500 font-medium">Total del pedido</p>
                <p class="text-sm font-semibold text-gray-800">Incluye envío e impuestos</p>
              </div>
            </div>
            <span class="text-xl font-bold text-gray-900">{{ formatPrice(total) }}</span>
          </div>

          <!-- Método de pago -->
          <div class="px-6 py-4 flex items-center gap-3">
            <div class="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg class="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div>
              <p class="text-xs text-gray-500 font-medium">Método de pago</p>
              <p class="text-sm font-semibold text-gray-800">{{ paymentLabel }}</p>
            </div>
          </div>

          <!-- Instrucciones según método de pago -->
          <div v-if="paymentId === 'bank_wire'" class="px-6 py-4 bg-blue-50">
            <div class="flex gap-3">
              <svg class="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p class="text-sm font-semibold text-blue-800 mb-1">Datos para la transferencia</p>
                <p class="text-sm text-blue-700 leading-relaxed">
                  Te enviaremos los datos bancarios a tu email. El pedido se procesa una vez
                  acreditada la transferencia. <strong>Referencia obligatoria:</strong> {{ reference }}
                </p>
              </div>
            </div>
          </div>

          <div v-else-if="paymentId === 'check'" class="px-6 py-4 bg-yellow-50">
            <div class="flex gap-3">
              <svg class="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p class="text-sm font-semibold text-yellow-800 mb-1">Instrucciones de pago</p>
                <p class="text-sm text-yellow-700 leading-relaxed">
                  Envía tu cheque con el número de pedido <strong>{{ reference }}</strong> en el anverso.
                  Procesamos el envío al recibir el cheque compensado.
                </p>
              </div>
            </div>
          </div>

          <div v-else-if="paymentId === 'cash_on_delivery'" class="px-6 py-4 bg-green-50">
            <div class="flex gap-3">
              <svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p class="text-sm font-semibold text-green-800 mb-1">¡Todo listo!</p>
                <p class="text-sm text-green-700 leading-relaxed">
                  Pagarás al recibir tu pedido. El repartidor llevará un terminal de pago.
                  Puedes pagar en efectivo o con tarjeta.
                </p>
              </div>
            </div>
          </div>

          <div v-else-if="paymentId === 'webpay'" class="px-6 py-4 bg-green-50">
            <div class="flex gap-3">
              <svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p class="text-sm font-semibold text-green-800 mb-1">Pago acreditado</p>
                <p class="text-sm text-green-700 leading-relaxed">
                  Tu pago con Webpay fue procesado exitosamente. El número de seguimiento es
                  <strong>{{ reference }}</strong>. Recibirás la confirmación por email.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- Próximos pasos -->
      <div class="mt-6 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div class="px-6 py-4 border-b border-gray-100">
          <h2 class="font-semibold text-gray-800">¿Qué sigue?</h2>
        </div>
        <div class="divide-y divide-gray-100">
          <div class="px-6 py-4 flex items-start gap-3">
            <div class="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span class="text-xs font-bold text-indigo-600">1</span>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-800">Confirmación por email</p>
              <p class="text-xs text-gray-500 mt-0.5">Recibirás los detalles del pedido en tu bandeja de entrada.</p>
            </div>
          </div>
          <div class="px-6 py-4 flex items-start gap-3">
            <div class="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span class="text-xs font-bold text-indigo-600">2</span>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-800">Preparación del pedido</p>
              <p class="text-xs text-gray-500 mt-0.5">Una vez confirmado el pago, preparamos y empacamos tu pedido.</p>
            </div>
          </div>
          <div class="px-6 py-4 flex items-start gap-3">
            <div class="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span class="text-xs font-bold text-indigo-600">3</span>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-800">Envío y seguimiento</p>
              <p class="text-xs text-gray-500 mt-0.5">Te notificaremos cuando tu pedido salga a domicilio con el número de seguimiento.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Acciones -->
      <div class="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <NuxtLink to="/"
          class="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-semibold">
          Continuar
        </NuxtLink>
        <NuxtLink to="/account/orders"
          class="inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Ver mis pedidos
        </NuxtLink>
        <NuxtLink to="/catalog"
          class="inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          Seguir comprando
        </NuxtLink>
      </div>

    </div>
  </div>
</template>
