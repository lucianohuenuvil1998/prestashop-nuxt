<script setup lang="ts">
const { init } = useCart()
onMounted(init)
</script>

<template>
  <div class="min-h-screen bg-white flex flex-col">
    <AppHeader />
    <CartDrawer />

    <main class="flex-1">
      <slot />
    </main>

    <AppToasts />

    <footer class="border-t border-gray-200 mt-16">

      <!-- Trust badges -->
      <div class="border-b border-gray-100 bg-gray-50">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-gray-200">
            <div
              v-for="badge in [
                { icon: 'truck', label: 'Envío gratis', sub: 'En compras +$50.000' },
                { icon: 'return', label: 'Devoluciones', sub: '30 días sin preguntas' },
                { icon: 'lock', label: 'Pago seguro', sub: 'Cifrado SSL' },
                { icon: 'support', label: 'Soporte', sub: 'Lunes a viernes' },
              ]"
              :key="badge.label"
              class="flex items-center justify-center gap-3 px-6 py-6 sm:px-8"
            >
              <svg v-if="badge.icon === 'truck'" class="w-6 h-6 text-indigo-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              <svg v-else-if="badge.icon === 'return'" class="w-6 h-6 text-indigo-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <svg v-else-if="badge.icon === 'lock'" class="w-6 h-6 text-indigo-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <svg v-else class="w-6 h-6 text-indigo-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <div>
                <p class="text-sm font-semibold text-gray-700">{{ badge.label }}</p>
                <p class="text-xs text-gray-400">{{ badge.sub }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Barra inferior -->
      <div class="py-6">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p class="text-sm text-gray-400">
              &copy; {{ new Date().getFullYear() }} NuxtShop. Powered by Nuxt 4 + PrestaShop 8.
            </p>
            <nav class="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-400 justify-center">
              <NuxtLink to="/catalog" class="hover:text-gray-600 transition-colors">
                Catálogo
              </NuxtLink>
              <NuxtLink to="/contact" class="hover:text-gray-600 transition-colors">
                Contacto
              </NuxtLink>
              <NuxtLink to="/legal/terms" class="hover:text-gray-600 transition-colors">
                Términos
              </NuxtLink>
              <NuxtLink to="/legal/privacy" class="hover:text-gray-600 transition-colors">
                Privacidad
              </NuxtLink>
            </nav>
          </div>
        </div>
      </div>

    </footer>
  </div>
</template>
