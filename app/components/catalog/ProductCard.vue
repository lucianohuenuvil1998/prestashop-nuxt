<script setup lang="ts">
import type { Product } from '~~/shared/types/product.types'
import { formatPrice, formatDiscount } from '../../utils/currency'

const props = defineProps<{
  product: Product
}>()

const image = computed(() => props.product.images[0] ?? null)
const category = computed(() => props.product.categories[0] ?? null)

const hasDiscount = computed(
  () => props.product.regularPrice > props.product.price,
)

const discountLabel = computed(() =>
  formatDiscount(props.product.regularPrice, props.product.price),
)
</script>

<template>
  <NuxtLink
    :to="`/product/${product.slug}`"
    class="card group flex flex-col overflow-hidden hover:shadow-md transition-shadow duration-200"
  >
    <!-- Imagen -->
    <div class="relative aspect-square overflow-hidden bg-gray-50">
      <img
        v-if="image"
        :src="image.url"
        :alt="image.alt"
        class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div v-else class="flex h-full items-center justify-center text-gray-300">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>

      <!-- Badge descuento -->
      <span
        v-if="hasDiscount"
        class="absolute top-2 left-2 rounded-full bg-indigo-600 px-2 py-0.5 text-xs font-semibold text-white"
      >
        {{ discountLabel }}
      </span>

      <!-- Badge sin stock -->
      <span
        v-if="!product.stock.isInStock"
        class="absolute inset-0 flex items-center justify-center bg-white/70 text-sm font-medium text-gray-500"
      >
        Sin stock
      </span>
    </div>

    <!-- Contenido -->
    <div class="flex flex-1 flex-col p-4">
      <span v-if="category" class="text-xs font-medium uppercase tracking-wide text-gray-400">
        {{ category.name }}
      </span>

      <h3 class="mt-1 text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">
        {{ product.name }}
      </h3>

      <p class="mt-1 text-xs text-gray-500 line-clamp-2 leading-relaxed">
        {{ product.shortDescription }}
      </p>

      <!-- Precio -->
      <div class="mt-3 flex items-baseline gap-2">
        <span class="text-base font-bold text-gray-900">
          {{ formatPrice(product.price, product.currency) }}
        </span>
        <span v-if="hasDiscount" class="text-sm text-gray-400 line-through">
          {{ formatPrice(product.regularPrice, product.currency) }}
        </span>
      </div>
    </div>
  </NuxtLink>
</template>
