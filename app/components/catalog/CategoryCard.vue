<script setup lang="ts">
import type { Category } from '~~/shared/types/category.types'

defineProps<{
  category: Category
}>()
</script>

<template>
  <NuxtLink
    :to="`/category/${category.slug}`"
    class="card group overflow-hidden hover:shadow-md transition-shadow duration-200"
  >
    <!-- Contenedor sin imagen -->
    <div class="relative flex items-center justify-center bg-indigo-50 px-6 py-10 transition-colors duration-200 group-hover:bg-indigo-100">
      <h3 class="text-center text-lg font-bold text-indigo-800">{{ category.name }}</h3>
    </div>

    <!-- Descripción -->
    <div class="p-4">
      <p class="text-sm text-gray-500 line-clamp-2">{{ category.description }}</p>
      <span class="mt-3 inline-flex items-center gap-1 text-sm font-medium text-indigo-600 group-hover:text-indigo-700 transition-colors">
        Ver productos
        <svg class="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </span>
    </div>
  </NuxtLink>
</template>
