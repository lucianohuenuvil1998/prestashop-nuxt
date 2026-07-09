<script setup lang="ts">
const { isAuthenticated, customer } = useAuth()
const { itemCount } = useCart()
const uiStore = useUiStore()
const firstName = computed(() => customer.value?.firstName ?? '')
</script>

<template>
  <header class="sticky top-0 z-50 bg-white border-b border-gray-200">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">

        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-2">
          <span class="text-xl font-bold tracking-tight text-gray-900">NUXTSHOP</span>
        </NuxtLink>

        <!-- Nav -->
        <nav class="hidden md:flex items-center gap-6">
          <NuxtLink
            to="/"
            class="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            active-class="text-gray-900"
          >
            Inicio
          </NuxtLink>
          <NuxtLink
            to="/catalog"
            class="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            active-class="text-gray-900"
          >
            Catálogo
          </NuxtLink>
          <NuxtLink
            to="/contact"
            class="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            active-class="text-gray-900"
          >
            Contacto
          </NuxtLink>
        </nav>

        <!-- Acciones -->
        <div class="flex items-center gap-4">

          <!-- Carrito -->
          <button
            class="relative flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors"
            @click="uiStore.openCartDrawer()"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span
              v-if="itemCount > 0"
              class="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white"
            >
              {{ itemCount > 9 ? '9+' : itemCount }}
            </span>
          </button>

          <!-- Usuario autenticado -->
          <template v-if="isAuthenticated">
            <NuxtLink
              to="/account"
              class="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span class="hidden lg:inline">{{ firstName }}</span>
            </NuxtLink>
          </template>

          <!-- Invitado -->
          <template v-else>
            <NuxtLink
              to="/account/login"
              class="hidden sm:block text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Iniciar sesión
            </NuxtLink>
            <NuxtLink to="/account/register" class="btn-primary text-sm py-1.5 px-3">
              Registrarse
            </NuxtLink>
          </template>

        </div>
      </div>
    </div>
  </header>
</template>
