import type { Category } from '~~/shared/types/category.types'

export interface ICategoryRepository {
  findAll(): Promise<Category[]>
  findBySlug(slug: string): Promise<Category | null>
}
