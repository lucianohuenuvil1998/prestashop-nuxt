/**
 * Server Route: GET /api/products
 *
 * Responsabilidad: recibir la petición HTTP, extraer y tipar los parámetros
 * de la query string, delegar al ProductService y devolver la respuesta.
 *
 * No contiene lógica de negocio. Si la lógica crece, pertenece al servicio.
 */

import { defineEventHandler, getQuery } from 'h3'
import { ProductService } from '../services/product.service'
import type { ProductFilters } from '~~/shared/types/api.types'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const filters: ProductFilters = {
    search: query.search ? String(query.search) : undefined,
    categoryId: query.categoryId ? Number(query.categoryId) : undefined,
    page: query.page ? Number(query.page) : 1,
    perPage: query.perPage ? Number(query.perPage) : 24,
    sort: query.sort as ProductFilters['sort'] | undefined,
    minPrice: query.minPrice ? Number(query.minPrice) : undefined,
    maxPrice: query.maxPrice ? Number(query.maxPrice) : undefined,
  }

  return ProductService.getProducts(filters)
})
