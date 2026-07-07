<script setup lang="ts">
/**
 * Dashboard de cuenta del cliente.
 * Secciones alineadas con "Mon compte" de PrestaShop 8.
 */

definePageMeta({ middleware: 'auth' })

const { customer, logout } = useAuth()

const sections = [
  {
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
    title: 'Historial de pedidos',
    description: 'Consultá el estado y el detalle de todos tus pedidos.',
    to: '/account/orders',
  },
  {
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    title: 'Información personal',
    description: 'Actualizá tu nombre, email, contraseña y fecha de nacimiento.',
    to: '/account/profile',
  },
  {
    icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z',
    title: 'Mis direcciones',
    description: 'Gestioná tus direcciones de envío y facturación.',
    to: '/account/addresses',
  },
  {
    icon: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z',
    title: 'Mis cupones',
    description: 'Revisá los cupones y códigos de descuento disponibles.',
    to: '/account/vouchers',
  },
  {
    icon: 'M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 2 2 2-2 2 2 2-2 4 2z',
    title: 'Devoluciones',
    description: 'Gestioná las solicitudes de devolución de mercadería.',
    to: '/account/returns',
  },
  {
    icon: 'M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z',
    title: 'Créditos',
    description: 'Consultá los créditos disponibles en tu cuenta.',
    to: '/account/credit-slips',
  },
]

useSeoMeta({ title: 'Mi cuenta' })
</script>

<template>
  <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

    <!-- Cabecera -->
    <div class="mb-8 flex items-start justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-gray-900">
          Bienvenida, {{ customer?.firstName }}
        </h1>
        <p class="mt-1 text-sm text-gray-500">{{ customer?.email }}</p>
      </div>
      <button
        class="btn-secondary text-sm"
        @click="logout"
      >
        Cerrar sesión
      </button>
    </div>

    <!-- Grid de secciones (estructura PS8) -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <NuxtLink
        v-for="section in sections"
        :key="section.to"
        :to="section.to"
        class="card group flex items-start gap-4 p-5 hover:shadow-md transition-shadow duration-200"
      >
        <!-- Ícono -->
        <div class="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 transition-colors">
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" :d="section.icon" />
          </svg>
        </div>

        <!-- Texto -->
        <div class="min-w-0">
          <p class="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
            {{ section.title }}
          </p>
          <p class="mt-0.5 text-xs text-gray-500 leading-relaxed">
            {{ section.description }}
          </p>
        </div>
      </NuxtLink>
    </div>

  </div>
</template>
