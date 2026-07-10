<script setup lang="ts">
const { isAuthenticated } = useAuth()

const [{ data, status }, { data: categories, status: categoriesStatus }] = await Promise.all([
  useProducts({ perPage: 4 }),
  useCategories(),
])

const featuredProducts = computed(() => data.value?.items ?? [])
const categoryList = computed(() => (categories.value ?? []).slice(0, 4))

useSeoMeta({
  title: 'Inicio — NuxtShop',
  description: 'Tecnología y equipamiento para tu espacio de trabajo. Productos seleccionados para profesionales.',
})
</script>

<template>
  <div>

    <!-- ── Hero ──────────────────────────────────────────────────────────── -->
    <section class="relative overflow-hidden bg-gray-900">
      <!-- Fondo decorativo -->
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-indigo-600/20 blur-3xl" />
        <div class="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-indigo-900/40 blur-3xl" />
      </div>

      <div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
        <div class="max-w-2xl">
          <!-- Badge -->
          <span class="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-300 ring-1 ring-inset ring-indigo-500/30 mb-6">
            <span class="h-1.5 w-1.5 rounded-full bg-indigo-400" />
            Nuevos productos disponibles
          </span>

          <h1 class="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl leading-tight">
            Tecnología para<br />
            <span class="text-indigo-400">tu espacio de trabajo.</span>
          </h1>

          <p class="mt-5 text-lg text-gray-300 leading-relaxed max-w-xl">
            Productos seleccionados para profesionales que exigen calidad, rendimiento y diseño.
            Envíos a todo el país.
          </p>

          <div class="mt-8 flex flex-wrap gap-4">
            <NuxtLink
              to="/catalog"
              class="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-lg shadow-indigo-900/40"
            >
              Ver catálogo
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </NuxtLink>
            <NuxtLink
              to="/account/register"
              class="inline-flex items-center gap-2 border border-white/20 text-white hover:bg-white/10 font-medium px-6 py-3 rounded-xl transition-colors"
            >
              Crear una cuenta
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Productos destacados ───────────────────────────────────────────── -->
    <section class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
      <div class="flex items-baseline justify-between mb-8">
        <div>
          <h2 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Productos destacados
          </h2>
          <p class="mt-1 text-sm text-gray-500">Lo más vendido esta semana</p>
        </div>
        <NuxtLink
          to="/catalog"
          class="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors flex items-center gap-1"
        >
          Ver todos
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </NuxtLink>
      </div>

      <!-- Skeletons -->
      <div
        v-if="status === 'pending'"
        class="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4 sm:gap-6"
      >
        <div v-for="n in 4" :key="n" class="card overflow-hidden animate-pulse">
          <div class="aspect-square bg-gray-200" />
          <div class="p-4 space-y-2">
            <div class="h-3 w-1/3 rounded bg-gray-200" />
            <div class="h-4 w-2/3 rounded bg-gray-200" />
            <div class="h-5 w-1/4 rounded bg-gray-200 mt-3" />
          </div>
        </div>
      </div>

      <!-- Error -->
      <div
        v-else-if="status === 'error'"
        class="rounded-xl border border-red-200 bg-red-50 px-6 py-10 text-center"
      >
        <p class="text-sm font-medium text-red-600">
          No se pudieron cargar los productos.
        </p>
      </div>

      <!-- Grid -->
      <div
        v-else-if="featuredProducts.length"
        class="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4 sm:gap-6"
      >
        <ProductCard v-for="product in featuredProducts" :key="product.id" :product="product" />
      </div>

      <div v-else class="py-16 text-center text-gray-400 text-sm">
        No hay productos disponibles.
      </div>
    </section>

    <!-- ── Banner CTA (solo para visitantes) ────────────────────────────── -->
    <section v-if="!isAuthenticated" class="mx-4 sm:mx-6 lg:mx-8 mb-14 rounded-2xl overflow-hidden bg-indigo-600">
      <div class="max-w-7xl mx-auto px-8 py-12 sm:py-16 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div class="text-center sm:text-left">
          <h2 class="text-2xl sm:text-3xl font-bold text-white">
            ¿Primera vez comprando?
          </h2>
          <p class="mt-2 text-indigo-200 text-sm sm:text-base">
            Crea tu cuenta y accede a seguimiento de pedidos, direcciones guardadas y más.
          </p>
        </div>
        <div class="flex flex-wrap gap-3 justify-center flex-shrink-0">
          <NuxtLink
            to="/account/register"
            class="inline-flex items-center gap-2 bg-white text-indigo-700 font-semibold px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors shadow"
          >
            Crear cuenta gratis
          </NuxtLink>
          <NuxtLink
            to="/catalog"
            class="inline-flex items-center gap-2 border border-white/40 text-white font-medium px-6 py-3 rounded-xl hover:bg-white/10 transition-colors"
          >
            Explorar catálogo
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- ── Categorías ─────────────────────────────────────────────────────── -->
    <section class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
      <div class="flex items-baseline justify-between mb-8">
        <div>
          <h2 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Explorar por categoría
          </h2>
          <p class="mt-1 text-sm text-gray-500">Encuentra exactamente lo que buscas</p>
        </div>
        <NuxtLink
          to="/catalog"
          class="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors flex items-center gap-1"
        >
          Ver catálogo
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </NuxtLink>
      </div>

      <!-- Skeletons -->
      <div
        v-if="categoriesStatus === 'pending'"
        class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        <div v-for="n in 4" :key="n" class="card overflow-hidden animate-pulse">
          <div class="aspect-[3/2] bg-gray-200" />
          <div class="p-4 space-y-2">
            <div class="h-4 w-2/3 rounded bg-gray-200" />
            <div class="h-3 w-full rounded bg-gray-100" />
          </div>
        </div>
      </div>

      <!-- Grid -->
      <div
        v-else-if="categoryList.length"
        class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        <CategoryCard v-for="category in categoryList" :key="category.id" :category="category" />
      </div>

      <div v-else class="py-8 text-center text-gray-400 text-sm">
        No hay categorías disponibles.
      </div>
    </section>

  </div>
</template>
