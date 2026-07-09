export function formatPrice(amount: number, currency = 'USD', locale = 'es'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatDiscount(original: number, discounted: number): string {
  if (original <= 0) return '0%'
  const percent = Math.round(((original - discounted) / original) * 100)
  return `${percent}%`
}
