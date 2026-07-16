import { defineEventHandler, readBody, createError } from 'h3'
import { haPost } from '../../lib/headlessapi/client'
import { mockAuthStore } from '../../repositories/mock/mock-auth.store'
import { validatePassword } from '~~/shared/validation/form.validation'

const useHeadlessApi = process.env.USE_PRESTASHOP === 'true'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ token?: string; password?: string }>(event)

  if (!body?.token) {
    throw createError({ statusCode: 400, statusMessage: 'Token de recuperación requerido' })
  }

  const passwordError = validatePassword(body.password ?? '')
  if (passwordError) {
    throw createError({ statusCode: 400, statusMessage: passwordError })
  }

  if (useHeadlessApi) {
    try {
      await haPost<unknown>('auth', 'resetPassword', { token: body.token, password: body.password })
      return { ok: true }
    }
    catch (e) {
      const msg = e instanceof Error ? e.message : 'Token inválido o expirado'
      throw createError({ statusCode: 400, statusMessage: msg })
    }
  }

  const ok = mockAuthStore.resetPassword(body.token, body.password!)
  if (!ok) {
    throw createError({ statusCode: 400, statusMessage: 'El enlace de recuperación no es válido o ya expiró' })
  }
  return { ok: true }
})
