<script setup lang="ts">
import type { CartTotals } from '~~/shared/types/cart.types'
import { formatPrice } from '../../utils/currency'

defineProps<{ totals: CartTotals }>()
</script>

<template>
  <div class="space-y-2 text-sm">
    <div class="flex justify-between text-gray-600">
      <span>Subtotal</span>
      <span>{{ formatPrice(totals.subtotal, totals.currency) }}</span>
    </div>

    <div class="flex justify-between text-gray-400">
      <span>Envío</span>
      <span class="italic">Calculado en el checkout</span>
    </div>

    <div v-if="totals.discount > 0" class="flex justify-between text-green-700">
      <span>Descuento</span>
      <span>-{{ formatPrice(totals.discount, totals.currency) }}</span>
    </div>

    <div class="flex justify-between border-t border-gray-200 pt-3 font-semibold text-gray-900">
      <span>Total</span>
      <span class="text-base">{{ formatPrice(totals.total, totals.currency) }}</span>
    </div>
  </div>
</template>
