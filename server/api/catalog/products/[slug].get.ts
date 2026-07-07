import { defineEventHandler, getRouterParam, createError } from 'h3'
import { CatalogService } from '../../../services/catalog.service'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Product slug is required' })
  }

  return CatalogService.getProductBySlug(slug)
})
