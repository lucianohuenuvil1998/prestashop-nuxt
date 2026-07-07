<script setup lang="ts">
import { formatPrice, formatDiscount } from '../../utils/currency'
import type { ProductVariant } from '~~/shared/types/product.types'

const route = useRoute()
const slug = computed(() => String(route.params.slug))

const { data: product, status } = await useProduct(slug)
const { addItem } = useCart()

const selectedImage = ref(0)
const selectedVariant = ref<ProductVariant | null>(null)
const isAddingToCart = ref(false)
const addedFeedback = ref(false)

const needsVariantSelection = computed(
  () => !!product.value?.variants.length && !selectedVariant.value,
)

async function handleAddToCart() {
  if (!product.value || isAddingToCart.value || needsVariantSelection.value) return

  isAddingToCart.value = true
  try {
    await addItem({
      productId: product.value.id,
      variantId: selectedVariant.value?.id,
      quantity: 1,
    })
    addedFeedback.value = true
    setTimeout(() => { addedFeedback.value = false }, 2000)
  }
  finally {
    isAddingToCart.value = false
  }
}

const currentPrice = computed(() =>
  selectedVariant.value ? selectedVariant.value.price : product.value?.price ?? 0,
)

const hasDiscount = computed(
  () => !!product.value && product.value.regularPrice > product.value.price,
)

const isInStock = computed(() =>
  selectedVariant.value
    ? selectedVariant.value.stock.isInStock
    : product.value?.stock.isInStock ?? false,
)

function selectVariant(variant: ProductVariant) {
  selectedVariant.value = selectedVariant.value?.id === variant.id ? null : variant
}

useSeoMeta({
  title: () => product.value?.name ?? 'Producto',
  description: () => product.value?.shortDescription ?? '',
})
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

    <!-- Loading -->
    <div v-if="status === 'pending'" class="animate-pulse">
      <div class="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div class="aspect-square rounded-xl bg-gray-200" />
        <div class="space-y-4 py-4">
          <div class="h-3 w-1/4 rounded bg-gray-200" />
          <div class="h-8 w-3/4 rounded bg-gray-200" />
          <div class="h-4 w-1/2 rounded bg-gray-200" />
          <div class="h-10 w-1/3 rounded bg-gray-200 mt-6" />
          <div class="h-12 w-full rounded bg-gray-200 mt-6" />
        </div>
      </div>
    </div>

    <!-- Error / no encontrado -->
    <div
      v-else-if="status === 'error' || !product"
      class="rounded-xl border border-red-200 bg-red-50 px-6 py-16 text-center"
    >
      <p class="text-sm font-medium text-red-600">Producto no encontrado.</p>
      <NuxtLink to="/" class="btn-secondary mt-4 inline-flex">
        Volver al inicio
      </NuxtLink>
    </div>

    <!-- Detalle del producto -->
    <div v-else class="grid grid-cols-1 gap-10 lg:grid-cols-2">

      <!-- Columna izquierda: galería -->
      <div class="flex flex-col gap-3">
        <!-- Imagen principal -->
        <div class="card aspect-square overflow-hidden bg-gray-50">
          <img
            v-if="product.images[selectedImage]"
            :src="product.images[selectedImage].url"
            :alt="product.images[selectedImage].alt"
            class="h-full w-full object-cover"
          />
          <div v-else class="flex h-full items-center justify-center text-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        <!-- Miniaturas -->
        <div v-if="product.images.length > 1" class="flex gap-2">
          <button
            v-for="(image, index) in product.images"
            :key="image.id"
            class="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors"
            :class="selectedImage === index ? 'border-indigo-600' : 'border-transparent hover:border-gray-300'"
            @click="selectedImage = index"
          >
            <img :src="image.url" :alt="image.alt" class="h-full w-full object-cover" />
          </button>
        </div>
      </div>

      <!-- Columna derecha: info -->
      <div class="flex flex-col">

        <!-- Breadcrumb -->
        <nav class="flex items-center gap-1.5 text-xs text-gray-400">
          <NuxtLink to="/" class="hover:text-gray-600 transition-colors">Inicio</NuxtLink>
          <span>/</span>
          <NuxtLink
            v-if="product.categories[0]"
            to="/catalog"
            class="hover:text-gray-600 transition-colors"
          >
            {{ product.categories[0].name }}
          </NuxtLink>
          <span>/</span>
          <span class="text-gray-600 truncate">{{ product.name }}</span>
        </nav>

        <!-- Nombre -->
        <h1 class="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          {{ product.name }}
        </h1>

        <!-- SKU -->
        <p class="mt-1 text-xs text-gray-400">SKU: {{ product.sku }}</p>

        <!-- Precio -->
        <div class="mt-4 flex items-baseline gap-3">
          <span class="text-3xl font-bold text-gray-900">
            {{ formatPrice(currentPrice, product.currency) }}
          </span>
          <span v-if="hasDiscount" class="text-lg text-gray-400 line-through">
            {{ formatPrice(product.regularPrice, product.currency) }}
          </span>
          <span
            v-if="hasDiscount"
            class="rounded-full bg-indigo-600 px-2.5 py-0.5 text-sm font-semibold text-white"
          >
            {{ formatDiscount(product.regularPrice, product.price) }}
          </span>
        </div>

        <!-- Stock -->
        <div class="mt-3">
          <span
            v-if="isInStock"
            class="inline-flex items-center gap-1.5 text-sm font-medium text-green-700"
          >
            <span class="h-2 w-2 rounded-full bg-green-500" />
            En stock
          </span>
          <span
            v-else
            class="inline-flex items-center gap-1.5 text-sm font-medium text-red-600"
          >
            <span class="h-2 w-2 rounded-full bg-red-400" />
            Sin stock
          </span>
        </div>

        <!-- Descripción corta -->
        <p class="mt-4 text-sm leading-relaxed text-gray-600">
          {{ product.shortDescription }}
        </p>

        <!-- Variantes -->
        <div v-if="product.variants.length" class="mt-6">
          <p class="text-sm font-medium text-gray-900 mb-2">
            {{ Object.keys(product.variants[0].attributes)[0] }}
          </p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="variant in product.variants"
              :key="variant.id"
              class="rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
              :class="
                selectedVariant?.id === variant.id
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              "
              :disabled="!variant.stock.isInStock"
              @click="selectVariant(variant)"
            >
              {{ Object.values(variant.attributes)[0] }}
            </button>
          </div>
        </div>

        <!-- CTA -->
        <div class="mt-8 space-y-2">
          <p v-if="needsVariantSelection" class="text-xs text-amber-600 font-medium">
            Seleccioná una opción antes de agregar al carrito.
          </p>
          <button
            class="btn-primary w-full py-3 text-base transition-all"
            :disabled="!isInStock || isAddingToCart || needsVariantSelection"
            @click="handleAddToCart"
          >
            <span v-if="isAddingToCart">Agregando...</span>
            <span v-else-if="addedFeedback">¡Agregado al carrito!</span>
            <span v-else-if="!isInStock">Sin stock</span>
            <span v-else>Agregar al carrito</span>
          </button>
        </div>

        <!-- Separador -->
        <hr class="my-8 border-gray-200" />

        <!-- Descripción completa -->
        <div
          class="product-description text-sm leading-relaxed text-gray-600"
          v-html="product.description"
        />

      </div>
    </div>

  </div>
</template>
