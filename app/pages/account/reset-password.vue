<script setup lang="ts">
import { validatePassword } from '~~/shared/validation/form.validation'

definePageMeta({ middleware: 'guest' })
useSeoMeta({ title: 'Nueva contraseña' })

const route = useRoute()
const token = computed(() => String(route.query.token ?? ''))

// Validar que el token sea válido al cargar la página
const { data: tokenCheck } = await useAsyncData(
  `reset-token-${token.value}`,
  () => $fetch<{ valid: boolean }>(`/api/auth/validate-reset-token`, { query: { token: token.value } }),
)

const isValid = computed(() => !!tokenCheck.value?.valid)

const { FIELD_LIMITS } = useFormFields()
const password = ref('')
const passwordConfirm = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const success = ref(false)

async function handleSubmit() {
  errorMessage.value = ''

  const passwordError = validatePassword(password.value)
  if (passwordError) {
    errorMessage.value = passwordError
    return
  }

  if (password.value !== passwordConfirm.value) {
    errorMessage.value = 'Las contraseñas no coinciden'
    return
  }

  isLoading.value = true
  try {
    await $fetch('/api/auth/reset-password', {
      method: 'POST',
      body: { token: token.value, password: password.value },
      onResponseError({ response }) {
        throw new Error(
          response._data?.statusMessage ?? 'No se pudo restablecer la contraseña',
        )
      },
    })
    success.value = true
  }
  catch (err) {
    errorMessage.value = err instanceof Error ? err.message : 'Error inesperado'
  }
  finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-sm">

      <!-- Token inválido -->
      <div v-if="!isValid" class="card p-8 text-center">
        <div class="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>
        <h1 class="text-lg font-bold text-gray-900">Enlace inválido o expirado</h1>
        <p class="mt-2 text-sm text-gray-500 leading-relaxed">
          Este enlace de recuperación ya no es válido. Puede haber expirado o ya fue utilizado.
        </p>
        <NuxtLink
          to="/account/forgot-password"
          class="mt-6 inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm"
        >
          Solicitar nuevo enlace
        </NuxtLink>
      </div>

      <!-- Éxito -->
      <div v-else-if="success" class="card p-8 text-center">
        <div class="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 class="text-lg font-bold text-gray-900">¡Contraseña actualizada!</h1>
        <p class="mt-2 text-sm text-gray-500">
          Tu contraseña fue restablecida correctamente. Ya puedes iniciar sesión.
        </p>
        <NuxtLink
          to="/account/login"
          class="mt-6 inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm"
        >
          Ir al inicio de sesión
        </NuxtLink>
      </div>

      <!-- Formulario -->
      <div v-else class="card p-8">
        <div class="mb-6 text-center">
          <h1 class="text-xl font-bold text-gray-900">Nueva contraseña</h1>
          <p class="mt-1 text-sm text-gray-500">Elegí una contraseña segura para tu cuenta.</p>
        </div>

        <form class="space-y-4" @submit.prevent="handleSubmit">
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
              Nueva contraseña
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="new-password"
                placeholder="Mínimo 8 caracteres"
                class="input pr-10"
                :maxlength="FIELD_LIMITS.passwordMax"
                :disabled="isLoading"
              />
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                @click="showPassword = !showPassword"
              >
                <svg v-if="showPassword" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
                </svg>
                <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>

          <div>
            <label for="passwordConfirm" class="block text-sm font-medium text-gray-700 mb-1">
              Confirmar contraseña
            </label>
            <input
              id="passwordConfirm"
              v-model="passwordConfirm"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="new-password"
              placeholder="Repetí la contraseña"
              class="input"
              :maxlength="FIELD_LIMITS.passwordMax"
              :disabled="isLoading"
            />
          </div>

          <button
            type="submit"
            class="btn-primary w-full py-2.5 mt-2"
            :disabled="isLoading"
          >
            <span v-if="isLoading">Guardando...</span>
            <span v-else>Guardar nueva contraseña</span>
          </button>

          <p v-if="errorMessage" class="text-center text-sm text-red-500">
            {{ errorMessage }}
          </p>
        </form>
      </div>

    </div>
  </div>
</template>
