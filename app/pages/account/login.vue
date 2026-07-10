<script setup lang="ts">
import { validateEmail } from '~~/shared/validation/form.validation'

definePageMeta({ middleware: 'guest' })

const { login } = useAuth()
const { FIELD_LIMITS, limitText } = useFormFields()

const form = reactive({ email: '', password: '' })
const showPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

async function handleSubmit() {
  errorMessage.value = ''

  const emailError = validateEmail(form.email.trim())
  if (emailError) {
    errorMessage.value = emailError
    return
  }

  if (!form.password) {
    errorMessage.value = 'La contraseña es requerida.'
    return
  }

  isLoading.value = true
  try {
    await login({ email: form.email, password: form.password })
    await navigateTo('/account')
  }
  catch (err: unknown) {
    const msg = err instanceof Error ? err.message : ''
    errorMessage.value = msg || 'Email o contraseña incorrectos.'
  }
  finally {
    isLoading.value = false
  }
}

useSeoMeta({ title: 'Iniciar sesión' })
</script>

<template>
  <div class="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-sm">

      <!-- Card -->
      <div class="card p-8">
        <div class="mb-6 text-center">
          <h1 class="text-xl font-bold text-gray-900">Iniciar sesión</h1>
          <p class="mt-1 text-sm text-gray-500">Accede a tu cuenta</p>
        </div>

        <form class="space-y-4" @submit.prevent="handleSubmit">
          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
              Correo electrónico
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              autocomplete="email"
              required
              placeholder="tu@email.com"
              class="input"
              :maxlength="FIELD_LIMITS.email"
              @input="form.email = limitText(form.email, FIELD_LIMITS.email)"
            />
          </div>

          <!-- Contraseña -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label for="password" class="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <NuxtLink
                to="/account/forgot-password"
                class="text-xs text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </NuxtLink>
            </div>
            <div class="relative">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                required
                placeholder="••••••••"
                class="input pr-10"
                :maxlength="FIELD_LIMITS.passwordMax"
              />
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                @click="showPassword = !showPassword"
              >
                <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Submit -->
          <button
            type="submit"
            class="btn-primary w-full py-2.5 mt-2"
            :disabled="isLoading"
          >
            <span v-if="isLoading">Iniciando sesión...</span>
            <span v-else>Iniciar sesión</span>
          </button>

          <!-- Error inline -->
          <p v-if="errorMessage" class="text-center text-sm text-red-500">
            {{ errorMessage }}
          </p>
        </form>

        <!-- Hint de desarrollo -->
        <div class="mt-4 rounded-lg bg-indigo-50 border border-indigo-100 px-3 py-2 text-xs text-indigo-700">
          <strong>Credenciales de prueba:</strong><br />
          cliente@test.com / password123
        </div>
      </div>

      <!-- Link a registro -->
      <p class="mt-6 text-center text-sm text-gray-500">
        ¿No tienes cuenta?
        <NuxtLink to="/account/register" class="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
          Crear una cuenta
        </NuxtLink>
      </p>

    </div>
  </div>
</template>
