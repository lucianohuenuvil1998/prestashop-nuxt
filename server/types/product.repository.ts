/**
 * Contrato (interfaz) que define las operaciones de acceso a datos del dominio Product.
 *
 * Cualquier implementación concreta (Mock, PrestaShop, REST, base de datos)
 * debe cumplir este contrato. El resto del sistema depende únicamente de esta
 * interfaz, nunca de las implementaciones concretas.
 *
 * Principio: Dependency Inversion — los servicios dependen de abstracciones,
 * no de detalles de infraestructura.
 */

import type { Product } from '~~/shared/types/product.types'
import type { ProductFilters, PaginatedResult } from '~~/shared/types/api.types'

export interface IProductRepository {
  /**
   * Devuelve una lista paginada de productos aplicando los filtros recibidos.
   */
  findAll(filters: ProductFilters): Promise<PaginatedResult<Product>>

  /**
   * Devuelve un único producto por su ID numérico.
   * Retorna null si no existe.
   */
  findById(id: number): Promise<Product | null>

  /**
   * Devuelve un único producto por su slug URL-friendly.
   * Retorna null si no existe ningún producto con ese slug.
   */
  findBySlug(slug: string): Promise<Product | null>

  /**
   * Devuelve productos relacionados al dado (misma categoría, excluyendo el actual).
   */
  findRelated(slug: string, limit?: number): Promise<Product[]>
}
