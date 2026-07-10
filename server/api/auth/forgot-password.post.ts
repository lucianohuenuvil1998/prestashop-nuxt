/**
 * POST /api/auth/forgot-password
 *
 * Recibe un email y genera un token de reseteo de contraseña.
 * En producción (PS8): enviaría el link por email.
 * En mock: devuelve el token directamente para facilitar el desarrollo.
 */

import { defineEventHandler, readBody, createError } from 'h3'
import { mockAuthStore } from '../../repositories/mock/mock-auth.store'
import { validateEmail } from '~~/shared/validation/form.validation'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ email?: string }>(event)

  const emailError = validateEmail(body?.email ?? '')
  if (emailError) {
    throw createError({ statusCode: 400, statusMessage: emailError })
  }

  const email = body.email!.toLowerCase().trim()
  const token = mockAuthStore.createResetToken(email)

  // Siempre respondemos con éxito para no revelar si el email existe
  // En producción: si token !== null, llamar al servicio de email aquí
  return {
    ok: true,
    // Solo en desarrollo: exponemos el token para poder probar el flujo sin email
    ...(process.env.NODE_ENV !== 'production' && token ? { devToken: token } : {}),
  }
})
