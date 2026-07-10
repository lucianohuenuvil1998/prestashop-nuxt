/**
 * GET /api/auth/validate-reset-token?token=xxx
 *
 * Verifica si un token de reseteo es válido sin consumirlo.
 * Usado por la página de reset para mostrar el formulario o un error.
 */

import { defineEventHandler, getQuery } from 'h3'
import { mockAuthStore } from '../../repositories/mock/mock-auth.store'

export default defineEventHandler((event) => {
  const { token } = getQuery(event)
  const valid = typeof token === 'string' && mockAuthStore.isResetTokenValid(token)
  return { valid }
})
