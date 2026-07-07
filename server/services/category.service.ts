/**
 * Servicio del dominio Category.
 *
 * En Phase 2 devuelve datos del mock.
 * En Phase 3 se conectará a CategoryAdapter → PrestaShop.
 */

import type { Category } from '~~/shared/types/category.types'
import { MOCK_CATEGORIES } from '../repositories/mock/categories.data'

export const CategoryService = {
  async getAll(): Promise<Category[]> {
    return MOCK_CATEGORIES
  },
}
