import type { Category } from '~~/shared/types/category.types'

export function useCategories() {
  return useAsyncData<Category[]>('categories', () => $fetch('/api/categories'))
}
