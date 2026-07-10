<script setup lang="ts">
import type { AddressInput } from '~~/shared/types/customer.types'
import { validateAddressInput } from '~~/shared/validation/form.validation'

const props = defineProps<{
  initial?: Partial<AddressInput>
  submitLabel?: string
  isLoading?: boolean
}>()

const emit = defineEmits<{
  submit: [payload: AddressInput]
}>()

const { COUNTRIES } = useAddresses()
const { FIELD_LIMITS, limitPersonName, limitPhone, limitPostcode, limitText } = useFormFields()

const form = reactive<AddressInput>({
  alias: props.initial?.alias ?? '',
  firstName: props.initial?.firstName ?? '',
  lastName: props.initial?.lastName ?? '',
  company: props.initial?.company ?? '',
  address1: props.initial?.address1 ?? '',
  address2: props.initial?.address2 ?? '',
  city: props.initial?.city ?? '',
  state: props.initial?.state ?? '',
  postcode: props.initial?.postcode ?? '',
  country: props.initial?.country ?? 'Argentina',
  phone: props.initial?.phone ?? '',
})

const formError = ref('')

watch(() => props.initial, (value) => {
  if (!value) return
  form.alias = value.alias ?? ''
  form.firstName = value.firstName ?? ''
  form.lastName = value.lastName ?? ''
  form.company = value.company ?? ''
  form.address1 = value.address1 ?? ''
  form.address2 = value.address2 ?? ''
  form.city = value.city ?? ''
  form.state = value.state ?? ''
  form.postcode = value.postcode ?? ''
  form.country = value.country ?? 'Argentina'
  form.phone = value.phone ?? ''
}, { deep: true })

function handleSubmit() {
  formError.value = ''

  const payload: AddressInput = {
    alias: form.alias.trim(),
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    company: form.company?.trim() || undefined,
    address1: form.address1.trim(),
    address2: form.address2?.trim() || undefined,
    city: form.city.trim(),
    state: form.state?.trim() || undefined,
    postcode: form.postcode.trim(),
    country: form.country.trim(),
    phone: form.phone?.trim() || undefined,
  }

  const error = validateAddressInput(payload)
  if (error) {
    formError.value = error
    return
  }

  emit('submit', payload)
}
</script>

<template>
  <form class="space-y-5" @submit.prevent="handleSubmit">
    <div
      v-if="formError"
      class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ formError }}
    </div>

    <div>
      <label for="alias" class="block text-sm font-medium text-gray-700 mb-1">
        Alias <span class="text-red-500">*</span>
      </label>
      <input
        id="alias"
        v-model="form.alias"
        type="text"
        required
        placeholder="Casa, Oficina..."
        class="input"
        :maxlength="FIELD_LIMITS.alias"
        @input="form.alias = limitText(form.alias, FIELD_LIMITS.alias)"
      />
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">
          Nombre <span class="text-red-500">*</span>
        </label>
        <input
          id="firstName"
          v-model="form.firstName"
          type="text"
          required
          class="input"
          :maxlength="FIELD_LIMITS.firstName"
          @input="form.firstName = limitPersonName(form.firstName, FIELD_LIMITS.firstName)"
        />
      </div>
      <div>
        <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">
          Apellidos <span class="text-red-500">*</span>
        </label>
        <input
          id="lastName"
          v-model="form.lastName"
          type="text"
          required
          class="input"
          :maxlength="FIELD_LIMITS.lastName"
          @input="form.lastName = limitPersonName(form.lastName, FIELD_LIMITS.lastName)"
        />
      </div>
    </div>

    <div>
      <label for="company" class="block text-sm font-medium text-gray-700 mb-1">
        Empresa <span class="text-gray-400 font-normal">(opcional)</span>
      </label>
      <input
        id="company"
        v-model="form.company"
        type="text"
        class="input"
        :maxlength="FIELD_LIMITS.company"
        @input="form.company = limitText(form.company ?? '', FIELD_LIMITS.company)"
      />
    </div>

    <div>
      <label for="address1" class="block text-sm font-medium text-gray-700 mb-1">
        Dirección <span class="text-red-500">*</span>
      </label>
      <input
        id="address1"
        v-model="form.address1"
        type="text"
        required
        class="input"
        :maxlength="FIELD_LIMITS.address1"
        @input="form.address1 = limitText(form.address1, FIELD_LIMITS.address1)"
      />
    </div>

    <div>
      <label for="address2" class="block text-sm font-medium text-gray-700 mb-1">
        Dirección complementaria <span class="text-gray-400 font-normal">(opcional)</span>
      </label>
      <input
        id="address2"
        v-model="form.address2"
        type="text"
        class="input"
        :maxlength="FIELD_LIMITS.address2"
        @input="form.address2 = limitText(form.address2 ?? '', FIELD_LIMITS.address2)"
      />
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label for="postcode" class="block text-sm font-medium text-gray-700 mb-1">
          Código postal <span class="text-red-500">*</span>
        </label>
        <input
          id="postcode"
          v-model="form.postcode"
          type="text"
          required
          class="input"
          :maxlength="FIELD_LIMITS.postcode"
          @input="form.postcode = limitPostcode(form.postcode)"
        />
      </div>
      <div>
        <label for="city" class="block text-sm font-medium text-gray-700 mb-1">
          Ciudad <span class="text-red-500">*</span>
        </label>
        <input
          id="city"
          v-model="form.city"
          type="text"
          required
          class="input"
          :maxlength="FIELD_LIMITS.city"
          @input="form.city = limitText(form.city, FIELD_LIMITS.city)"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label for="state" class="block text-sm font-medium text-gray-700 mb-1">
          Provincia / Estado
        </label>
        <input
          id="state"
          v-model="form.state"
          type="text"
          class="input"
          :maxlength="FIELD_LIMITS.state"
          @input="form.state = limitText(form.state ?? '', FIELD_LIMITS.state)"
        />
      </div>
      <div>
        <label for="country" class="block text-sm font-medium text-gray-700 mb-1">
          País <span class="text-red-500">*</span>
        </label>
        <select id="country" v-model="form.country" required class="input">
          <option v-for="country in COUNTRIES" :key="country" :value="country">
            {{ country }}
          </option>
        </select>
      </div>
    </div>

    <div>
      <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">
        Teléfono <span class="text-gray-400 font-normal">(opcional)</span>
      </label>
      <input
        id="phone"
        v-model="form.phone"
        type="tel"
        inputmode="tel"
        autocomplete="tel"
        placeholder="+54 11 1234-5678"
        class="input"
        :maxlength="FIELD_LIMITS.phone"
        @input="form.phone = limitPhone(form.phone ?? '')"
      />
      <p class="mt-1 text-xs text-gray-400">Solo números y los símbolos + - ( ). Mínimo 7 dígitos si lo completas.</p>
    </div>

    <button type="submit" class="btn-primary px-8 py-2.5" :disabled="isLoading">
      {{ isLoading ? 'Guardando...' : (submitLabel ?? 'Guardar') }}
    </button>
  </form>
</template>
