/**
 * Implementación simulada de IProductRepository.
 *
 * Responsabilidad: devolver datos del dominio Product desde el array
 * estático definido en products.data.ts, aplicando filtrado y paginación
 * en memoria.
 *
 * Esta clase es la única que debe reemplazarse cuando se integre PrestaShop:
 * se creará PrestashopProductRepository con la misma interfaz y se
 * intercambiará en server/repositories/index.ts sin tocar nada más.
 */

import type { IProductRepository } from '../../types/product.repository'
import type { Product } from '~~/shared/types/product.types'
import type { ProductFilters, PaginatedResult } from '~~/shared/types/api.types'
import { MOCK_PRODUCTS } from './products.data'

export class MockProductRepository implements IProductRepository {
  async findAll(filters: ProductFilters): Promise<PaginatedResult<Product>> {
    let results = [...MOCK_PRODUCTS]

    results = this.applySearch(results, filters.search)
    results = this.applyCategoryFilter(results, filters.categoryId)
    results = this.applyPriceFilter(results, filters.minPrice, filters.maxPrice)
    results = this.applySort(results, filters.sort)

    return this.paginate(results, filters.page ?? 1, filters.perPage ?? 24)
  }

  async findBySlug(slug: string): Promise<Product | null> {
    return MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null
  }

  async findRelated(slug: string, limit = 4): Promise<Product[]> {
    const current = MOCK_PRODUCTS.find((p) => p.slug === slug)
    if (!current) return []

    const categoryIds = new Set(current.categories.map((c) => c.id))

    return MOCK_PRODUCTS
      .filter(
        (p) => p.slug !== slug
          && p.isAvailable
          && p.categories.some((c) => categoryIds.has(c.id)),
      )
      .slice(0, limit)
  }

  // ─── Filtros privados ─────────────────────────────────────────────────────

  private applySearch(products: Product[], search?: string): Product[] {
    if (!search) return products
    const term = search.toLowerCase()
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.shortDescription.toLowerCase().includes(term),
    )
  }

  private applyCategoryFilter(products: Product[], categoryId?: number): Product[] {
    if (!categoryId) return products
    return products.filter((p) => p.categories.some((c) => c.id === categoryId))
  }

  private applyPriceFilter(products: Product[], min?: number, max?: number): Product[] {
    let result = products
    if (min !== undefined) result = result.filter((p) => p.price >= min)
    if (max !== undefined) result = result.filter((p) => p.price <= max)
    return result
  }

  private applySort(products: Product[], sort?: ProductFilters['sort']): Product[] {
    const sorted = [...products]
    switch (sort) {
      case 'price_asc':
        return sorted.sort((a, b) => a.price - b.price)
      case 'price_desc':
        return sorted.sort((a, b) => b.price - a.price)
      case 'name_asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name))
      case 'name_desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name))
      case 'newest':
        return sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      default:
        return sorted
    }
  }

  private paginate(
    products: Product[],
    page: number,
    perPage: number,
  ): PaginatedResult<Product> {
    const total = products.length
    const totalPages = Math.ceil(total / perPage)
    const start = (page - 1) * perPage
    const items = products.slice(start, start + perPage)

    return { items, total, page, perPage, totalPages }
  }
}
