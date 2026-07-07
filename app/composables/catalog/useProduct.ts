import type { Product } from '~~/shared/types/product.types'

export function useProduct(slug: MaybeRef<string>) {
  return useAsyncData<Product>(
    `product-${toValue(slug)}`,
    () => $fetch(`/api/products/${toValue(slug)}`),
  )
}
