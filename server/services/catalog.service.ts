import type { Product } from '~~/shared/types/product.types'
import type { Category, CategoryTree } from '~~/shared/types/category.types'
import type { PaginatedResult, ProductFilters } from '~~/shared/types/api.types'
import { CatalogAdapter } from '../adapters/prestashop/catalog.adapter'

export const CatalogService = {
  async getProducts(filters: ProductFilters): Promise<PaginatedResult<Product>> {
    return CatalogAdapter.fetchProducts(filters)
  },

  async getProductBySlug(slug: string): Promise<Product> {
    return CatalogAdapter.fetchProductBySlug(slug)
  },

  async getCategories(): Promise<Category[]> {
    return CatalogAdapter.fetchCategories()
  },

  async getCategoryTree(): Promise<CategoryTree[]> {
    return CatalogAdapter.fetchCategoryTree()
  },
}
