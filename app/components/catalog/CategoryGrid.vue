<script setup lang="ts">
import type { Category } from '~~/shared/types/category.types'

defineProps<{
  categories: Category[]
}>()
</script>

<template>
  <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
    <CategoryCard
      v-for="category in categories"
      :key="category.id"
      :category="category"
    />
  </div>
</template>
