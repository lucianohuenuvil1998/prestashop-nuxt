<script setup lang="ts">
import { validateEmail } from '~~/shared/validation/form.validation'

definePageMeta({ middleware: 'guest' })
useSeoMeta({ title: 'Recuperar contraseña' })

const email = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const submitted = ref(false)

// Solo en desarrollo: link directo para probar el flujo sin email real
const devToken = ref('')

async function handleSubmit() {
  errorMessage.value = ''

  const emailError = validateEmail(email.value.trim())
  if (emailError) {
    errorMessage.value = emailError
    return
  }

  isLoading.value = true
  try {
    const res = await $fetch<{ ok: boolean; devToken?: string }>('/api/auth/forgot-password', {
      method: 'POST',
      body: { email: email.value.trim() },
      onResponseError({ response }) {
        throw new Error(response._data?.statusMessage ?? 'Error al procesar la solicitud')
      },
    })
    devToken.value = res.devToken ?? ''
    submitted.value = true
  }
  catch (err) {
    errorMessage.value = err instanceof Error ? err.message : 'Error al procesar la solicitud'
  }
  finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-sm">

      <!-- Éxito -->
      <div v-if="submitted" class="card p-8 text-center">
        <div class="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 class="text-lg font-bold text-gray-900">Revisá tu correo</h1>
        <p class="mt-2 text-sm text-gray-500 leading-relaxed">
          Si <span class="font-medium text-gray-700">{{ email }}</span> tiene una cuenta registrada,
          te enviamos un enlace para restablecer tu contraseña.
        </p>

        <!-- Hint de desarrollo (no aparece en producción) -->
        <div v-if="devToken" class="mt-5 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-left">
          <p class="text-xs font-semibold text-amber-700 mb-1">Enlace de desarrollo (mock)</p>
          <NuxtLink
            :to="`/account/reset-password?token=${devToken}`"
            class="text-xs text-indigo-600 hover:underline break-all"
          >
            /account/reset-password?token={{ devToken }}
          </NuxtLink>
        </div>

        <NuxtLink
          to="/account/login"
          class="mt-6 inline-flex text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          ← Volver al inicio de sesión
        </NuxtLink>
      </div>

      <!-- Formulario -->
      <div v-else class="card p-8">
        <div class="mb-6 text-center">
          <h1 class="text-xl font-bold text-gray-900">Recuperar contraseña</h1>
          <p class="mt-1 text-sm text-gray-500">
            Ingresá tu correo y te enviaremos un enlace para restablecerla.
          </p>
        </div>

        <form class="space-y-4" @submit.prevent="handleSubmit">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
              Correo electrónico
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              autocomplete="email"
              placeholder="tu@email.com"
              class="input"
              :disabled="isLoading"
            />
          </div>

          <button
            type="submit"
            class="btn-primary w-full py-2.5"
            :disabled="isLoading"
          >
            <span v-if="isLoading">Enviando...</span>
            <span v-else>Enviar enlace de recuperación</span>
          </button>

          <p v-if="errorMessage" class="text-center text-sm text-red-500">
            {{ errorMessage }}
          </p>
        </form>

        <p class="mt-5 text-center text-sm text-gray-500">
          <NuxtLink to="/account/login" class="font-medium text-indigo-600 hover:text-indigo-500">
            ← Volver al inicio de sesión
          </NuxtLink>
        </p>
      </div>

    </div>
  </div>
</template>
