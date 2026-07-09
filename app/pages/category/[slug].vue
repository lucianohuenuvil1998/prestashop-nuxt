<script setup lang="ts">
import type { ProductFilters } from '~~/shared/types/api.types'

const route = useRoute()
const slug = computed(() => String(route.params.slug))

const { data: category, status: categoryStatus, error: categoryError } = await useCategory(slug)

const filters = computed<ProductFilters>(() => ({
  categoryId: category.value?.id,
  perPage: 24,
}))

const { data, status: productsStatus } = await useProducts(filters)

const products = computed(() => data.value?.items ?? [])
const total = computed(() => data.value?.total ?? 0)

useSeoMeta({
  title: computed(() => category.value?.name ?? 'Categoría'),
  description: computed(() => category.value?.description),
})
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

    <!-- Loading categoría -->
    <div v-if="categoryStatus === 'pending'" class="animate-pulse mb-8">
      <div class="h-4 bg-gray-200 rounded w-32 mb-4" />
      <div class="h-8 bg-gray-200 rounded w-64 mb-2" />
      <div class="h-4 bg-gray-100 rounded w-96" />
    </div>

    <!-- Categoría no encontrada -->
    <div v-else-if="categoryError || !category" class="py-20 text-center">
      <h1 class="text-2xl font-bold text-gray-900 mb-2">Categoría no encontrada</h1>
      <p class="text-sm text-gray-500 mb-6">La categoría que buscas no existe.</p>
      <NuxtLink to="/catalog" class="btn-primary text-sm">Ver catálogo</NuxtLink>
    </div>

    <template v-else>
      <!-- Breadcrumb -->
      <nav class="mb-6 text-sm text-gray-500">
        <NuxtLink to="/" class="hover:text-indigo-600 transition-colors">Inicio</NuxtLink>
        <span class="mx-2">/</span>
        <NuxtLink to="/catalog" class="hover:text-indigo-600 transition-colors">Catálogo</NuxtLink>
        <span class="mx-2">/</span>
        <span class="text-gray-900 font-medium">{{ category.name }}</span>
      </nav>

      <!-- Cabecera de categoría -->
      <div class="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            {{ category.name }}
          </h1>
          <p class="mt-2 text-sm text-gray-500 max-w-2xl">
            {{ category.description }}
          </p>
          <p class="mt-1 text-sm text-gray-400">
            {{ total }} {{ total === 1 ? 'producto' : 'productos' }}
          </p>
        </div>
        <NuxtLink to="/catalog" class="btn-secondary text-sm self-start">
          Ver todo el catálogo
        </NuxtLink>
      </div>

      <!-- Loading productos -->
      <div
        v-if="productsStatus === 'pending'"
        class="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-6"
      >
        <div v-for="n in 8" :key="n" class="card overflow-hidden animate-pulse">
          <div class="aspect-square bg-gray-200" />
          <div class="p-4 space-y-2">
            <div class="h-3 w-1/3 rounded bg-gray-200" />
            <div class="h-4 w-2/3 rounded bg-gray-200" />
            <div class="h-5 w-1/4 rounded bg-gray-200 mt-3" />
          </div>
        </div>
      </div>

      <!-- Productos -->
      <ProductGrid v-else-if="products.length" :products="products" />

      <!-- Sin productos -->
      <div v-else class="py-20 text-center">
        <p class="text-gray-500 text-sm font-medium">
          No hay productos disponibles en esta categoría.
        </p>
        <NuxtLink to="/catalog" class="btn-secondary mt-4 inline-flex text-sm">
          Ver catálogo completo
        </NuxtLink>
      </div>
    </template>

  </div>
</template>
