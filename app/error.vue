<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const is404 = computed(() => props.error.statusCode === 404)

const title = computed(() => is404.value ? 'Página no encontrada' : 'Algo salió mal')
const description = computed(() =>
  is404.value
    ? 'La página que buscas no existe o fue movida.'
    : 'Ocurrió un error inesperado. Por favor intenta nuevamente.',
)

useSeoMeta({
  title: () => `${props.error.statusCode} — ${title.value}`,
})

function handleError() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="min-h-screen bg-white flex flex-col">

    <!-- Header mínimo -->
    <header class="border-b border-gray-100">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center">
        <NuxtLink to="/" class="text-xl font-bold text-indigo-600 tracking-tight">
          PrestaShop
        </NuxtLink>
      </div>
    </header>

    <!-- Contenido central -->
    <main class="flex-1 flex items-center justify-center px-4 py-20">
      <div class="text-center max-w-md">

        <!-- Número de error grande -->
        <p class="text-8xl font-black text-indigo-100 select-none leading-none">
          {{ error.statusCode }}
        </p>

        <!-- Ícono -->
        <div class="mt-2 flex justify-center">
          <div class="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center">
            <svg v-if="is404" class="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg v-else class="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>
        </div>

        <!-- Texto -->
        <h1 class="mt-5 text-2xl font-bold text-gray-900 sm:text-3xl">
          {{ title }}
        </h1>
        <p class="mt-3 text-gray-500 text-sm leading-relaxed">
          {{ description }}
        </p>

        <!-- Acciones -->
        <div class="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            class="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            @click="handleError"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Ir al inicio
          </button>
          <NuxtLink
            to="/catalog"
            class="inline-flex items-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium px-6 py-3 rounded-xl transition-colors"
          >
            Ver catálogo
          </NuxtLink>
        </div>

      </div>
    </main>

    <!-- Footer mínimo -->
    <footer class="border-t border-gray-100 py-6 text-center">
      <p class="text-xs text-gray-400">
        &copy; {{ new Date().getFullYear() }} NuxtShop
      </p>
    </footer>

  </div>
</template>
