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
    <!-- Imagen -->
    <div class="relative aspect-[3/2] overflow-hidden bg-gray-100">
      <img
        v-if="category.image"
        :src="category.image"
        :alt="category.name"
        class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div v-else class="flex h-full items-center justify-center bg-indigo-50 text-indigo-300">
        <svg class="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      </div>
      <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      <div class="absolute bottom-0 left-0 right-0 p-4">
        <h3 class="text-lg font-bold text-white">{{ category.name }}</h3>
      </div>
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
