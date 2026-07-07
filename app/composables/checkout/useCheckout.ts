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
import type { Order } from '~~/shared/types/order.types'
import { useCartStore } from '../../stores/cart.store'
import { useAuthStore } from '../../stores/auth.store'

export function useCheckout() {
  const cartStore = useCartStore()
  const authStore = useAuthStore()
  const router = useRouter()

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

  // ─── Selecciones ─────────────────────────────────────────────────────────
  const selectedShippingId = ref<number | null>(null)
  const selectedPaymentId = ref<string | null>(null)

  // ─── Datos remotos ───────────────────────────────────────────────────────
  const { data: summary, pending: loadingSummary } = useAsyncData<CheckoutSummary>(
    'checkout-summary',
    () => $fetch('/api/checkout/summary'),
  )

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
  function validateCurrentStep(): string | null {
    if (step.value === 1) {
      if (!address.firstName.trim()) return 'El nombre es requerido'
      if (!address.lastName.trim()) return 'El apellido es requerido'
      if (!address.address1.trim()) return 'La dirección es requerida'
      if (!address.city.trim()) return 'La ciudad es requerida'
      if (!address.postcode.trim()) return 'El código postal es requerido'
    }
    if (step.value === 2) {
      if (!selectedShippingId.value) return 'Selecciona un método de envío'
    }
    if (step.value === 3) {
      if (!selectedPaymentId.value) return 'Selecciona un método de pago'
    }
    return null
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
    const error = validateCurrentStep()
    if (error) {
      stepError.value = error
      return
    }

    isPlacingOrder.value = true
    stepError.value = null

    try {
      const order = await $fetch<Order>('/api/checkout/order', {
        method: 'POST',
        body: {
          shippingMethodId: selectedShippingId.value,
          paymentMethodId: selectedPaymentId.value,
          shippingAddressId: 1,
          billingAddressId: 1,
        },
      })

      // El servidor ya limpió la cookie — resetear el store del cliente
      cartStore.clearCart()

      await router.push(
        `/checkout/confirmation?reference=${order.reference}&total=${order.totals.total}&currency=${order.totals.currency}&payment=${selectedPaymentId.value}`,
      )
    }
    catch {
      stepError.value = 'Error al procesar el pedido. Por favor, intenta nuevamente.'
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
    // Address
    address,
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
