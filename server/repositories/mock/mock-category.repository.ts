import type { ICategoryRepository } from '../../types/category.repository'
import type { Category } from '~~/shared/types/category.types'
import { MOCK_CATEGORIES } from './categories.data'

export class MockCategoryRepository implements ICategoryRepository {
  async findAll(): Promise<Category[]> {
    return MOCK_CATEGORIES
  }

  async findBySlug(slug: string): Promise<Category | null> {
    return MOCK_CATEGORIES.find(c => c.slug === slug) ?? null
  }
}
