<script setup lang="ts">
definePageMeta({ layout: false, middleware: 'auth' })

const { init: initCart } = useCart()
await initCart()

const {
  step,
  stepError,
  isPlacingOrder,
  nextStep,
  prevStep,
  goToStep,
  address,
  savedAddresses,
  loadingAddresses,
  selectedAddressId,
  selectedSavedAddress,
  useNewAddress,
  selectSavedAddress,
  enableNewAddress,
  selectedShippingId,
  selectedPaymentId,
  summary,
  loadingSummary,
  selectedShipping,
  orderTotal,
  cartSubtotal,
  currency,
  cart,
  isEmpty,
  placeOrder,
} = useCheckout()

const steps = [
  { id: 1, label: 'Dirección' },
  { id: 2, label: 'Envío' },
  { id: 3, label: 'Pago' },
]

function formatPrice(value: number): string {
  return new Intl.NumberFormat('es', { style: 'currency', currency: currency.value }).format(value)
}

function formatAddressLine(addr: { firstName: string, lastName: string, address1: string, city: string, postcode: string, country: string }): string {
  return `${addr.firstName} ${addr.lastName} — ${addr.address1}, ${addr.city}, ${addr.postcode}, ${addr.country}`
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">

    <!-- ── Header simplificado ────────────────────────────────────────────── -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <NuxtLink to="/" class="text-xl font-bold text-indigo-600 tracking-tight">
          PrestaShop
        </NuxtLink>
        <div class="flex items-center gap-2 text-sm text-gray-500">
          <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
          </svg>
          Pago seguro
        </div>
      </div>
    </header>

    <!-- ── Carrito vacío ──────────────────────────────────────────────────── -->
    <div v-if="isEmpty" class="max-w-lg mx-auto px-4 py-24 text-center">
      <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </div>
      <h2 class="text-xl font-semibold text-gray-800 mb-2">Tu carrito está vacío</h2>
      <p class="text-gray-500 mb-6">Agrega productos antes de continuar con el checkout.</p>
      <NuxtLink to="/catalog"
        class="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors font-medium">
        Ir al catálogo
      </NuxtLink>
    </div>

    <!-- ── Checkout ───────────────────────────────────────────────────────── -->
    <div v-else class="max-w-6xl mx-auto px-4 py-8">

      <!-- Stepper -->
      <nav class="mb-8">
        <ol class="flex items-center gap-0">
          <li v-for="(s, idx) in steps" :key="s.id" class="flex items-center flex-1 last:flex-none">
            <button
              class="flex items-center gap-2.5 group"
              :class="{ 'cursor-pointer': s.id < step }"
              :disabled="s.id >= step"
              @click="goToStep(s.id as 1 | 2 | 3)"
            >
              <!-- Círculo del paso -->
              <span
                class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 transition-colors"
                :class="{
                  'bg-indigo-600 text-white': step === s.id,
                  'bg-green-500 text-white': step > s.id,
                  'bg-gray-200 text-gray-500': step < s.id,
                }"
              >
                <svg v-if="step > s.id" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
                <span v-else>{{ s.id }}</span>
              </span>
              <!-- Etiqueta -->
              <span
                class="text-sm font-medium hidden sm:block"
                :class="{
                  'text-indigo-600': step === s.id,
                  'text-green-600': step > s.id,
                  'text-gray-400': step < s.id,
                }"
              >{{ s.label }}</span>
            </button>
            <!-- Línea separadora -->
            <div v-if="idx < steps.length - 1" class="flex-1 h-px mx-3"
              :class="step > s.id ? 'bg-green-400' : 'bg-gray-200'" />
          </li>
        </ol>
      </nav>

      <!-- Contenido principal -->
      <div class="lg:grid lg:grid-cols-3 lg:gap-8 items-start">

        <!-- ── Columna de pasos ───────────────────────────────────────────── -->
        <div class="lg:col-span-2 space-y-4">

          <!-- PASO 1: Dirección ──────────────────────────────────────────── -->
          <section class="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <button
              class="w-full flex items-center justify-between px-6 py-4 text-left"
              :class="step !== 1 && step > 1 ? 'cursor-pointer hover:bg-gray-50' : 'cursor-default'"
              @click="step > 1 ? goToStep(1) : undefined"
            >
              <div class="flex items-center gap-3">
                <span
                  class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  :class="step > 1 ? 'bg-green-100 text-green-700' : 'bg-indigo-100 text-indigo-700'"
                >
                  <svg v-if="step > 1" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <span v-else>1</span>
                </span>
                <h2 class="font-semibold text-gray-800">Dirección de entrega</h2>
              </div>
              <span v-if="step > 1" class="text-xs text-indigo-600 font-medium">Editar</span>
            </button>

            <!-- Resumen de dirección cuando está completo -->
            <div v-if="step > 1" class="px-6 pb-4 text-sm text-gray-600 border-t border-gray-100 pt-3">
              <template v-if="selectedSavedAddress">
                <span class="font-medium text-gray-700">{{ selectedSavedAddress.alias }}</span>
                — {{ formatAddressLine(selectedSavedAddress) }}
              </template>
              <template v-else>
                {{ formatAddressLine(address) }}
              </template>
            </div>

            <!-- Paso 1: selector y formulario -->
            <div v-if="step === 1" class="px-6 pb-6 border-t border-gray-100">
              <div v-if="loadingAddresses" class="py-6 text-center text-gray-400 text-sm">
                Cargando direcciones...
              </div>

              <template v-else>
                <!-- Direcciones guardadas -->
                <div v-if="savedAddresses?.length" class="mt-4 space-y-3">
                  <p class="text-sm font-medium text-gray-700">Selecciona una dirección de entrega</p>

                  <label
                    v-for="saved in savedAddresses"
                    :key="saved.id"
                    class="flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all"
                    :class="!useNewAddress && selectedAddressId === saved.id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'"
                  >
                    <input
                      type="radio"
                      :value="saved.id"
                      :checked="!useNewAddress && selectedAddressId === saved.id"
                      class="mt-0.5 accent-indigo-600"
                      @change="selectSavedAddress(saved.id)"
                    />
                    <div class="flex-1 min-w-0">
                      <p class="font-semibold text-gray-800 text-sm">{{ saved.alias }}</p>
                      <p class="text-sm text-gray-600 mt-0.5">
                        {{ saved.firstName }} {{ saved.lastName }}
                      </p>
                      <p class="text-sm text-gray-500 mt-0.5">
                        {{ saved.address1 }}<template v-if="saved.address2">, {{ saved.address2 }}</template>,
                        {{ saved.city }}, {{ saved.postcode }}, {{ saved.country }}
                      </p>
                      <p v-if="saved.phone" class="text-xs text-gray-400 mt-1">{{ saved.phone }}</p>
                    </div>
                  </label>

                  <button
                    type="button"
                    class="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                    @click="enableNewAddress"
                  >
                    + Usar otra dirección
                  </button>
                </div>

                <!-- Formulario manual (sin direcciones o nueva dirección) -->
                <div v-if="!savedAddresses?.length || useNewAddress" class="grid grid-cols-1 sm:grid-cols-2 gap-4" :class="savedAddresses?.length ? 'mt-6' : 'mt-4'">
                <!-- Nombre -->
                <div>
                  <label class="checkout-label">Nombre <span class="text-red-500">*</span></label>
                  <input v-model="address.firstName" type="text" class="checkout-input" placeholder="Juan" />
                </div>
                <!-- Apellido -->
                <div>
                  <label class="checkout-label">Apellido <span class="text-red-500">*</span></label>
                  <input v-model="address.lastName" type="text" class="checkout-input" placeholder="García" />
                </div>
                <!-- Empresa -->
                <div class="sm:col-span-2">
                  <label class="checkout-label">Empresa <span class="text-gray-400 font-normal">(opcional)</span></label>
                  <input v-model="address.company" type="text" class="checkout-input" placeholder="Mi empresa S.A." />
                </div>
                <!-- Dirección -->
                <div class="sm:col-span-2">
                  <label class="checkout-label">Dirección <span class="text-red-500">*</span></label>
                  <input v-model="address.address1" type="text" class="checkout-input" placeholder="Av. Corrientes 1234" />
                </div>
                <!-- Dirección 2 -->
                <div class="sm:col-span-2">
                  <label class="checkout-label">Piso / Depto <span class="text-gray-400 font-normal">(opcional)</span></label>
                  <input v-model="address.address2" type="text" class="checkout-input" placeholder="3° B" />
                </div>
                <!-- Ciudad -->
                <div>
                  <label class="checkout-label">Ciudad <span class="text-red-500">*</span></label>
                  <input v-model="address.city" type="text" class="checkout-input" placeholder="Buenos Aires" />
                </div>
                <!-- Provincia -->
                <div>
                  <label class="checkout-label">Provincia</label>
                  <input v-model="address.state" type="text" class="checkout-input" placeholder="Buenos Aires" />
                </div>
                <!-- CP -->
                <div>
                  <label class="checkout-label">Código postal <span class="text-red-500">*</span></label>
                  <input v-model="address.postcode" type="text" class="checkout-input" placeholder="C1043" />
                </div>
                <!-- País -->
                <div>
                  <label class="checkout-label">País <span class="text-red-500">*</span></label>
                  <select v-model="address.country" class="checkout-input">
                    <option>Argentina</option>
                    <option>Chile</option>
                    <option>Uruguay</option>
                    <option>Paraguay</option>
                    <option>Bolivia</option>
                    <option>Perú</option>
                    <option>Colombia</option>
                    <option>México</option>
                    <option>España</option>
                  </select>
                </div>
                <!-- Teléfono -->
                <div class="sm:col-span-2">
                  <label class="checkout-label">Teléfono</label>
                  <input v-model="address.phone" type="tel" class="checkout-input" placeholder="+54 11 1234-5678" />
                </div>
                </div>
              </template>

              <!-- Error + Botón -->
              <p v-if="stepError" class="mt-4 text-sm text-red-600 flex items-center gap-1.5">
                <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                {{ stepError }}
              </p>
              <button @click="nextStep"
                class="mt-5 w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-2.5 rounded-lg transition-colors">
                Continuar con el envío →
              </button>
            </div>
          </section>

          <!-- PASO 2: Método de envío ────────────────────────────────────── -->
          <section class="bg-white rounded-xl border border-gray-200 overflow-hidden"
            :class="step < 2 ? 'opacity-50 pointer-events-none' : ''">
            <button
              class="w-full flex items-center justify-between px-6 py-4 text-left"
              :class="step > 2 ? 'cursor-pointer hover:bg-gray-50' : 'cursor-default'"
              @click="step > 2 ? goToStep(2) : undefined"
            >
              <div class="flex items-center gap-3">
                <span
                  class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  :class="step > 2 ? 'bg-green-100 text-green-700' : step === 2 ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-400'"
                >
                  <svg v-if="step > 2" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <span v-else>2</span>
                </span>
                <h2 class="font-semibold text-gray-800">Método de envío</h2>
              </div>
              <span v-if="step > 2" class="text-xs text-indigo-600 font-medium">Editar</span>
            </button>

            <!-- Resumen de envío seleccionado -->
            <div v-if="step > 2 && selectedShipping" class="px-6 pb-4 border-t border-gray-100 pt-3">
              <p class="text-sm text-gray-600">
                {{ selectedShipping.name }} — {{ selectedShipping.delay }} —
                <span class="font-medium text-gray-800">{{ formatPrice(selectedShipping.price) }}</span>
              </p>
            </div>

            <!-- Opciones de envío -->
            <div v-if="step === 2" class="px-6 pb-6 border-t border-gray-100">
              <div v-if="loadingSummary" class="py-8 text-center text-gray-400 text-sm">Cargando opciones...</div>
              <div v-else class="mt-4 space-y-3">
                <label
                  v-for="method in summary?.shippingMethods"
                  :key="method.id"
                  class="flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all"
                  :class="selectedShippingId === method.id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'"
                >
                  <input
                    type="radio"
                    :value="method.id"
                    v-model="selectedShippingId"
                    class="mt-0.5 accent-indigo-600"
                  />
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between gap-2">
                      <span class="font-semibold text-gray-800 text-sm">{{ method.name }}</span>
                      <span class="font-bold text-gray-900 text-sm flex-shrink-0">{{ formatPrice(method.price) }}</span>
                    </div>
                    <p class="text-xs text-gray-500 mt-0.5">{{ method.description }}</p>
                    <p class="text-xs text-indigo-600 font-medium mt-1">
                      <svg class="w-3.5 h-3.5 inline -mt-0.5 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {{ method.delay }}
                    </p>
                  </div>
                </label>
              </div>

              <p v-if="stepError" class="mt-4 text-sm text-red-600 flex items-center gap-1.5">
                <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                {{ stepError }}
              </p>

              <div class="mt-5 flex gap-3">
                <button @click="prevStep"
                  class="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                  ← Atrás
                </button>
                <button @click="nextStep"
                  class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-2.5 rounded-lg transition-colors">
                  Continuar con el pago →
                </button>
              </div>
            </div>
          </section>

          <!-- PASO 3: Pago ───────────────────────────────────────────────── -->
          <section class="bg-white rounded-xl border border-gray-200 overflow-hidden"
            :class="step < 3 ? 'opacity-50 pointer-events-none' : ''">
            <div class="flex items-center gap-3 px-6 py-4">
              <span class="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                3
              </span>
              <h2 class="font-semibold text-gray-800">Método de pago</h2>
            </div>

            <div v-if="step === 3" class="px-6 pb-6 border-t border-gray-100">
              <!-- Métodos de pago -->
              <div v-if="loadingSummary" class="py-8 text-center text-gray-400 text-sm">Cargando opciones...</div>
              <div v-else class="mt-4 space-y-3">
                <label
                  v-for="method in summary?.paymentMethods"
                  :key="method.id"
                  class="flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all"
                  :class="selectedPaymentId === method.id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'"
                >
                  <input
                    type="radio"
                    :value="method.id"
                    v-model="selectedPaymentId"
                    class="mt-0.5 accent-indigo-600"
                  />
                  <div class="flex-1">
                    <p class="font-semibold text-gray-800 text-sm">{{ method.name }}</p>
                    <p class="text-xs text-gray-500 mt-0.5 leading-relaxed">{{ method.description }}</p>
                  </div>
                </label>
              </div>

              <!-- Resumen de la orden antes de confirmar -->
              <div class="mt-6 bg-gray-50 rounded-xl p-4 border border-gray-200">
                <h3 class="text-sm font-semibold text-gray-700 mb-3">Resumen antes de confirmar</h3>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{{ formatPrice(cartSubtotal) }}</span>
                  </div>
                  <div class="flex justify-between text-gray-600">
                    <span>Envío</span>
                    <span :class="selectedShipping ? 'text-gray-900' : 'text-gray-400'">
                      {{ selectedShipping ? formatPrice(selectedShipping.price) : 'No seleccionado' }}
                    </span>
                  </div>
                  <div class="border-t border-gray-200 pt-2 flex justify-between font-bold text-gray-900">
                    <span>Total</span>
                    <span class="text-lg">{{ formatPrice(orderTotal) }}</span>
                  </div>
                </div>
              </div>

              <!-- Aviso legal tipo PS8 -->
              <p class="mt-4 text-xs text-gray-500 leading-relaxed">
                Al confirmar el pedido, aceptas nuestros
                <a href="#" class="text-indigo-600 hover:underline">Términos y condiciones</a>
                y la <a href="#" class="text-indigo-600 hover:underline">Política de privacidad</a>.
              </p>

              <p v-if="stepError" class="mt-3 text-sm text-red-600 flex items-center gap-1.5">
                <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                {{ stepError }}
              </p>

              <div class="mt-5 flex gap-3">
                <button @click="prevStep"
                  class="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                  ← Atrás
                </button>
                <button
                  @click="placeOrder"
                  :disabled="isPlacingOrder"
                  class="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold px-10 py-3 rounded-xl transition-colors shadow-sm text-base"
                >
                  <svg v-if="isPlacingOrder" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ isPlacingOrder ? 'Procesando...' : 'Confirmar pedido' }}
                </button>
              </div>
            </div>
          </section>

        </div><!-- /columna de pasos -->

        <!-- ── Sidebar: Resumen del pedido ───────────────────────────────── -->
        <aside class="mt-6 lg:mt-0 lg:sticky lg:top-24">
          <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div class="px-5 py-4 border-b border-gray-100">
              <h2 class="font-semibold text-gray-800">Tu pedido</h2>
            </div>

            <!-- Items -->
            <ul class="divide-y divide-gray-100 max-h-72 overflow-y-auto">
              <li v-for="item in cart?.items" :key="item.id" class="px-5 py-3 flex items-center gap-3">
                <!-- Imagen del producto -->
                <div class="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 relative">
                  <img v-if="item.image" :src="item.image" :alt="item.name" class="w-full h-full object-cover" />
                  <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <!-- Badge de cantidad -->
                  <span class="absolute -top-1.5 -right-1.5 w-5 h-5 bg-indigo-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {{ item.quantity }}
                  </span>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-800 truncate">{{ item.name }}</p>
                  <p class="text-xs text-gray-400">SKU: {{ item.sku }}</p>
                </div>
                <span class="text-sm font-semibold text-gray-800 flex-shrink-0">
                  {{ formatPrice(item.totalPrice) }}
                </span>
              </li>
            </ul>

            <!-- Totales -->
            <div class="px-5 py-4 border-t border-gray-100 space-y-2.5">
              <div class="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>{{ formatPrice(cartSubtotal) }}</span>
              </div>
              <div class="flex justify-between text-sm text-gray-600">
                <span>Envío</span>
                <span v-if="selectedShipping" class="font-medium text-gray-800">
                  {{ formatPrice(selectedShipping.price) }}
                </span>
                <span v-else class="text-gray-400 text-xs">A calcular</span>
              </div>
              <div class="border-t border-gray-200 pt-2.5 flex justify-between">
                <span class="font-bold text-gray-900">Total</span>
                <span class="font-bold text-gray-900 text-lg">{{ formatPrice(orderTotal) }}</span>
              </div>
            </div>

            <!-- Badge de seguridad -->
            <div class="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center gap-2">
              <svg class="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
              </svg>
              <span class="text-xs text-gray-500">Transacción cifrada y segura</span>
            </div>
          </div>
        </aside>

      </div>
    </div>
  </div>
</template>

<style scoped>
.checkout-label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}
.checkout-input {
  @apply w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400
         focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition;
}
</style>
