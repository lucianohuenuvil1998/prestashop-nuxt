<script setup lang="ts">
/**
 * Mis datos personales — alineado con PrestaShop 8.
 * Dos bloques: identidad + contraseña.
 */

import { validatePassword, validateProfilePayload, validateBirthDate } from '~~/shared/validation/form.validation'

definePageMeta({ middleware: 'auth' })

const { fetchProfile, updateProfile, updatePassword } = useProfile()
const { FIELD_LIMITS, limitPersonName, limitText } = useFormFields()

const { data: profile, pending, refresh } = fetchProfile()

const identityForm = reactive({
  civility: '',
  firstName: '',
  lastName: '',
  email: '',
  birthDate: '',
  newsletter: false,
  partnerOffers: false,
})

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const today = new Date()
const maxBirthDate = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate()).toISOString().slice(0, 10)
const minBirthDate = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate()).toISOString().slice(0, 10)

const isSavingIdentity = ref(false)
const isSavingPassword = ref(false)
const identityError = ref('')
const identitySuccess = ref(false)
const passwordError = ref('')
const passwordSuccess = ref(false)
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)

watch(profile, (p) => {
  if (!p) return
  identityForm.civility = p.civility ?? ''
  identityForm.firstName = p.firstName
  identityForm.lastName = p.lastName
  identityForm.email = p.email
  identityForm.birthDate = p.birthDate ?? ''
  identityForm.newsletter = p.newsletter
  identityForm.partnerOffers = p.partnerOffers
}, { immediate: true })

async function handleIdentitySubmit() {
  identityError.value = ''
  identitySuccess.value = false

  const birthDateError = validateBirthDate(identityForm.birthDate)
  if (birthDateError) {
    identityError.value = birthDateError
    return
  }

  const validationError = validateProfilePayload({
    civility: identityForm.civility,
    firstName: identityForm.firstName.trim(),
    lastName: identityForm.lastName.trim(),
    email: identityForm.email.trim(),
    birthDate: identityForm.birthDate || undefined,
    newsletter: identityForm.newsletter,
    partnerOffers: identityForm.partnerOffers,
  })

  if (validationError) {
    identityError.value = validationError
    return
  }

  isSavingIdentity.value = true

  try {
    await updateProfile({
      civility: identityForm.civility,
      firstName: identityForm.firstName,
      lastName: identityForm.lastName,
      email: identityForm.email,
      birthDate: identityForm.birthDate || undefined,
      newsletter: identityForm.newsletter,
      partnerOffers: identityForm.partnerOffers,
    })
    identitySuccess.value = true
    await refresh()
  }
  catch (err: unknown) {
    const fetchError = err as { data?: { statusMessage?: string } }
    identityError.value = fetchError.data?.statusMessage ?? 'No se pudieron guardar los datos. Intenta nuevamente.'
  }
  finally {
    isSavingIdentity.value = false
  }
}

async function handlePasswordSubmit() {
  passwordError.value = ''
  passwordSuccess.value = false

  if (!passwordForm.currentPassword) {
    passwordError.value = 'La contraseña actual es requerida.'
    return
  }

  const passwordValidation = validatePassword(passwordForm.newPassword, 'La nueva contraseña')
  if (passwordValidation) {
    passwordError.value = passwordValidation
    return
  }

  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordError.value = 'Las contraseñas nuevas no coinciden.'
    return
  }

  isSavingPassword.value = true

  try {
    await updatePassword({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    })
    passwordSuccess.value = true
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
  }
  catch (err: unknown) {
    const fetchError = err as { data?: { statusMessage?: string } }
    passwordError.value = fetchError.data?.statusMessage ?? 'No se pudo actualizar la contraseña.'
  }
  finally {
    isSavingPassword.value = false
  }
}

useSeoMeta({ title: 'Mis datos personales' })
</script>

<template>
  <div class="bg-gray-50 min-h-full">
    <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">

      <!-- Breadcrumb -->
      <nav class="mb-6 text-sm text-gray-500">
        <NuxtLink to="/" class="hover:text-gray-800 transition-colors">Inicio</NuxtLink>
        <span class="mx-1.5">/</span>
        <NuxtLink to="/account" class="hover:text-gray-800 transition-colors">Mi cuenta</NuxtLink>
        <span class="mx-1.5">/</span>
        <span class="text-gray-800">Mis datos personales</span>
      </nav>

      <h1 class="text-2xl font-normal text-gray-800 mb-8">Mis datos personales</h1>

      <!-- Loading -->
      <div v-if="pending" class="card p-8 animate-pulse space-y-4">
        <div class="h-4 bg-gray-200 rounded w-1/3" />
        <div class="h-10 bg-gray-100 rounded" />
        <div class="h-10 bg-gray-100 rounded" />
        <div class="h-10 bg-gray-100 rounded" />
      </div>

      <template v-else>
        <!-- Bloque 1: Identidad (PS8) -->
        <section class="card p-6 sm:p-8 mb-6">
          <h2 class="text-base font-semibold text-gray-800 mb-6">Información personal</h2>

          <div
            v-if="identitySuccess"
            class="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
          >
            Datos actualizados correctamente.
          </div>

          <div
            v-if="identityError"
            class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {{ identityError }}
          </div>

          <form class="space-y-5" @submit.prevent="handleIdentitySubmit">

            <!-- Tratamiento -->
            <div>
              <p class="block text-sm font-medium text-gray-700 mb-2">Tratamiento</p>
              <div class="flex gap-4">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input v-model="identityForm.civility" type="radio" value="1" class="accent-indigo-600" />
                  <span class="text-sm text-gray-700">Sr.</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input v-model="identityForm.civility" type="radio" value="2" class="accent-indigo-600" />
                  <span class="text-sm text-gray-700">Sra.</span>
                </label>
              </div>
            </div>

            <!-- Nombre y apellido -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">
                  Nombre <span class="text-red-500">*</span>
                </label>
                <input
                  id="firstName"
                  v-model="identityForm.firstName"
                  type="text"
                  required
                  class="input"
                  :maxlength="FIELD_LIMITS.firstName"
                  @input="identityForm.firstName = limitPersonName(identityForm.firstName, FIELD_LIMITS.firstName)"
                />
              </div>
              <div>
                <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">
                  Apellidos <span class="text-red-500">*</span>
                </label>
                <input
                  id="lastName"
                  v-model="identityForm.lastName"
                  type="text"
                  required
                  class="input"
                  :maxlength="FIELD_LIMITS.lastName"
                  @input="identityForm.lastName = limitPersonName(identityForm.lastName, FIELD_LIMITS.lastName)"
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
                v-model="identityForm.email"
                type="email"
                required
                class="input"
                :maxlength="FIELD_LIMITS.email"
                @input="identityForm.email = limitText(identityForm.email, FIELD_LIMITS.email)"
              />
            </div>

            <!-- Fecha de nacimiento -->
            <div>
              <label for="birthDate" class="block text-sm font-medium text-gray-700 mb-1">
                Fecha de nacimiento
                <span class="text-gray-400 font-normal">(opcional)</span>
              </label>
              <input
                id="birthDate"
                v-model="identityForm.birthDate"
                type="date"
                :max="maxBirthDate"
                :min="minBirthDate"
                class="input"
              />
            </div>

            <!-- Preferencias -->
            <div class="space-y-3 pt-1 border-t border-gray-100">
              <p class="text-sm font-medium text-gray-700 pt-3">Preferencias</p>
              <label class="flex items-start gap-3 cursor-pointer">
                <input v-model="identityForm.newsletter" type="checkbox" class="mt-0.5 h-4 w-4 accent-indigo-600 rounded" />
                <span class="text-sm text-gray-600">
                  Recibir ofertas exclusivas y novedades por correo electrónico.
                </span>
              </label>
              <label class="flex items-start gap-3 cursor-pointer">
                <input v-model="identityForm.partnerOffers" type="checkbox" class="mt-0.5 h-4 w-4 accent-indigo-600 rounded" />
                <span class="text-sm text-gray-600">
                  Recibir ofertas de nuestros socios comerciales.
                </span>
              </label>
            </div>

            <button type="submit" class="btn-primary px-8 py-2.5" :disabled="isSavingIdentity">
              {{ isSavingIdentity ? 'Guardando...' : 'Guardar' }}
            </button>
          </form>
        </section>

        <!-- Bloque 2: Contraseña (PS8) -->
        <section class="card p-6 sm:p-8">
          <h2 class="text-base font-semibold text-gray-800 mb-6">Contraseña</h2>

          <div
            v-if="passwordSuccess"
            class="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
          >
            Contraseña actualizada correctamente.
          </div>

          <div
            v-if="passwordError"
            class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {{ passwordError }}
          </div>

          <form class="space-y-5" @submit.prevent="handlePasswordSubmit">

            <div>
              <label for="currentPassword" class="block text-sm font-medium text-gray-700 mb-1">
                Contraseña actual <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <input
                  id="currentPassword"
                  v-model="passwordForm.currentPassword"
                  :type="showCurrentPassword ? 'text' : 'password'"
                  autocomplete="current-password"
                  class="input pr-10"
                />
                <button
                  type="button"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  @click="showCurrentPassword = !showCurrentPassword"
                >
                  <svg v-if="showCurrentPassword" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
                  </svg>
                  <svg v-else class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
            </div>

            <div>
              <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-1">
                Nueva contraseña <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <input
                  id="newPassword"
                  v-model="passwordForm.newPassword"
                  :type="showNewPassword ? 'text' : 'password'"
                  autocomplete="new-password"
                  minlength="8"
                  :maxlength="FIELD_LIMITS.passwordMax"
                  class="input pr-10"
                />
                <button
                  type="button"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  @click="showNewPassword = !showNewPassword"
                >
                  <svg v-if="showNewPassword" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
                  </svg>
                  <svg v-else class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
              <p class="mt-1 text-xs text-gray-400">Entre 8 y 32 caracteres.</p>
            </div>

            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">
                Confirmar nueva contraseña <span class="text-red-500">*</span>
              </label>
              <input
                id="confirmPassword"
                v-model="passwordForm.confirmPassword"
                type="password"
                autocomplete="new-password"
                :maxlength="FIELD_LIMITS.passwordMax"
                class="input"
              />
            </div>

            <button type="submit" class="btn-primary px-8 py-2.5" :disabled="isSavingPassword">
              {{ isSavingPassword ? 'Guardando...' : 'Cambiar contraseña' }}
            </button>
          </form>
        </section>
      </template>

    </div>
  </div>
</template>
