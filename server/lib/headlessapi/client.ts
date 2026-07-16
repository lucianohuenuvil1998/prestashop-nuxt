/**
 * Cliente HTTP para el módulo headlessapi de PrestaShop.
 *
 * URL pattern: ?resource=<r>&action=<a>[&id=<n>]
 */

import { useRuntimeConfig } from '#imports'

interface HaResponse<T> {
  success: boolean
  data?: T
  message?: string
}

type QueryParams = Record<string, string | number>

function getBaseUrl(): string {
  const url = useRuntimeConfig().headlessApi?.url
  if (!url) throw new Error('NUXT_HEADLESS_API_URL no está configurado en .env')
  return url
}

function buildQuery(resource: string, action: string, extra: QueryParams = {}): string {
  const params: QueryParams = { resource, action, ...extra }
  return new URLSearchParams(
    Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
  ).toString()
}

function authHeader(token?: string): Record<string, string> {
  return token ? { Authorization: `Bearer ${token}` } : {}
}

function unwrap<T>(res: HaResponse<T>): T {
  if (!res.success) throw new Error(res.message ?? 'Error del módulo headlessapi')
  return res.data as T
}

/** GET — sin body. */
export async function haGet<T>(resource: string, action: string, token?: string, extra: QueryParams = {}): Promise<T> {
  const res = await $fetch<HaResponse<T>>(`${getBaseUrl()}?${buildQuery(resource, action, extra)}`, {
    headers: authHeader(token),
  })
  return unwrap(res)
}

/** POST/PUT con body JSON. */
export async function haPost<T>(
  resource: string,
  action: string,
  body: unknown,
  token?: string,
  method: 'POST' | 'PUT' = 'POST',
  extra: QueryParams = {},
): Promise<T> {
  const res = await $fetch<HaResponse<T>>(`${getBaseUrl()}?${buildQuery(resource, action, extra)}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...authHeader(token) },
    body,
  })
  return unwrap(res)
}

/** PUT shorthand. */
export async function haPut<T>(resource: string, action: string, body: unknown, token?: string, extra: QueryParams = {}): Promise<T> {
  return haPost<T>(resource, action, body, token, 'PUT', extra)
}

/** DELETE — sin body, con query params opcionales. */
export async function haDelete<T>(resource: string, action: string, token?: string, extra: QueryParams = {}): Promise<T> {
  const res = await $fetch<HaResponse<T>>(`${getBaseUrl()}?${buildQuery(resource, action, extra)}`, {
    method: 'DELETE',
    headers: authHeader(token),
  })
  return unwrap(res)
}
