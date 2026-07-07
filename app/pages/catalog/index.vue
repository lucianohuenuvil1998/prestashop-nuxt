<script setup lang="ts">
import type { ProductFilters } from '~~/shared/types/api.types'

const route = useRoute()
const router = useRouter()

// ─── Filtros derivados de la URL ────────────────────────────────────────────
const filters = computed<ProductFilters>(() => ({
  search: route.query.search ? String(route.query.search) : undefined,
  categoryId: route.query.categoryId ? Number(route.query.categoryId) : undefined,
  sort: (route.query.sort as ProductFilters['sort']) ?? undefined,
  perPage: 24,
}))

// ─── Datos ──────────────────────────────────────────────────────────────────
const [{ data, status }, { data: categories }] = await Promise.all([
  useProducts(filters),
  useCategories(),
])

const products = computed(() => data.value?.items ?? [])
const total = computed(() => data.value?.total ?? 0)
const categoryList = computed(() => categories.value ?? [])

const hasFilters = computed(
  () => !!route.query.search || !!route.query.categoryId || !!route.query.sort,
)

// ─── Acciones de filtrado (actualizan la URL) ────────────────────────────────
function setSearch(value: string) {
  router.push({ query: { ...route.query, search: value || undefined } })
}

function setCategory(id: number | undefined) {
  router.push({ query: { ...route.query, categoryId: id } })
}

function setSort(value: string) {
  router.push({ query: { ...route.query, sort: value || undefined } })
}

function clearFilters() {
  router.push({ query: {} })
}

// Estado local del input de búsqueda (debounced)
const searchInput = ref(String(route.query.search ?? ''))
const debouncedSetSearch = useDebounceFn(setSearch, 400)

watch(searchInput, (value) => debouncedSetSearch(value))

useSeoMeta({ title: 'Catálogo de productos' })
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

    <!-- Cabecera de la sección -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
        Catálogo
      </h1>
      <p class="mt-1 text-sm text-gray-500">
        {{ total }} {{ total === 1 ? 'producto' : 'productos' }} disponibles
      </p>
    </div>

    <!-- Barra de filtros -->
    <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

      <!-- Búsqueda -->
      <div class="relative w-full sm:max-w-xs">
        <svg
          class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
          xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          v-model="searchInput"
          type="search"
          placeholder="Buscar productos..."
          class="input pl-9"
        />
      </div>

      <!-- Sort -->
      <div class="flex items-center gap-3">
        <select
          :value="route.query.sort ?? ''"
          class="input w-auto cursor-pointer"
          @change="setSort(($event.target as HTMLSelectElement).value)"
        >
          <option value="">Relevancia</option>
          <option value="price_asc">Precio: menor a mayor</option>
          <option value="price_desc">Precio: mayor a menor</option>
          <option value="name_asc">Nombre A-Z</option>
          <option value="newest">Más nuevos</option>
        </select>
      </div>
    </div>

    <!-- Filtros de categoría -->
    <div class="mb-6 flex flex-wrap items-center gap-2">
      <button
        class="rounded-full border px-4 py-1.5 text-sm font-medium transition-colors"
        :class="!route.query.categoryId
          ? 'border-indigo-600 bg-indigo-600 text-white'
          : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'"
        @click="setCategory(undefined)"
      >
        Todos
      </button>

      <button
        v-for="category in categoryList"
        :key="category.id"
        class="rounded-full border px-4 py-1.5 text-sm font-medium transition-colors"
        :class="Number(route.query.categoryId) === category.id
          ? 'border-indigo-600 bg-indigo-600 text-white'
          : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'"
        @click="setCategory(category.id)"
      >
        {{ category.name }}
      </button>

      <!-- Limpiar filtros -->
      <button
        v-if="hasFilters"
        class="ml-2 text-sm text-gray-400 underline underline-offset-2 hover:text-gray-600 transition-colors"
        @click="clearFilters"
      >
        Limpiar filtros
      </button>
    </div>

    <!-- Loading -->
    <div
      v-if="status === 'pending'"
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

    <!-- Error -->
    <div
      v-else-if="status === 'error'"
      class="rounded-xl border border-red-200 bg-red-50 px-6 py-16 text-center"
    >
      <p class="text-sm font-medium text-red-600">
        No se pudieron cargar los productos. Intenta de nuevo más tarde.
      </p>
    </div>

    <!-- Grid -->
    <ProductGrid v-else-if="products.length" :products="products" />

    <!-- Sin resultados -->
    <div v-else class="py-20 text-center">
      <p class="text-gray-500 text-sm font-medium">
        No se encontraron productos
        <template v-if="route.query.search">
          para "<span class="text-gray-700">{{ route.query.search }}</span>"
        </template>
      </p>
      <button
        v-if="hasFilters"
        class="btn-secondary mt-4 inline-flex"
        @click="clearFilters"
      >
        Limpiar filtros
      </button>
    </div>

  </div>
</template>
