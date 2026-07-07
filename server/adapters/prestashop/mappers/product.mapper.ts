import type { Product, ProductImage, ProductCategory, ProductVariant, StockInfo } from '~~/shared/types/product.types'
import type { PaginatedResult } from '~~/shared/types/api.types'
import type {
  PSProductResponse,
  PSPaginatedResponse,
  PSImageResponse,
  PSCategoryLightResponse,
  PSCombinationResponse,
} from '../prestashop.types'

function toStockInfo(quantity: number, outOfStock: number): StockInfo {
  return {
    quantity,
    isInStock: quantity > 0 || outOfStock === 1,
  }
}

function toImage(raw: PSImageResponse): ProductImage {
  return {
    id: raw.id_image,
    url: raw.src,
    alt: raw.legend,
    position: raw.position,
  }
}

function toCategory(raw: PSCategoryLightResponse): ProductCategory {
  return {
    id: raw.id_category,
    name: raw.name,
    slug: raw.link_rewrite,
  }
}

function toVariant(raw: PSCombinationResponse, parentStock: StockInfo): ProductVariant {
  return {
    id: raw.id_product_attribute,
    attributes: Object.fromEntries(
      raw.attributes.map((a) => [a.group_name, a.attribute_name]),
    ),
    price: parseFloat(raw.price),
    sku: raw.reference,
    stock: raw.quantity >= 0 ? { quantity: raw.quantity, isInStock: raw.quantity > 0 } : parentStock,
  }
}

export function toProduct(raw: PSProductResponse): Product {
  const stock = toStockInfo(raw.quantity, raw.out_of_stock)

  return {
    id: raw.id,
    slug: raw.link_rewrite,
    name: raw.name,
    description: raw.description,
    shortDescription: raw.description_short,
    price: parseFloat(raw.price),
    regularPrice: parseFloat(raw.price_without_reduction),
    currency: String(raw.id_currency),
    images: raw.images.map(toImage),
    categories: raw.categories.map(toCategory),
    variants: raw.combinations.map((c) => toVariant(c, stock)),
    stock,
    sku: raw.reference,
    isAvailable: raw.active === 1,
    createdAt: raw.date_add,
    updatedAt: raw.date_upd,
  }
}

export function toPaginatedProducts(raw: PSPaginatedResponse<PSProductResponse>): PaginatedResult<Product> {
  return {
    items: raw.data.map(toProduct),
    total: raw.total,
    page: raw.page,
    perPage: raw.limit,
    totalPages: Math.ceil(raw.total / raw.limit),
  }
}
