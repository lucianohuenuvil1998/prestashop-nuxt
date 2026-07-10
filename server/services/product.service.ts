/**
 * Servicio del dominio Product.
 *
 * Responsabilidad: contener toda la lógica de negocio relacionada con productos.
 * Orquesta las operaciones del repositorio y aplica reglas de dominio.
 *
 * Este servicio:
 * - No conoce HTTP (no usa H3, no lanza createError).
 * - No conoce la fuente de datos (depende de IProductRepository, no de MockProductRepository).
 * - Es el punto donde se añadirá lógica de negocio futura (reglas de visibilidad,
 *   enriquecimiento de datos, caching, etc.).
 *
 * La dependencia al repositorio llega a través del proveedor (server/repositories/index.ts),
 * lo que garantiza que cambiar la implementación de datos no requiere tocar este archivo.
 */

import type { Product } from '~~/shared/types/product.types'
import type { ProductFilters, PaginatedResult } from '~~/shared/types/api.types'
import { productRepository } from '../repositories'

export const ProductService = {
  /**
   * Retorna una lista paginada de productos disponibles aplicando los filtros recibidos.
   * Solo se exponen productos marcados como disponibles (isAvailable === true).
   */
  async getProducts(filters: ProductFilters): Promise<PaginatedResult<Product>> {
    const result = await productRepository.findAll(filters)

    return {
      ...result,
      items: result.items.filter((p) => p.isAvailable),
    }
  },

  /**
   * Retorna un producto por su slug.
   * Retorna null si el producto no existe o no está disponible.
   */
  async getProductBySlug(slug: string): Promise<Product | null> {
    const product = await productRepository.findBySlug(slug)

    if (!product || !product.isAvailable) return null

    return product
  },

  async getRelatedProducts(slug: string, limit = 4): Promise<Product[]> {
    return productRepository.findRelated(slug, limit)
  },
}
