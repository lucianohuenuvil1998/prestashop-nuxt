import type { Product } from '~~/shared/types/product.types'
import type { Category, CategoryTree } from '~~/shared/types/category.types'
import type { PaginatedResult, ProductFilters } from '~~/shared/types/api.types'
import { PrestashopClient } from './prestashop.client'
import { toPaginatedProducts, toProduct } from './mappers/product.mapper'
import type { PSPaginatedResponse, PSProductResponse, PSCategoryResponse } from './prestashop.types'

export const CatalogAdapter = {
  async fetchProducts(filters: ProductFilters): Promise<PaginatedResult<Product>> {
    const raw = await PrestashopClient.get<PSPaginatedResponse<PSProductResponse>>('/products', {
      id_category: filters.categoryId,
      q: filters.search,
      page: filters.page ?? 1,
      limit: filters.perPage ?? 24,
      order: filters.sort,
      price_min: filters.minPrice,
      price_max: filters.maxPrice,
    })
    return toPaginatedProducts(raw)
  },

  async fetchProductBySlug(slug: string): Promise<Product> {
    const raw = await PrestashopClient.get<PSProductResponse>(`/products/${slug}`)
    return toProduct(raw)
  },

  async fetchCategories(): Promise<Category[]> {
    const raw = await PrestashopClient.get<PSCategoryResponse[]>('/categories')
    return raw.map(toCategoryDomain)
  },

  async fetchCategoryTree(): Promise<CategoryTree[]> {
    const raw = await PrestashopClient.get<PSCategoryResponse[]>('/categories/tree')
    return raw.map(toCategoryTreeDomain)
  },
}

function toCategoryDomain(raw: PSCategoryResponse): Category {
  return {
    id: raw.id_category,
    name: raw.name,
    slug: raw.link_rewrite,
    description: raw.description,
    parentId: raw.id_parent,
    image: raw.image,
    position: raw.position,
  }
}

function toCategoryTreeDomain(raw: PSCategoryResponse): CategoryTree {
  return {
    ...toCategoryDomain(raw),
    children: (raw.children ?? []).map(toCategoryTreeDomain),
  }
}
