<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const router = useRouter()
const { customer } = useAuth()
const { createAddress } = useAddresses()

const isLoading = ref(false)
const errorMessage = ref('')

const initial = computed(() => ({
  firstName: customer.value?.firstName ?? '',
  lastName: customer.value?.lastName ?? '',
}))

async function handleSubmit(payload: import('~~/shared/types/customer.types').AddressInput) {
  errorMessage.value = ''
  isLoading.value = true

  try {
    await createAddress(payload)
    await router.push('/account/addresses')
  }
  catch (err: unknown) {
    const fetchError = err as { data?: { statusMessage?: string } }
    errorMessage.value = fetchError.data?.statusMessage ?? 'No se pudo guardar la dirección.'
  }
  finally {
    isLoading.value = false
  }
}

useSeoMeta({ title: 'Añadir dirección' })
</script>

<template>
  <div class="bg-gray-50 min-h-full">
    <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">

      <nav class="mb-6 text-sm text-gray-500">
        <NuxtLink to="/" class="hover:text-gray-800 transition-colors">Inicio</NuxtLink>
        <span class="mx-1.5">/</span>
        <NuxtLink to="/account" class="hover:text-gray-800 transition-colors">Mi cuenta</NuxtLink>
        <span class="mx-1.5">/</span>
        <NuxtLink to="/account/addresses" class="hover:text-gray-800 transition-colors">Mis direcciones</NuxtLink>
        <span class="mx-1.5">/</span>
        <span class="text-gray-800">Añadir dirección</span>
      </nav>

      <h1 class="text-2xl font-normal text-gray-800 mb-8">Añadir dirección</h1>

      <div class="card p-6 sm:p-8">
        <div v-if="errorMessage" class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {{ errorMessage }}
        </div>

        <AddressForm
          :initial="initial"
          submit-label="Guardar"
          :is-loading="isLoading"
          @submit="handleSubmit"
        />
      </div>

    </div>
  </div>
</template>
