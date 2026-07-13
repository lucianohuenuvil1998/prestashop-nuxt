/**
 * Implementación de ICategoryRepository para PrestaShop 8.
 *
 * Excluye las categorías raíz (id 1 = Root, id 2 = Home) que PS crea por defecto
 * y que no deben mostrarse en el frontend.
 */

import type { ICategoryRepository } from '../../types/category.repository'
import type { Category } from '~~/shared/types/category.types'
import { psGet } from '../../lib/prestashop/client'
import { transformCategory } from '../../lib/prestashop/transformers'
import type { PsCategoryListResponse, PsCategoryDetailResponse } from '../../lib/prestashop/types'

// PS siempre tiene al menos Home (id=1) y una raíz (id=2), las excluimos
const EXCLUDED_IDS = new Set([1, 2])

export class PsCategoryRepository implements ICategoryRepository {
  async findAll(): Promise<Category[]> {
    const res = await psGet<PsCategoryListResponse>('categories', {
      params: { display: 'full', 'filter[active]': 1 },
    })

    return (res.categories ?? [])
      .filter(cat => !EXCLUDED_IDS.has(cat.id))
      .map(cat => transformCategory(cat, true))
      .sort((a, b) => a.position - b.position)
  }

  async findBySlug(slug: string): Promise<Category | null> {
    const res = await psGet<PsCategoryListResponse>('categories', {
      params: {
        display: 'full',
        'filter[link_rewrite]': slug,
        'filter[active]': 1,
      },
    })

    const ps = res.categories?.[0]
    if (!ps || EXCLUDED_IDS.has(ps.id)) return null

    return transformCategory(ps, true)
  }
}
