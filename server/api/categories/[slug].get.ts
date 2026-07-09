/**
 * GET /api/categories/:slug
 *
 * Devuelve el detalle de una categoría por su slug.
 */

import { defineEventHandler, getRouterParam, createError } from 'h3'
import { CategoryService } from '../../services/category.service'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Slug requerido' })
  }

  return CategoryService.getBySlug(slug)
})
