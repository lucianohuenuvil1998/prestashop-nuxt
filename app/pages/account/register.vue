<script setup lang="ts">
/**
 * Formulario de registro alineado con los campos de PrestaShop 8:
 * - Civility (género social para el saludo)
 * - Nombre y apellido
 * - Email
 * - Contraseña (mínimo 8 caracteres, PS8 exige esto)
 * - Fecha de nacimiento (opcional, PS8 la solicita)
 * - Opt-in newsletter
 * - Aceptación de términos (requerido)
 */

import { validateRegisterPayload, validateBirthDate } from '~~/shared/validation/form.validation'

definePageMeta({ middleware: 'guest' })

const { register } = useAuth()
const { FIELD_LIMITS, limitPersonName, limitText } = useFormFields()

const form = reactive({
  civility: '',        // 1 = Sr., 2 = Sra. (id_gender en PS8)
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  birthDate: '',       // formato YYYY-MM-DD
  newsletter: false,
  partnerOffers: false,
  acceptTerms: false,
})

const today = new Date()
const maxBirthDate = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate()).toISOString().slice(0, 10)
const minBirthDate = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate()).toISOString().slice(0, 10)

const showPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

const passwordStrength = computed(() => {
  const p = form.password
  if (!p) return 0
  let score = 0
  if (p.length >= 8) score++
  if (/[A-Z]/.test(p)) score++
  if (/[0-9]/.test(p)) score++
  if (/[^A-Za-z0-9]/.test(p)) score++
  return score
})

const passwordStrengthLabel = computed(() => {
  const labels = ['', 'Débil', 'Regular', 'Buena', 'Muy segura']
  return labels[passwordStrength.value] ?? ''
})

const passwordStrengthColor = computed(() => {
  const colors = ['', 'bg-red-400', 'bg-yellow-400', 'bg-blue-400', 'bg-green-500']
  return colors[passwordStrength.value] ?? ''
})

async function handleSubmit() {
  if (!form.acceptTerms) {
    errorMessage.value = 'Debes aceptar los términos y condiciones para continuar.'
    return
  }

  const validationError = validateRegisterPayload({
    civility: form.civility,
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    email: form.email.trim(),
    password: form.password,
    birthDate: form.birthDate || undefined,
    newsletter: form.newsletter,
    partnerOffers: form.partnerOffers,
  })

  if (validationError) {
    errorMessage.value = validationError
    return
  }

  errorMessage.value = ''
  isLoading.value = true

  try {
    await register({
      civility: form.civility,
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      password: form.password,
      birthDate: form.birthDate || undefined,
      newsletter: form.newsletter,
      partnerOffers: form.partnerOffers,
    })

    await navigateTo('/account')
  }
  catch (err: unknown) {
    const fetchError = err as { data?: { statusMessage?: string } }
    errorMessage.value = fetchError.data?.statusMessage ?? 'No se pudo crear la cuenta. Intenta nuevamente.'
  }
  finally {
    isLoading.value = false
  }
}

useSeoMeta({ title: 'Crear cuenta' })
</script>

<template>
  <div class="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-lg">

      <div class="card p-8">
        <div class="mb-6 text-center">
          <h1 class="text-xl font-bold text-gray-900">Crear cuenta</h1>
          <p class="mt-1 text-sm text-gray-500">Completa tus datos para registrarte</p>
        </div>

        <!-- Error -->
        <div
          v-if="errorMessage"
          class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {{ errorMessage }}
        </div>

        <form class="space-y-5" @submit.prevent="handleSubmit">

          <!-- Tratamiento (civility) — PS8: id_gender -->
          <div>
            <p class="block text-sm font-medium text-gray-700 mb-2">Tratamiento</p>
            <div class="flex gap-4">
              <label class="flex items-center gap-2 cursor-pointer">
                <input v-model="form.civility" type="radio" value="1" class="accent-indigo-600" />
                <span class="text-sm text-gray-700">Sr.</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input v-model="form.civility" type="radio" value="2" class="accent-indigo-600" />
                <span class="text-sm text-gray-700">Sra.</span>
              </label>
            </div>
          </div>

          <!-- Nombre y apellido -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">
                Nombre <span class="text-red-500">*</span>
              </label>
              <input
                id="firstName"
                v-model="form.firstName"
                type="text"
                autocomplete="given-name"
                required
                placeholder="María"
                class="input"
                :maxlength="FIELD_LIMITS.firstName"
                @input="form.firstName = limitPersonName(form.firstName, FIELD_LIMITS.firstName)"
              />
            </div>
            <div>
              <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">
                Apellido <span class="text-red-500">*</span>
              </label>
              <input
                id="lastName"
                v-model="form.lastName"
                type="text"
                autocomplete="family-name"
                required
                placeholder="González"
                class="input"
                :maxlength="FIELD_LIMITS.lastName"
                @input="form.lastName = limitPersonName(form.lastName, FIELD_LIMITS.lastName)"
              />
            </div>
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
              Correo electrónico <span class="text-red-500">*</span>
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
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
              Contraseña <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="new-password"
                required
                minlength="8"
                :maxlength="FIELD_LIMITS.passwordMax"
                placeholder="Entre 8 y 32 caracteres"
                class="input pr-10"
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

            <!-- Indicador de fortaleza -->
            <div v-if="form.password" class="mt-2">
              <div class="flex gap-1">
                <div
                  v-for="i in 4"
                  :key="i"
                  class="h-1 flex-1 rounded-full transition-all"
                  :class="i <= passwordStrength ? passwordStrengthColor : 'bg-gray-200'"
                />
              </div>
              <p class="mt-1 text-xs text-gray-500">
                Fortaleza: <span class="font-medium">{{ passwordStrengthLabel }}</span>
              </p>
            </div>
          </div>

          <!-- Fecha de nacimiento (opcional, PS8) -->
          <div>
            <label for="birthDate" class="block text-sm font-medium text-gray-700 mb-1">
              Fecha de nacimiento
              <span class="text-gray-400 font-normal">(opcional)</span>
            </label>
            <input
              id="birthDate"
              v-model="form.birthDate"
              type="date"
              autocomplete="bday"
              :max="maxBirthDate"
              :min="minBirthDate"
              class="input"
            />
          </div>

          <!-- Opt-ins (PS8) -->
          <div class="space-y-3 pt-1">
            <label class="flex items-start gap-3 cursor-pointer">
              <input
                v-model="form.newsletter"
                type="checkbox"
                class="mt-0.5 h-4 w-4 accent-indigo-600 rounded"
              />
              <span class="text-sm text-gray-600">
                Quiero recibir ofertas exclusivas y novedades por email.
              </span>
            </label>

            <label class="flex items-start gap-3 cursor-pointer">
              <input
                v-model="form.acceptTerms"
                type="checkbox"
                required
                class="mt-0.5 h-4 w-4 accent-indigo-600 rounded"
              />
              <span class="text-sm text-gray-600">
                He leído y acepto los
                <a href="#" class="text-indigo-600 underline hover:text-indigo-500">términos y condiciones</a>
                y la
                <a href="#" class="text-indigo-600 underline hover:text-indigo-500">política de privacidad</a>.
                <span class="text-red-500">*</span>
              </span>
            </label>
          </div>

          <!-- Submit -->
          <button
            type="submit"
            class="btn-primary w-full py-2.5"
            :disabled="isLoading"
          >
            <span v-if="isLoading">Creando cuenta...</span>
            <span v-else>Crear mi cuenta</span>
          </button>

        </form>
      </div>

      <p class="mt-6 text-center text-sm text-gray-500">
        ¿Ya tienes cuenta?
        <NuxtLink to="/account/login" class="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
          Inicia sesión
        </NuxtLink>
      </p>

    </div>
  </div>
</template>
