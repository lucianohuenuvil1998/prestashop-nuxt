/**
 * Servicio del dominio Category.
 *
 * En Phase 2 devuelve datos del mock.
 * En Phase 3 se conectará a CategoryAdapter → PrestaShop.
 */

import type { Category } from '~~/shared/types/category.types'
import { createError } from 'h3'
import { MOCK_CATEGORIES } from '../repositories/mock/categories.data'

export const CategoryService = {
  async getAll(): Promise<Category[]> {
    return MOCK_CATEGORIES
  },

  async getBySlug(slug: string): Promise<Category> {
    const category = MOCK_CATEGORIES.find((c) => c.slug === slug)

    if (!category) {
      throw createError({ statusCode: 404, statusMessage: 'Categoría no encontrada' })
    }

    return category
  },
}
