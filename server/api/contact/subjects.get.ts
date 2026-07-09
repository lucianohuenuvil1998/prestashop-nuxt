/**
 * GET /api/contact/subjects
 *
 * Devuelve los asuntos disponibles para el formulario de contacto.
 */

import { defineEventHandler } from 'h3'
import { ContactService } from '../../services/contact.service'

export default defineEventHandler(async () => {
  return ContactService.getSubjects()
})
