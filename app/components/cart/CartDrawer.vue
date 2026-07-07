<script setup lang="ts">
const uiStore = useUiStore()
const { items, totals, isEmpty, itemCount } = useCart()
</script>

<template>
  <Teleport to="body">
    <Transition name="backdrop">
      <div
        v-if="uiStore.isCartDrawerOpen"
        class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        @click="uiStore.closeCartDrawer()"
      />
    </Transition>

    <Transition name="drawer">
      <div
        v-if="uiStore.isCartDrawerOpen"
        class="fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-white shadow-2xl"
      >
        <!-- Header del drawer -->
        <div class="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h2 class="text-base font-semibold text-gray-900">
            Carrito
            <span v-if="itemCount > 0" class="ml-1.5 rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
              {{ itemCount }}
            </span>
          </h2>
          <button
            class="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            @click="uiStore.closeCartDrawer()"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Lista de items (scrollable) -->
        <div class="flex-1 overflow-y-auto px-5">
          <!-- Vacío -->
          <div v-if="isEmpty" class="flex flex-col items-center justify-center h-full text-center py-16">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p class="text-sm text-gray-400 font-medium">Tu carrito está vacío</p>
            <button
              class="btn-secondary mt-4 text-sm"
              @click="uiStore.closeCartDrawer()"
            >
              Seguir comprando
            </button>
          </div>

          <!-- Items -->
          <ul v-else class="divide-y divide-gray-100">
            <CartItem
              v-for="item in items"
              :key="`${item.productId}-${item.variantId}`"
              :item="item"
            />
          </ul>
        </div>

        <!-- Footer con totales y CTA -->
        <div v-if="!isEmpty" class="border-t border-gray-200 px-5 py-5 space-y-4">
          <CartSummary :totals="totals!" />

          <NuxtLink
            to="/checkout"
            class="btn-primary w-full py-3 text-center block"
            @click="uiStore.closeCartDrawer()"
          >
            Finalizar compra
          </NuxtLink>

          <button
            class="w-full text-center text-sm text-gray-400 hover:text-gray-600 transition-colors"
            @click="uiStore.closeCartDrawer()"
          >
            Seguir comprando
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.backdrop-enter-active,
.backdrop-leave-active {
  transition: opacity 0.25s ease;
}
.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}

.drawer-enter-active,
.drawer-leave-active {
  transition: transform 0.3s ease;
}
.drawer-enter-from,
.drawer-leave-to {
  transform: translateX(100%);
}
</style>
