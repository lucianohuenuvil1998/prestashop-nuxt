export function formatPrice(amount: number, currency = 'CLP', locale = 'es-CL'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDiscount(original: number, discounted: number): string {
  if (original <= 0) return '0%'
  const percent = Math.round(((original - discounted) / original) * 100)
  return `${percent}%`
}
