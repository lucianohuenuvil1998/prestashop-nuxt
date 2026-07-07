import { defineEventHandler, getRequestURL, createError } from 'h3'
import { getAuthToken } from '../utils/session'

const PROTECTED_PREFIXES = ['/api/checkout', '/api/account', '/api/auth/me']

export default defineEventHandler((event) => {
  const { pathname } = getRequestURL(event)

  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix))
  if (!isProtected) return

  const token = getAuthToken(event)

  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
})
