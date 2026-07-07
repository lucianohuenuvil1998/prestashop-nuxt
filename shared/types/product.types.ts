export interface Product {
  id: number
  slug: string
  name: string
  description: string
  shortDescription: string
  price: number
  regularPrice: number
  currency: string
  images: ProductImage[]
  categories: ProductCategory[]
  variants: ProductVariant[]
  stock: StockInfo
  sku: string
  isAvailable: boolean
  createdAt: string
  updatedAt: string
}

export interface ProductImage {
  id: number
  url: string
  alt: string
  position: number
}

export interface ProductCategory {
  id: number
  name: string
  slug: string
}

export interface ProductVariant {
  id: number
  attributes: Record<string, string>
  price: number
  sku: string
  stock: StockInfo
}

export interface StockInfo {
  quantity: number
  isInStock: boolean
}
