<script setup lang="ts">
/**
 * Formulario de contacto alineado con PrestaShop 8:
 * - Asunto (desde contactos del servicio al cliente)
 * - Email
 * - Referencia de pedido (opcional, si el usuario tiene pedidos)
 * - Mensaje
 */

const { customer, isAuthenticated } = useAuth()
const { subjects, loadingSubjects, submitMessage } = useContact()
const { formatOrderDate } = useOrders()

const form = reactive({
  subjectId: '' as string | number,
  email: customer.value?.email ?? '',
  orderReference: '',
  message: '',
})

const isLoading = ref(false)
const errorMessage = ref('')
const isSuccess = ref(false)

// Pedidos del usuario (para referencia opcional, como en PS8)
const orders = ref<import('~~/shared/types/order.types').Order[]>([])

onMounted(async () => {
  if (isAuthenticated.value) {
    try {
      orders.value = await $fetch('/api/account/orders')
    }
    catch {
      // Sin pedidos o sin sesión válida
    }
  }
})

watch(customer, (c) => {
  if (c?.email && !form.email) {
    form.email = c.email
  }
})

async function handleSubmit() {
  errorMessage.value = ''
  isSuccess.value = false

  if (!form.subjectId) {
    errorMessage.value = 'Selecciona un asunto.'
    return
  }

  isLoading.value = true

  try {
    await submitMessage({
      subjectId: Number(form.subjectId),
      email: form.email,
      orderReference: form.orderReference || undefined,
      message: form.message,
    })

    isSuccess.value = true
    form.subjectId = ''
    form.orderReference = ''
    form.message = ''
    if (!isAuthenticated.value) {
      form.email = ''
    }
  }
  catch (err: unknown) {
    const fetchError = err as { data?: { statusMessage?: string } }
    errorMessage.value = fetchError.data?.statusMessage ?? 'No se pudo enviar el mensaje. Intenta nuevamente.'
  }
  finally {
    isLoading.value = false
  }
}

useSeoMeta({
  title: 'Contacto',
  description: 'Ponte en contacto con nuestro equipo de atención al cliente.',
})
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

    <!-- Cabecera -->
    <div class="mb-10 max-w-2xl">
      <h1 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Contacto</h1>
      <p class="mt-2 text-sm text-gray-500 leading-relaxed">
        ¿Tienes alguna pregunta? Completa el formulario y nuestro equipo te responderá lo antes posible.
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

      <!-- Información de la tienda (como en PS8) -->
      <aside class="lg:col-span-1 space-y-6">
        <section class="card p-5">
          <h2 class="font-semibold text-gray-800 mb-4">Información de la tienda</h2>
          <ul class="space-y-4 text-sm text-gray-600">
            <li class="flex gap-3">
              <svg class="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>
                Av. Corrientes 1234<br>
                Buenos Aires, C1043<br>
                Argentina
              </span>
            </li>
            <li class="flex gap-3">
              <svg class="w-5 h-5 text-indigo-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a href="mailto:contacto@nuxtshop.com" class="hover:text-indigo-600 transition-colors">
                contacto@nuxtshop.com
              </a>
            </li>
            <li class="flex gap-3">
              <svg class="w-5 h-5 text-indigo-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>+54 11 1234-5678</span>
            </li>
          </ul>
        </section>

        <section class="card p-5 bg-indigo-50 border-indigo-100">
          <h3 class="text-sm font-semibold text-indigo-800 mb-2">Horario de atención</h3>
          <p class="text-sm text-indigo-700 leading-relaxed">
            Lunes a viernes, 9:00 – 18:00 h.<br>
            Respondemos en un plazo de 24–48 horas hábiles.
          </p>
        </section>
      </aside>

      <!-- Formulario -->
      <div class="lg:col-span-2">
        <div class="card p-6 sm:p-8">

          <!-- Éxito -->
          <div
            v-if="isSuccess"
            class="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-4 text-sm text-green-800"
          >
            <p class="font-semibold mb-1">Mensaje enviado correctamente</p>
            <p>Gracias por contactarnos. Te responderemos a la brevedad en el email que indicaste.</p>
          </div>

          <!-- Error -->
          <div
            v-if="errorMessage"
            class="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {{ errorMessage }}
          </div>

          <form class="space-y-5" @submit.prevent="handleSubmit">

            <!-- Asunto -->
            <div>
              <label for="subject" class="block text-sm font-medium text-gray-700 mb-1">
                Asunto <span class="text-red-500">*</span>
              </label>
              <select
                id="subject"
                v-model="form.subjectId"
                required
                class="input"
                :disabled="loadingSubjects"
              >
                <option value="" disabled>
                  {{ loadingSubjects ? 'Cargando asuntos...' : 'Selecciona un asunto' }}
                </option>
                <option
                  v-for="subject in subjects"
                  :key="subject.id"
                  :value="subject.id"
                >
                  {{ subject.name }}
                </option>
              </select>
              <p
                v-if="form.subjectId && subjects"
                class="mt-1.5 text-xs text-gray-500"
              >
                {{ subjects.find((s) => s.id === Number(form.subjectId))?.description }}
              </p>
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
                :readonly="isAuthenticated"
              />
              <p v-if="isAuthenticated" class="mt-1 text-xs text-gray-400">
                Usando el email de tu cuenta.
              </p>
            </div>

            <!-- Referencia de pedido (opcional, PS8) -->
            <div>
              <label for="orderReference" class="block text-sm font-medium text-gray-700 mb-1">
                Referencia del pedido
                <span class="text-gray-400 font-normal">(opcional)</span>
              </label>
              <select
                v-if="isAuthenticated && orders.length"
                id="orderReference"
                v-model="form.orderReference"
                class="input"
              >
                <option value="">Sin referencia de pedido</option>
                <option
                  v-for="order in orders"
                  :key="order.id"
                  :value="order.reference"
                >
                  {{ order.reference }} — {{ formatOrderDate(order.createdAt) }}
                </option>
              </select>
              <input
                v-else
                id="orderReference"
                v-model="form.orderReference"
                type="text"
                placeholder="Ej.: DEMO-XK7P2M9A"
                class="input"
              />
              <p class="mt-1 text-xs text-gray-400">
                Si tu consulta está relacionada con un pedido, indica su referencia.
              </p>
            </div>

            <!-- Mensaje -->
            <div>
              <label for="message" class="block text-sm font-medium text-gray-700 mb-1">
                Mensaje <span class="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                v-model="form.message"
                required
                rows="6"
                minlength="10"
                placeholder="Escribe tu consulta aquí..."
                class="input resize-y min-h-[140px]"
              />
              <p class="mt-1 text-xs text-gray-400">Mínimo 10 caracteres.</p>
            </div>

            <!-- Submit -->
            <button
              type="submit"
              class="btn-primary w-full sm:w-auto px-8 py-2.5"
              :disabled="isLoading || loadingSubjects"
            >
              <span v-if="isLoading">Enviando...</span>
              <span v-else>Enviar mensaje</span>
            </button>

          </form>
        </div>
      </div>

    </div>
  </div>
</template>
