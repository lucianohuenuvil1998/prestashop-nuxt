import { defineEventHandler, readBody, createError } from 'h3'
import { haPost } from '../../lib/headlessapi/client'
import { mockAuthStore } from '../../repositories/mock/mock-auth.store'
import { validateEmail } from '~~/shared/validation/form.validation'

const useHeadlessApi = process.env.USE_PRESTASHOP === 'true'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ email?: string }>(event)

  const emailError = validateEmail(body?.email ?? '')
  if (emailError) {
    throw createError({ statusCode: 400, statusMessage: emailError })
  }

  const email = body.email!.toLowerCase().trim()

  if (useHeadlessApi) {
    try {
      await haPost<unknown>('auth', 'forgotPassword', { email })
    }
    catch {
      // Silencioso: no revelamos si el email existe
    }
    return { ok: true }
  }

  const token = mockAuthStore.createResetToken(email)
  return {
    ok: true,
    ...(process.env.NODE_ENV !== 'production' && token ? { devToken: token } : {}),
  }
})
