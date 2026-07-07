import type { ProductFilters, PaginatedResult } from '~~/shared/types/api.types'
import type { Product } from '~~/shared/types/product.types'

export function useProducts(filters?: MaybeRef<ProductFilters>) {
  const filtersRef = computed(() => toValue(filters) ?? {})

  return useAsyncData<PaginatedResult<Product>>(
    `products-${JSON.stringify(toValue(filtersRef))}`,
    () => $fetch('/api/products', { query: toValue(filtersRef) }),
    { watch: [filtersRef] },
  )
}
