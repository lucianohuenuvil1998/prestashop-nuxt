<script setup lang="ts">
const [{ data, status }, { data: categories, status: categoriesStatus }] = await Promise.all([
  useProducts(),
  useCategories(),
])

const products = computed(() => data.value?.items ?? [])
const categoryList = computed(() => categories.value ?? [])
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="bg-gray-50 border-b border-gray-200">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div class="max-w-2xl">
          <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Tecnología y equipamiento<br />
            <span class="text-indigo-600">para tu espacio de trabajo.</span>
          </h1>
          <p class="mt-4 text-lg text-gray-500">
            Productos seleccionados para profesionales que exigen calidad, rendimiento y diseño.
          </p>
          <NuxtLink to="/catalog" class="btn-primary mt-8 inline-flex">
            Ver catálogo completo
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Categorías -->
    <section class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 border-b border-gray-100">
      <div class="flex items-baseline justify-between mb-8">
        <h2 class="text-2xl font-bold tracking-tight text-gray-900">
          Explora por categoría
        </h2>
        <NuxtLink
          to="/catalog"
          class="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
        >
          Ver catálogo →
        </NuxtLink>
      </div>

      <!-- Loading -->
      <div v-if="categoriesStatus === 'pending'" class="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div v-for="n in 2" :key="n" class="card overflow-hidden animate-pulse">
          <div class="aspect-[3/2] bg-gray-200" />
          <div class="p-4 space-y-2">
            <div class="h-4 w-2/3 rounded bg-gray-200" />
            <div class="h-3 w-full rounded bg-gray-100" />
          </div>
        </div>
      </div>

      <!-- Categorías -->
      <CategoryGrid v-else-if="categoryList.length" :categories="categoryList" />

      <div v-else class="py-8 text-center text-gray-400 text-sm">
        No hay categorías disponibles.
      </div>
    </section>

    <!-- Productos destacados -->
    <section class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div class="flex items-baseline justify-between mb-8">
        <h2 class="text-2xl font-bold tracking-tight text-gray-900">
          Productos destacados
        </h2>
        <NuxtLink
          to="/catalog"
          class="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
        >
          Ver todos →
        </NuxtLink>
      </div>

      <!-- Estado de carga -->
      <div v-if="status === 'pending'" class="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-6">
        <div
          v-for="n in 8"
          :key="n"
          class="card overflow-hidden animate-pulse"
        >
          <div class="aspect-square bg-gray-200" />
          <div class="p-4 space-y-2">
            <div class="h-3 w-1/3 rounded bg-gray-200" />
            <div class="h-4 w-2/3 rounded bg-gray-200" />
            <div class="h-3 w-full rounded bg-gray-200" />
            <div class="h-5 w-1/4 rounded bg-gray-200 mt-3" />
          </div>
        </div>
      </div>

      <!-- Estado de error -->
      <div
        v-else-if="status === 'error'"
        class="rounded-xl border border-red-200 bg-red-50 px-6 py-10 text-center"
      >
        <p class="text-sm font-medium text-red-600">
          No se pudieron cargar los productos. Intenta de nuevo más tarde.
        </p>
      </div>

      <!-- Productos -->
      <ProductGrid v-else-if="products.length" :products="products" />

      <!-- Sin resultados -->
      <div v-else class="py-16 text-center text-gray-400 text-sm">
        No hay productos disponibles.
      </div>
    </section>
  </div>
</template>
