import type { Category } from '~~/shared/types/category.types'

export function useCategory(slug: MaybeRefOrGetter<string>) {
  return useAsyncData<Category>(
    () => `category-${toValue(slug)}`,
    () => $fetch(`/api/categories/${toValue(slug)}`),
    { watch: [() => toValue(slug)] },
  )
}
