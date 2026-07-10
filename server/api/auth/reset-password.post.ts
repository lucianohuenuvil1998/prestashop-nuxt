/**
 * POST /api/auth/reset-password
 *
 * Valida el token de reseteo y actualiza la contraseña del usuario.
 */

import { defineEventHandler, readBody, createError } from 'h3'
import { mockAuthStore } from '../../repositories/mock/mock-auth.store'
import { validatePassword } from '~~/shared/validation/form.validation'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ token?: string; password?: string }>(event)

  if (!body?.token) {
    throw createError({ statusCode: 400, statusMessage: 'Token de recuperación requerido' })
  }

  const passwordError = validatePassword(body.password ?? '')
  if (passwordError) {
    throw createError({ statusCode: 400, statusMessage: passwordError })
  }

  const ok = mockAuthStore.resetPassword(body.token, body.password!)

  if (!ok) {
    throw createError({
      statusCode: 400,
      statusMessage: 'El enlace de recuperación no es válido o ya expiró',
    })
  }

  return { ok: true }
})
