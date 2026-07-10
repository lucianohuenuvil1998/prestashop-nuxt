<script setup lang="ts">
const props = defineProps<{
  page: number
  totalPages: number
  total: number
  perPage: number
}>()

const emit = defineEmits<{ change: [page: number] }>()

const from = computed(() => (props.page - 1) * props.perPage + 1)
const to = computed(() => Math.min(props.page * props.perPage, props.total))

// Genera los números de página visibles con elipsis
const pages = computed<(number | '...')[]>(() => {
  const total = props.totalPages
  const current = props.page

  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const result: (number | '...')[] = [1]

  if (current > 3) result.push('...')

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  for (let i = start; i <= end; i++) result.push(i)

  if (current < total - 2) result.push('...')

  result.push(total)

  return result
})

function go(p: number) {
  if (p < 1 || p > props.totalPages || p === props.page) return
  emit('change', p)
}
</script>

<template>
  <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8">
    <!-- Contador -->
    <p class="text-sm text-gray-500 order-2 sm:order-1">
      Mostrando <span class="font-medium text-gray-700">{{ from }}–{{ to }}</span>
      de <span class="font-medium text-gray-700">{{ total }}</span> productos
    </p>

    <!-- Controles -->
    <nav class="flex items-center gap-1 order-1 sm:order-2" aria-label="Paginación">
      <!-- Anterior -->
      <button
        class="flex h-9 w-9 items-center justify-center rounded-lg border transition-colors"
        :class="page === 1
          ? 'border-gray-200 text-gray-300 cursor-not-allowed'
          : 'border-gray-300 text-gray-600 hover:bg-gray-50'"
        :disabled="page === 1"
        aria-label="Página anterior"
        @click="go(page - 1)"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <!-- Páginas -->
      <template v-for="(p, idx) in pages" :key="idx">
        <span
          v-if="p === '...'"
          class="flex h-9 w-9 items-center justify-center text-sm text-gray-400 select-none"
        >
          …
        </span>
        <button
          v-else
          class="flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-medium transition-colors"
          :class="p === page
            ? 'border-indigo-600 bg-indigo-600 text-white'
            : 'border-gray-300 text-gray-600 hover:bg-gray-50'"
          :aria-current="p === page ? 'page' : undefined"
          @click="go(p)"
        >
          {{ p }}
        </button>
      </template>

      <!-- Siguiente -->
      <button
        class="flex h-9 w-9 items-center justify-center rounded-lg border transition-colors"
        :class="page === totalPages
          ? 'border-gray-200 text-gray-300 cursor-not-allowed'
          : 'border-gray-300 text-gray-600 hover:bg-gray-50'"
        :disabled="page === totalPages"
        aria-label="Página siguiente"
        @click="go(page + 1)"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </nav>
  </div>
</template>
