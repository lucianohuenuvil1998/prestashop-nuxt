import { getCookie, setCookie, deleteCookie } from 'h3'
import type { H3Event } from 'h3'

const IS_PROD = process.env.NODE_ENV === 'production'

export function getCartId(event: H3Event): string | null {
  return getCookie(event, 'cart_id') ?? null
}

export function setCartId(event: H3Event, cartId: string): void {
  setCookie(event, 'cart_id', cartId, {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 días
  })
}

export function getAuthToken(event: H3Event): string | null {
  return getCookie(event, 'auth_token') ?? null
}

export function setAuthToken(event: H3Event, token: string): void {
  setCookie(event, 'auth_token', token, {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 días
  })
}

export function clearAuthToken(event: H3Event): void {
  deleteCookie(event, 'auth_token')
}

export function clearCartId(event: H3Event): void {
  deleteCookie(event, 'cart_id')
}
