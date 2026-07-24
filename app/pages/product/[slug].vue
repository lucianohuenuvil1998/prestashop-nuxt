<script setup lang="ts">
import { formatPrice, formatDiscount } from '../../utils/currency'
import type { ProductVariant } from '~~/shared/types/product.types'

const route = useRoute()
const slug = computed(() => String(route.params.slug))

const { data: product, status } = await useProduct(slug)
const { data: relatedProducts, status: relatedStatus } = useRelatedProducts(slug)
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
    const p = product.value
    const variant = selectedVariant.value
    await addItem(
      {
        productId: p.id,
        variantId: variant?.id,
        quantity: 1,
      },
      {
        name: p.name,
        slug: p.slug,
        image: p.images[selectedImage.value]?.url ?? p.images[0]?.url ?? null,
        price: variant?.price ?? p.price,
        sku: variant?.sku ?? p.sku,
      },
    )
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

const stockQuantity = computed(() =>
  selectedVariant.value
    ? selectedVariant.value.stock.quantity
    : product.value?.stock.quantity ?? 0,
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
        <AppBreadcrumb
          :items="[
            { label: 'Inicio', to: '/' },
            product.categories[0]
              ? { label: product.categories[0].name, to: `/catalog?categoryId=${product.categories[0].id}` }
              : { label: 'Catálogo', to: '/catalog' },
            { label: product.name },
          ]"
        />

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
            v-if="isInStock && stockQuantity <= 5"
            class="inline-flex items-center gap-1.5 text-sm font-medium text-amber-600"
          >
            <span class="h-2 w-2 rounded-full bg-amber-400" />
            ¡Solo {{ stockQuantity }} {{ stockQuantity === 1 ? 'unidad' : 'unidades' }} disponible{{ stockQuantity === 1 ? '' : 's' }}!
          </span>
          <span
            v-else-if="isInStock"
            class="inline-flex items-center gap-1.5 text-sm font-medium text-green-700"
          >
            <span class="h-2 w-2 rounded-full bg-green-500" />
            En stock · {{ stockQuantity }} unidades disponibles
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
              class="relative rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
              :class="[
                selectedVariant?.id === variant.id
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                  : variant.stock.isInStock
                    ? 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed line-through',
              ]"
              :disabled="!variant.stock.isInStock"
              :title="!variant.stock.isInStock ? 'Sin stock' : ''"
              @click="selectVariant(variant)"
            >
              {{ Object.values(variant.attributes)[0] }}
            </button>
          </div>
        </div>

        <!-- CTA -->
        <div class="mt-8 space-y-3">
          <!-- Sin stock: aviso destacado -->
          <div
            v-if="!isInStock"
            class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 flex items-center gap-3"
          >
            <svg class="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            <div>
              <p class="text-sm font-semibold text-red-700">Producto sin stock</p>
              <p class="text-xs text-red-500 mt-0.5">Actualmente no disponible. Vuelve pronto.</p>
            </div>
          </div>

          <p v-else-if="needsVariantSelection" class="text-xs text-amber-600 font-medium">
            Selecciona una opción antes de agregar al carrito.
          </p>

          <button
            class="w-full py-3 text-base font-semibold rounded-xl transition-all"
            :class="isInStock && !needsVariantSelection
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'"
            :disabled="!isInStock || isAddingToCart || needsVariantSelection"
            @click="handleAddToCart"
          >
            <span v-if="isAddingToCart" class="flex items-center justify-center gap-2">
              <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Agregando...
            </span>
            <span v-else-if="addedFeedback" class="flex items-center justify-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
              </svg>
              ¡Agregado al carrito!
            </span>
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

    <!-- ── Productos relacionados ─────────────────────────────────────────── -->
    <section class="mt-16 border-t border-gray-100 pt-12">
      <div class="flex items-baseline justify-between mb-6">
        <h2 class="text-xl font-bold text-gray-900">También te puede interesar</h2>
        <NuxtLink
          v-if="product?.categories[0]"
          :to="`/catalog?categoryId=${product.categories[0].id}`"
          class="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
        >
          Ver más →
        </NuxtLink>
      </div>

      <!-- Skeleton mientras cargan los relacionados -->
      <div
        v-if="relatedStatus === 'pending'"
        class="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4 sm:gap-6 animate-pulse"
      >
        <div v-for="n in 4" :key="n" class="card overflow-hidden">
          <div class="aspect-square bg-gray-200" />
          <div class="p-4 space-y-2">
            <div class="h-3 w-1/3 rounded bg-gray-200" />
            <div class="h-4 w-2/3 rounded bg-gray-200" />
            <div class="h-5 w-1/4 rounded bg-gray-200 mt-3" />
          </div>
        </div>
      </div>

      <div
        v-else-if="relatedProducts?.length"
        class="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4 sm:gap-6"
      >
        <ProductCard
          v-for="related in relatedProducts"
          :key="related.id"
          :product="related"
        />
      </div>
    </section>

  </div>
</template>
