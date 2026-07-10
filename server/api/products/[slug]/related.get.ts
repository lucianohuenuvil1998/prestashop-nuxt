import { defineEventHandler, getRouterParam } from 'h3'
import { ProductService } from '../../../services/product.service'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug') ?? ''
  return ProductService.getRelatedProducts(slug, 4)
})
