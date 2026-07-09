<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const route = useRoute()
const router = useRouter()
const addressId = computed(() => Number(route.params.id))

const { fetchAddress, updateAddress } = useAddresses()
const { data: address, pending } = fetchAddress(addressId)

const isLoading = ref(false)
const errorMessage = ref('')

async function handleSubmit(payload: import('~~/shared/types/customer.types').AddressInput) {
  errorMessage.value = ''
  isLoading.value = true

  try {
    await updateAddress(addressId.value, payload)
    await router.push('/account/addresses')
  }
  catch (err: unknown) {
    const fetchError = err as { data?: { statusMessage?: string } }
    errorMessage.value = fetchError.data?.statusMessage ?? 'No se pudo actualizar la dirección.'
  }
  finally {
    isLoading.value = false
  }
}

useSeoMeta({ title: 'Actualizar dirección' })
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
        <span class="text-gray-800">Actualizar dirección</span>
      </nav>

      <h1 class="text-2xl font-normal text-gray-800 mb-8">Actualizar dirección</h1>

      <div v-if="pending" class="card p-8 animate-pulse space-y-4">
        <div class="h-10 bg-gray-100 rounded" />
        <div class="h-10 bg-gray-100 rounded" />
        <div class="h-10 bg-gray-100 rounded" />
      </div>

      <div v-else-if="!address" class="card p-12 text-center">
        <p class="text-sm text-gray-500 mb-4">Dirección no encontrada.</p>
        <NuxtLink to="/account/addresses" class="btn-primary text-sm">Volver</NuxtLink>
      </div>

      <div v-else class="card p-6 sm:p-8">
        <div v-if="errorMessage" class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {{ errorMessage }}
        </div>

        <AddressForm
          :initial="address"
          submit-label="Actualizar"
          :is-loading="isLoading"
          @submit="handleSubmit"
        />
      </div>

    </div>
  </div>
</template>
