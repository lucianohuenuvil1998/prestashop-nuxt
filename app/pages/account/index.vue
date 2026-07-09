<script setup lang="ts">
/**
 * Dashboard de cuenta del cliente.
 * Layout alineado con "Mi cuenta" de PrestaShop 8:
 * grid de tarjetas con icono centrado + etiqueta en mayúsculas.
 */

definePageMeta({ middleware: 'auth' })

const { logout } = useAuth()

// Direcciones del cliente para etiqueta dinámica (PS8 cambia el texto si no hay ninguna)
const { data: fullCustomer } = await useAsyncData('account-customer', () =>
  $fetch<import('~~/shared/types/customer.types').Customer>('/api/auth/me'),
)

const addressLabel = computed(() =>
  fullCustomer.value?.addresses?.length
    ? 'Mis direcciones'
    : 'Añadir primera dirección',
)

const sections = computed(() => [
  {
    icon: 'identity',
    label: 'Mis datos personales',
    to: '/account/profile',
  },
  {
    icon: 'address',
    label: addressLabel.value,
    to: '/account/addresses',
  },
  {
    icon: 'orders',
    label: 'Historial y detalles de mis pedidos',
    to: '/account/orders',
  },
])

useSeoMeta({ title: 'Mi cuenta' })
</script>

<template>
  <div class="bg-gray-50 min-h-full">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">

      <!-- Breadcrumb (PS8) -->
      <nav class="mb-6 text-sm text-gray-500">
        <NuxtLink to="/" class="hover:text-gray-800 transition-colors">Inicio</NuxtLink>
        <span class="mx-1.5">/</span>
        <span class="text-gray-800">Mi cuenta</span>
      </nav>

      <!-- Título -->
      <h1 class="text-2xl font-normal text-gray-800 mb-8">Mi cuenta</h1>

      <!-- Grid de tarjetas (estilo PS8) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        <NuxtLink
          v-for="section in sections"
          :key="section.to"
          :to="section.to"
          class="account-tile group"
        >
          <!-- Icono -->
          <div class="account-tile__icon">
            <!-- Dirección -->
            <svg v-if="section.icon === 'address'" class="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5c-1.4 0-2.5-1.1-2.5-2.5S10.6 6.5 12 6.5s2.5 1.1 2.5 2.5S13.4 11.5 12 11.5z" />
              <path d="M19 11h-2v2h2v-2zm-14 0H3v2h2v-2z" opacity="0" />
            </svg>

            <!-- Pedidos -->
            <svg v-else-if="section.icon === 'orders'" class="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H7v-2h5v2zm5-4H7v-2h10v2zm0-4H7V7h10v2z" />
            </svg>

            <!-- Datos personales -->
            <svg v-else-if="section.icon === 'identity'" class="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 2.5c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5S9.5 10.38 9.5 9 10.62 6.5 12 6.5zM18 18H6v-1.2c0-2 4-3.1 6-3.1s6 1.1 6 3.1V18z" />
            </svg>
          </div>

          <!-- Etiqueta -->
          <span class="account-tile__label">{{ section.label }}</span>
        </NuxtLink>
      </div>

      <!-- Cerrar sesión (abajo, como PS8) -->
      <div class="mt-10 text-center">
        <button
          type="button"
          class="text-sm text-sky-600 hover:text-sky-700 hover:underline transition-colors"
          @click="logout"
        >
          Cerrar sesión
        </button>
      </div>

    </div>
  </div>
</template>

<style scoped>
.account-tile {
  @apply flex flex-col items-center justify-center
         bg-white border border-gray-200
         px-6 py-10 min-h-[180px]
         text-center no-underline
         hover:shadow-md transition-shadow duration-200;
}

.account-tile__icon {
  @apply text-gray-700 mb-5
         group-hover:text-gray-900 transition-colors;
}

.account-tile__label {
  @apply text-xs font-semibold uppercase tracking-wide text-gray-700 leading-snug
         group-hover:text-gray-900 transition-colors;
}
</style>
