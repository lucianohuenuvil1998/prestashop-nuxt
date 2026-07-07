import { defineEventHandler, getQuery } from 'h3'
import { CatalogService } from '../../services/catalog.service'
import type { ProductFilters } from '~~/shared/types/api.types'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const filters: ProductFilters = {
    categoryId: query.categoryId ? Number(query.categoryId) : undefined,
    search: query.search ? String(query.search) : undefined,
    page: query.page ? Number(query.page) : 1,
    perPage: query.perPage ? Number(query.perPage) : 24,
    sort: query.sort as ProductFilters['sort'] | undefined,
    minPrice: query.minPrice ? Number(query.minPrice) : undefined,
    maxPrice: query.maxPrice ? Number(query.maxPrice) : undefined,
  }

  return CatalogService.getProducts(filters)
})
