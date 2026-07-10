<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const is404 = computed(() => props.error.statusCode === 404)

function handleError() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <AppHeader />

    <main class="flex-1 flex items-center justify-center px-4 py-24">
      <div class="text-center max-w-md">

        <!-- Código grande -->
        <p class="text-8xl font-black text-indigo-100 select-none leading-none">
          {{ error.statusCode }}
        </p>

        <!-- Título -->
        <h1 class="mt-4 text-2xl font-bold text-gray-900">
          {{ is404 ? 'Página no encontrada' : 'Algo salió mal' }}
        </h1>

        <!-- Descripción -->
        <p class="mt-3 text-sm text-gray-500 leading-relaxed">
          <template v-if="is404">
            La página que estás buscando no existe o fue movida.
          </template>
          <template v-else>
            Ocurrió un error inesperado. Por favor, vuelve al inicio e intenta de nuevo.
          </template>
        </p>

        <!-- Acciones -->
        <div class="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            class="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm"
            @click="handleError"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Ir al inicio
          </button>
          <NuxtLink
            to="/catalog"
            class="inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Ver catálogo
          </NuxtLink>
        </div>

      </div>
    </main>

    <footer class="border-t border-gray-200 py-6">
      <div class="mx-auto max-w-7xl px-4 text-center">
        <p class="text-sm text-gray-400">
          &copy; {{ new Date().getFullYear() }} NuxtShop
        </p>
      </div>
    </footer>
  </div>
</template>
