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

    <footer class="border-t border-gray-200 py-8 mt-16">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p class="text-sm text-gray-400">
            &copy; {{ new Date().getFullYear() }} NuxtShop. Powered by Nuxt 4 + PrestaShop 8.
          </p>
          <nav class="flex items-center gap-6 text-sm text-gray-400">
            <NuxtLink to="/contact" class="hover:text-gray-600 transition-colors">
              Contacto
            </NuxtLink>
            <NuxtLink to="/catalog" class="hover:text-gray-600 transition-colors">
              Catálogo
            </NuxtLink>
          </nav>
        </div>
      </div>
    </footer>
  </div>
</template>
