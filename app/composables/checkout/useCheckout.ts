/**
 * useCheckout — orquesta el flujo de checkout en 3 pasos:
 *   1. Dirección de entrega
 *   2. Método de envío
 *   3. Método de pago + confirmación
 *
 * Gestiona el estado del formulario, validaciones por paso
 * y la llamada final para crear el pedido.
 */

import type { CheckoutSummary, ShippingMethod, CheckoutAddressInput } from '~~/shared/types/checkout.types'
import type { AddressInput } from '~~/shared/types/customer.types'
import type { Address } from '~~/shared/types/order.types'
import type { Order } from '~~/shared/types/order.types'
import { validateCheckoutAddress, validateEmail, FIELD_LIMITS } from '~~/shared/validation/form.validation'
import { useCartStore } from '../../stores/cart.store'
import { useAuthStore } from '../../stores/auth.store'

export function useCheckout() {
  const cartStore = useCartStore()
  const authStore = useAuthStore()
  // ─── Estado del stepper ──────────────────────────────────────────────────
  const step = ref<1 | 2 | 3>(1)
  const isPlacingOrder = ref(false)
  const stepError = ref<string | null>(null)

  // ─── Formulario de dirección ─────────────────────────────────────────────
  const address = reactive<CheckoutAddressInput>({
    firstName: authStore.customer?.firstName ?? '',
    lastName: authStore.customer?.lastName ?? '',
    company: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postcode: '',
    country: 'Argentina',
    phone: '',
  })

  const isGuest = computed(() => !authStore.isAuthenticated)
  const guestEmail = ref('')

  const selectedAddressId = ref<number | null>(null)
  const useNewAddress = ref(false)

  // ─── Selecciones ─────────────────────────────────────────────────────────
  const selectedShippingId = ref<number | null>(null)
  const selectedPaymentId = ref<string | null>(null)

  // ─── Datos remotos ───────────────────────────────────────────────────────
  const { data: summary, pending: loadingSummary } = useAsyncData<CheckoutSummary>(
    'checkout-summary',
    () => $fetch('/api/checkout/summary'),
  )

  const { data: savedAddresses, pending: loadingAddresses } = useAsyncData<Address[]>(
    'checkout-addresses',
    () => authStore.isAuthenticated ? $fetch('/api/account/addresses') : Promise.resolve([]),
  )

  function applyAddress(addr: Address): void {
    address.firstName = addr.firstName
    address.lastName = addr.lastName
    address.company = addr.company ?? ''
    address.address1 = addr.address1
    address.address2 = addr.address2 ?? ''
    address.city = addr.city
    address.state = addr.state ?? ''
    address.postcode = addr.postcode
    address.country = addr.country
    address.phone = addr.phone ?? ''
  }

  function selectSavedAddress(id: number): void {
    useNewAddress.value = false
    selectedAddressId.value = id
    const found = savedAddresses.value?.find((a) => a.id === id)
    if (found) applyAddress(found)
  }

  function enableNewAddress(): void {
    useNewAddress.value = true
    selectedAddressId.value = null
    address.firstName = authStore.customer?.firstName ?? ''
    address.lastName = authStore.customer?.lastName ?? ''
    address.company = ''
    address.address1 = ''
    address.address2 = ''
    address.city = ''
    address.state = ''
    address.postcode = ''
    address.country = 'Argentina'
    address.phone = ''
  }

  watch(savedAddresses, (addresses) => {
    if (!addresses?.length || useNewAddress.value || selectedAddressId.value) return
    selectSavedAddress(addresses[0].id)
  }, { immediate: true })

  const selectedSavedAddress = computed<Address | null>(() => {
    if (!selectedAddressId.value || useNewAddress.value) return null
    return savedAddresses.value?.find((a) => a.id === selectedAddressId.value) ?? null
  })

  function addressToInput(addr: CheckoutAddressInput): AddressInput {
    const alias = addr.address1.trim().slice(0, FIELD_LIMITS.alias) || 'Entrega'
    return {
      alias,
      firstName: addr.firstName.trim(),
      lastName: addr.lastName.trim(),
      company: addr.company?.trim() || undefined,
      address1: addr.address1.trim(),
      address2: addr.address2?.trim() || undefined,
      city: addr.city.trim(),
      state: addr.state?.trim() || undefined,
      postcode: addr.postcode.trim(),
      country: addr.country.trim(),
      phone: addr.phone?.trim() || undefined,
    }
  }

  // ─── Computed ────────────────────────────────────────────────────────────
  const selectedShipping = computed<ShippingMethod | null>(() => {
    if (!summary.value || !selectedShippingId.value) return null
    return summary.value.shippingMethods.find((m) => m.id === selectedShippingId.value) ?? null
  })

  const orderTotal = computed<number>(() => {
    const subtotal = cartStore.total
    const shipping = selectedShipping.value?.price ?? 0
    return Math.round((subtotal + shipping) * 100) / 100
  })

  // ─── Validaciones ────────────────────────────────────────────────────────
  function validateStep(target: 1 | 2 | 3): string | null {
    if (target === 1) {
      if (isGuest.value) {
        const emailErr = validateEmail(guestEmail.value, 'El correo de contacto')
        if (emailErr) return emailErr
        return validateCheckoutAddress(address)
      }
      if (!useNewAddress.value && selectedAddressId.value) return null
      return validateCheckoutAddress(address)
    }
    if (target === 2) {
      if (!selectedShippingId.value) return 'Selecciona un método de envío'
    }
    if (target === 3) {
      if (!selectedPaymentId.value) return 'Selecciona un método de pago'
    }
    return null
  }

  function validateCurrentStep(): string | null {
    return validateStep(step.value)
  }

  function validateAllSteps(): string | null {
    for (const target of [1, 2, 3] as const) {
      const error = validateStep(target)
      if (error) return error
    }
    return null
  }

  function getFetchErrorMessage(err: unknown, fallback: string): string {
    if (err && typeof err === 'object') {
      const fetchErr = err as {
        data?: { statusMessage?: string, message?: string }
        statusMessage?: string
        message?: string
      }
      return fetchErr.data?.statusMessage
        ?? fetchErr.data?.message
        ?? fetchErr.statusMessage
        ?? fetchErr.message
        ?? fallback
    }
    return fallback
  }

  // ─── Navegación ──────────────────────────────────────────────────────────
  function nextStep(): void {
    const error = validateCurrentStep()
    if (error) {
      stepError.value = error
      return
    }
    stepError.value = null
    if (step.value < 3) step.value = (step.value + 1) as 1 | 2 | 3
  }

  function goToStep(target: 1 | 2 | 3): void {
    if (target < step.value) {
      stepError.value = null
      step.value = target
    }
  }

  function prevStep(): void {
    stepError.value = null
    if (step.value > 1) step.value = (step.value - 1) as 1 | 2 | 3
  }

  // ─── Confirmación ────────────────────────────────────────────────────────
  async function placeOrder(): Promise<void> {
    const error = validateAllSteps()
    if (error) {
      stepError.value = error
      return
    }

    isPlacingOrder.value = true
    stepError.value = null

    try {
      let orderBody: Record<string, unknown>

      if (isGuest.value) {
        orderBody = {
          shippingMethodId: selectedShippingId.value!,
          paymentMethodId: selectedPaymentId.value!,
          guestEmail: guestEmail.value,
          guestAddress: {
            firstName: address.firstName,
            lastName: address.lastName,
            company: address.company || undefined,
            address1: address.address1,
            address2: address.address2 || undefined,
            city: address.city,
            state: address.state || undefined,
            postcode: address.postcode,
            country: address.country,
            phone: address.phone || undefined,
          },
        }
      }
      else {
        let shippingAddressId = selectedAddressId.value
        let billingAddressId = selectedAddressId.value

        if (useNewAddress.value || !shippingAddressId) {
          const created = await $fetch<Address>('/api/account/addresses', {
            method: 'POST',
            body: addressToInput(address),
          })
          shippingAddressId = created.id
          billingAddressId = created.id
          selectedAddressId.value = created.id
          useNewAddress.value = false
        }

        orderBody = {
          shippingMethodId: selectedShippingId.value!,
          paymentMethodId: selectedPaymentId.value!,
          shippingAddressId: shippingAddressId!,
          billingAddressId: billingAddressId!,
        }
      }

      const order = await $fetch<Order>('/api/checkout/order', {
        method: 'POST',
        body: orderBody,
      })

      const confirmationQuery = {
        reference: order.reference,
        total: String(order.totals.total),
        currency: order.totals.currency,
        payment: selectedPaymentId.value!,
      }

      try {
        await navigateTo({ path: '/checkout/confirmation', query: confirmationQuery }, { replace: true })
      }
      catch {
        const params = new URLSearchParams(confirmationQuery)
        window.location.assign(`/checkout/confirmation?${params.toString()}`)
      }

      // El servidor ya limpió la cookie — resetear el store del cliente
      cartStore.clearCart()
    }
    catch (err) {
      stepError.value = getFetchErrorMessage(
        err,
        'Error al procesar el pedido. Por favor, intenta nuevamente.',
      )
    }
    finally {
      isPlacingOrder.value = false
    }
  }

  return {
    // Stepper
    step: readonly(step),
    stepError: readonly(stepError),
    isPlacingOrder: readonly(isPlacingOrder),
    nextStep,
    prevStep,
    goToStep,
    // Guest
    isGuest,
    guestEmail,
    // Address
    address,
    savedAddresses: readonly(savedAddresses),
    loadingAddresses: readonly(loadingAddresses),
    selectedAddressId: readonly(selectedAddressId),
    selectedSavedAddress,
    useNewAddress: readonly(useNewAddress),
    selectSavedAddress,
    enableNewAddress,
    // Checkout options
    selectedShippingId,
    selectedPaymentId,
    summary: readonly(summary),
    loadingSummary: readonly(loadingSummary),
    selectedShipping,
    // Totals
    orderTotal,
    cartSubtotal: computed(() => cartStore.total),
    currency: computed(() => cartStore.currency),
    // Cart
    cart: computed(() => cartStore.cart),
    isEmpty: computed(() => cartStore.isEmpty),
    // Actions
    placeOrder,
  }
}
