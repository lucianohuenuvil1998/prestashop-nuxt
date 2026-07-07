/**
 * Server Route: GET /api/products/:slug
 *
 * Responsabilidad: recibir la petición HTTP, extraer el parámetro de ruta,
 * delegar al ProductService y manejar el caso de recurso no encontrado.
 *
 * La conversión de "producto no encontrado" a error HTTP 404 es la única
 * lógica que vive aquí: es responsabilidad de la capa HTTP, no del servicio.
 */

import { defineEventHandler, getRouterParam, createError } from 'h3'
import { ProductService } from '../../services/product.service'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'El parámetro slug es requerido' })
  }

  const product = await ProductService.getProductBySlug(slug)

  if (!product) {
    throw createError({ statusCode: 404, statusMessage: `Producto "${slug}" no encontrado` })
  }

  return product
})
