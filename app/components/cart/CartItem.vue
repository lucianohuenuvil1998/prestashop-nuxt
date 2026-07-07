<script setup lang="ts">
import type { CartItem } from '~~/shared/types/cart.types'
import { formatPrice } from '../../utils/currency'

const props = defineProps<{ item: CartItem }>()

const { removeItem, updateQuantity } = useCart()

const isUpdating = ref(false)

async function handleQuantityChange(delta: number) {
  if (isUpdating.value) return
  isUpdating.value = true
  try {
    await updateQuantity(props.item.id, props.item.quantity + delta)
  }
  finally {
    isUpdating.value = false
  }
}

async function handleRemove() {
  if (isUpdating.value) return
  isUpdating.value = true
  try {
    await removeItem(props.item.id)
  }
  finally {
    isUpdating.value = false
  }
}
</script>

<template>
  <li class="flex gap-4 py-4">
    <!-- Imagen -->
    <NuxtLink :to="`/product/${item.slug}`" class="flex-shrink-0">
      <img
        v-if="item.image"
        :src="item.image"
        :alt="item.name"
        class="h-16 w-16 rounded-lg object-cover bg-gray-50"
      />
      <div v-else class="h-16 w-16 rounded-lg bg-gray-100" />
    </NuxtLink>

    <!-- Info -->
    <div class="flex flex-1 flex-col gap-1 min-w-0">
      <div class="flex items-start justify-between gap-2">
        <NuxtLink
          :to="`/product/${item.slug}`"
          class="text-sm font-medium text-gray-900 hover:text-indigo-600 transition-colors line-clamp-2 leading-snug"
        >
          {{ item.name }}
        </NuxtLink>

        <!-- Eliminar -->
        <button
          class="flex-shrink-0 text-gray-300 hover:text-red-500 transition-colors"
          :disabled="isUpdating"
          @click="handleRemove"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <p class="text-xs text-gray-400">SKU: {{ item.sku }}</p>

      <div class="flex items-center justify-between mt-1">
        <!-- Controles de cantidad -->
        <div class="flex items-center gap-1 rounded-lg border border-gray-200 px-1">
          <button
            class="flex h-6 w-6 items-center justify-center text-gray-500 hover:text-gray-900 transition-colors disabled:opacity-40"
            :disabled="isUpdating || item.quantity <= 1"
            @click="handleQuantityChange(-1)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
            </svg>
          </button>

          <span class="min-w-[1.5rem] text-center text-sm font-medium text-gray-900">
            {{ item.quantity }}
          </span>

          <button
            class="flex h-6 w-6 items-center justify-center text-gray-500 hover:text-gray-900 transition-colors disabled:opacity-40"
            :disabled="isUpdating"
            @click="handleQuantityChange(1)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        <!-- Precio total del item -->
        <span class="text-sm font-semibold text-gray-900">
          {{ formatPrice(item.totalPrice, 'USD') }}
        </span>
      </div>
    </div>
  </li>
</template>
