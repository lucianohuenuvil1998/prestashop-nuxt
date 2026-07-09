<script setup lang="ts">
/**
 * Listado de direcciones del cliente (PS8).
 */

definePageMeta({ middleware: 'auth' })

const { fetchAddresses, deleteAddress } = useAddresses()

const { data: addresses, pending, refresh } = fetchAddresses()
const deletingId = ref<number | null>(null)
const errorMessage = ref('')

async function handleDelete(id: number) {
  if (!confirm('¿Eliminar esta dirección?')) return

  errorMessage.value = ''
  deletingId.value = id

  try {
    await deleteAddress(id)
    await refresh()
  }
  catch {
    errorMessage.value = 'No se pudo eliminar la dirección.'
  }
  finally {
    deletingId.value = null
  }
}

useSeoMeta({ title: 'Mis direcciones' })
</script>

<template>
  <div class="bg-gray-50 min-h-full">
    <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">

      <nav class="mb-6 text-sm text-gray-500">
        <NuxtLink to="/" class="hover:text-gray-800 transition-colors">Inicio</NuxtLink>
        <span class="mx-1.5">/</span>
        <NuxtLink to="/account" class="hover:text-gray-800 transition-colors">Mi cuenta</NuxtLink>
        <span class="mx-1.5">/</span>
        <span class="text-gray-800">Mis direcciones</span>
      </nav>

      <div class="flex items-center justify-between mb-8">
        <h1 class="text-2xl font-normal text-gray-800">Mis direcciones</h1>
        <NuxtLink to="/account/addresses/new" class="btn-primary text-sm">
          Añadir dirección
        </NuxtLink>
      </div>

      <div v-if="errorMessage" class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {{ errorMessage }}
      </div>

      <!-- Loading -->
      <div v-if="pending" class="space-y-4">
        <div v-for="i in 2" :key="i" class="card p-6 animate-pulse">
          <div class="h-4 bg-gray-200 rounded w-1/4 mb-3" />
          <div class="h-3 bg-gray-100 rounded w-2/3" />
        </div>
      </div>

      <!-- Vacío -->
      <div v-else-if="!addresses?.length" class="card p-12 text-center">
        <div class="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-7 h-7 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5c-1.4 0-2.5-1.1-2.5-2.5S10.6 6.5 12 6.5s2.5 1.1 2.5 2.5S13.4 11.5 12 11.5z" />
          </svg>
        </div>
        <h2 class="text-lg font-semibold text-gray-800 mb-1">No tienes direcciones guardadas</h2>
        <p class="text-sm text-gray-500 mb-6">Añade una dirección para agilizar tus compras.</p>
        <NuxtLink to="/account/addresses/new" class="btn-primary text-sm">
          Añadir primera dirección
        </NuxtLink>
      </div>

      <!-- Lista -->
      <div v-else class="space-y-4">
        <article
          v-for="address in addresses"
          :key="address.id"
          class="card p-6"
        >
          <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h2 class="font-semibold text-gray-900 mb-2">{{ address.alias }}</h2>
              <address class="text-sm text-gray-600 not-italic leading-relaxed">
                {{ address.firstName }} {{ address.lastName }}<br>
                <span v-if="address.company">{{ address.company }}<br></span>
                {{ address.address1 }}<br>
                <span v-if="address.address2">{{ address.address2 }}<br></span>
                {{ address.postcode }} {{ address.city }}<br>
                <span v-if="address.state">{{ address.state }}, </span>{{ address.country }}<br>
                <span v-if="address.phone">{{ address.phone }}</span>
              </address>
            </div>

            <div class="flex gap-2 flex-shrink-0">
              <NuxtLink
                :to="`/account/addresses/${address.id}`"
                class="btn-secondary text-sm py-1.5 px-3"
              >
                Actualizar
              </NuxtLink>
              <button
                type="button"
                class="btn-secondary text-sm py-1.5 px-3 text-red-600 border-red-200 hover:bg-red-50"
                :disabled="deletingId === address.id"
                @click="handleDelete(address.id)"
              >
                {{ deletingId === address.id ? 'Eliminando...' : 'Eliminar' }}
              </button>
            </div>
          </div>
        </article>
      </div>

    </div>
  </div>
</template>
