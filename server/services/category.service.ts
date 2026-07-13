import type { Category } from '~~/shared/types/category.types'
import { createError } from 'h3'
import { categoryRepository } from '../repositories/index'

export const CategoryService = {
  async getAll(): Promise<Category[]> {
    return categoryRepository.findAll()
  },

  async getBySlug(slug: string): Promise<Category> {
    const category = await categoryRepository.findBySlug(slug)

    if (!category) {
      throw createError({ statusCode: 404, statusMessage: 'Categoría no encontrada' })
    }

    return category
  },
}
