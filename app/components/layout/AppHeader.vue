<script setup lang="ts">
const { isAuthenticated, customer, logout } = useAuth()
const { itemCount } = useCart()
const uiStore = useUiStore()

const firstName = computed(() => customer.value?.firstName ?? '')
const fullName = computed(() => customer.value ? `${customer.value.firstName} ${customer.value.lastName}` : '')

const mobileMenuOpen = ref(false)
const accountDropdownOpen = ref(false)

function closeMobileMenu() {
  mobileMenuOpen.value = false
}

function toggleAccountDropdown() {
  accountDropdownOpen.value = !accountDropdownOpen.value
}

function closeAccountDropdown() {
  accountDropdownOpen.value = false
}

async function handleLogout() {
  closeAccountDropdown()
  closeMobileMenu()
  await logout()
}

// Cerrar dropdown al navegar
const route = useRoute()
watch(() => route.path, () => {
  closeAccountDropdown()
  closeMobileMenu()
})

const navLinks = [
  { to: '/', label: 'Inicio', exact: true },
  { to: '/catalog', label: 'Catálogo' },
  { to: '/contact', label: 'Contacto' },
]
</script>

<template>
  <header class="sticky top-0 z-50 bg-white border-b border-gray-200">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">

        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-2" @click="closeMobileMenu">
          <span class="text-xl font-bold tracking-tight text-gray-900">NUXTSHOP</span>
        </NuxtLink>

        <!-- Nav desktop -->
        <nav class="hidden md:flex items-center gap-6">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            active-class="text-gray-900"
            :exact="link.exact"
          >
            {{ link.label }}
          </NuxtLink>
        </nav>

        <!-- Acciones -->
        <div class="flex items-center gap-3">

          <!-- Carrito -->
          <button
            class="relative flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors p-1"
            aria-label="Carrito"
            @click="uiStore.openCartDrawer()"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span
              v-if="itemCount > 0"
              class="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white"
            >
              {{ itemCount > 9 ? '9+' : itemCount }}
            </span>
          </button>

          <!-- Usuario autenticado: dropdown -->
          <div v-if="isAuthenticated" class="relative">
            <button
              class="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors p-1 rounded-lg"
              @click="toggleAccountDropdown"
            >
              <div class="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <span class="text-xs font-bold text-indigo-700">{{ firstName.charAt(0).toUpperCase() }}</span>
              </div>
              <span class="hidden lg:inline max-w-[100px] truncate">{{ firstName }}</span>
              <svg
                class="w-3.5 h-3.5 text-gray-400 hidden lg:block transition-transform"
                :class="accountDropdownOpen ? 'rotate-180' : ''"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- Dropdown -->
            <Transition
              enter-active-class="transition duration-150 ease-out"
              enter-from-class="opacity-0 scale-95 -translate-y-1"
              enter-to-class="opacity-100 scale-100 translate-y-0"
              leave-active-class="transition duration-100 ease-in"
              leave-from-class="opacity-100 scale-100 translate-y-0"
              leave-to-class="opacity-0 scale-95 -translate-y-1"
            >
              <div
                v-if="accountDropdownOpen"
                v-click-outside="closeAccountDropdown"
                class="absolute right-0 top-full mt-2 w-52 rounded-xl border border-gray-200 bg-white shadow-lg py-1 origin-top-right"
              >
                <!-- Info del usuario -->
                <div class="px-4 py-2.5 border-b border-gray-100">
                  <p class="text-sm font-semibold text-gray-900 truncate">{{ fullName }}</p>
                  <p class="text-xs text-gray-400 truncate">{{ customer?.email }}</p>
                </div>

                <div class="py-1">
                  <NuxtLink
                    v-for="item in [
                      { to: '/account', label: 'Mi cuenta', icon: 'home' },
                      { to: '/account/orders', label: 'Mis pedidos', icon: 'orders' },
                      { to: '/account/addresses', label: 'Direcciones', icon: 'address' },
                      { to: '/account/profile', label: 'Datos personales', icon: 'profile' },
                    ]"
                    :key="item.to"
                    :to="item.to"
                    class="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <svg v-if="item.icon === 'home'" class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <svg v-else-if="item.icon === 'orders'" class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <svg v-else-if="item.icon === 'address'" class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <svg v-else class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {{ item.label }}
                  </NuxtLink>
                </div>

                <div class="border-t border-gray-100 py-1">
                  <button
                    class="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    @click="handleLogout"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Cerrar sesión
                  </button>
                </div>
              </div>
            </Transition>
          </div>

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

          <!-- Hamburguesa (móvil) -->
          <button
            class="md:hidden flex items-center justify-center p-1 text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Menú"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <svg v-if="!mobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

        </div>
      </div>
    </div>

    <!-- Menú móvil desplegable -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="mobileMenuOpen" class="md:hidden border-t border-gray-100 bg-white">
        <nav class="px-4 py-3 space-y-1">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            active-class="bg-indigo-50 text-indigo-700"
            @click="closeMobileMenu"
          >
            {{ link.label }}
          </NuxtLink>
        </nav>

        <!-- Sección de cuenta en móvil -->
        <div class="border-t border-gray-100 px-4 py-3">
          <template v-if="isAuthenticated">
            <p class="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Mi cuenta
            </p>
            <NuxtLink
              v-for="item in [
                { to: '/account/orders', label: 'Mis pedidos' },
                { to: '/account/addresses', label: 'Direcciones' },
                { to: '/account/profile', label: 'Datos personales' },
              ]"
              :key="item.to"
              :to="item.to"
              class="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              @click="closeMobileMenu"
            >
              {{ item.label }}
            </NuxtLink>
            <button
              class="mt-1 w-full text-left rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              @click="handleLogout"
            >
              Cerrar sesión
            </button>
          </template>
          <template v-else>
            <NuxtLink
              to="/account/login"
              class="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              @click="closeMobileMenu"
            >
              Iniciar sesión
            </NuxtLink>
            <NuxtLink
              to="/account/register"
              class="block rounded-lg px-3 py-2.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50 transition-colors"
              @click="closeMobileMenu"
            >
              Crear cuenta
            </NuxtLink>
          </template>
        </div>
      </div>
    </Transition>
  </header>
</template>
