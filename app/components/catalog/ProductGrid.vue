<script setup lang="ts">
import type { Product } from '~~/shared/types/product.types'

defineProps<{
  products: Product[]
}>()
</script>

<template>
  <div class="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-6">
    <ProductCard
      v-for="product in products"
      :key="product.id"
      :product="product"
    />
  </div>
</template>
