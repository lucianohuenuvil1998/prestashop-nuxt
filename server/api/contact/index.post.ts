/**
 * POST /api/contact
 *
 * Envía un mensaje de contacto (mock: guarda en memoria).
 */

import { defineEventHandler, readBody, createError } from 'h3'
import { ContactService } from '../../services/contact.service'
import type { ContactFormPayload } from '~~/shared/types/contact.types'

export default defineEventHandler(async (event) => {
  const body = await readBody<ContactFormPayload>(event)

  if (!body) {
    throw createError({ statusCode: 400, statusMessage: 'Datos del formulario requeridos' })
  }

  return ContactService.submitMessage(body)
})
