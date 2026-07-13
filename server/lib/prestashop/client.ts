/**
 * Cliente HTTP para el WebService REST de PrestaShop 8.
 *
 * Toda comunicación con PS pasa por aquí. Usa la API Key con Basic Auth
 * (contraseña vacía, solo la key como usuario), exclusivamente server-side.
 *
 * Docs: https://devdocs.prestashop-project.org/8/webservice/
 */

import { useRuntimeConfig } from '#imports'
import { $fetch } from 'ofetch'

export interface PsRequestOptions {
  params?: Record<string, string | number | boolean>
  body?: unknown
}

function getConfig() {
  const config = useRuntimeConfig()
  const baseUrl = config.prestashop.baseUrl
  const apiKey = config.prestashop.apiKey

  if (!baseUrl || !apiKey) {
    throw new Error(
      'PrestaShop no está configurado. Verifica NUXT_PRESTASHOP_BASE_URL y NUXT_PRESTASHOP_API_KEY en tu .env',
    )
  }

  return { baseUrl: baseUrl.replace(/\/$/, ''), apiKey }
}

function buildAuthHeader(apiKey: string): Record<string, string> {
  const encoded = btoa(`${apiKey}:`)
  return { Authorization: `Basic ${encoded}` }
}

const DEFAULT_PARAMS = { output_format: 'JSON' }

export async function psGet<T>(
  resource: string,
  options: PsRequestOptions = {},
): Promise<T> {
  const { baseUrl, apiKey } = getConfig()
  return $fetch<T>(`${baseUrl}/api/${resource}`, {
    headers: buildAuthHeader(apiKey),
    params: { ...DEFAULT_PARAMS, ...options.params },
  })
}

/**
 * POST con cuerpo XML — PS WS solo acepta XML para escritura.
 * La respuesta sigue siendo JSON (output_format=JSON).
 */
export async function psPost<T>(
  resource: string,
  xmlBody: string,
): Promise<T> {
  const { baseUrl, apiKey } = getConfig()
  return $fetch<T>(`${baseUrl}/api/${resource}`, {
    method: 'POST',
    headers: { ...buildAuthHeader(apiKey), 'Content-Type': 'text/xml' },
    params: DEFAULT_PARAMS,
    body: xmlBody,
  })
}

/**
 * PUT con cuerpo XML — PS WS solo acepta XML para escritura.
 */
export async function psPut<T>(
  resource: string,
  xmlBody: string,
): Promise<T> {
  const { baseUrl, apiKey } = getConfig()
  return $fetch<T>(`${baseUrl}/api/${resource}`, {
    method: 'PUT',
    headers: { ...buildAuthHeader(apiKey), 'Content-Type': 'text/xml' },
    params: DEFAULT_PARAMS,
    body: xmlBody,
  })
}

export async function psDelete(resource: string): Promise<void> {
  const { baseUrl, apiKey } = getConfig()
  await $fetch(`${baseUrl}/api/${resource}`, {
    method: 'DELETE',
    headers: buildAuthHeader(apiKey),
    params: DEFAULT_PARAMS,
  })
}

// ─── XML Builder ──────────────────────────────────────────────────────────────

/**
 * Serializa un objeto plano a XML con el wrapper de PS WebService.
 *
 * PS solo acepta XML en POST/PUT. Los campos escalares se envuelven en CDATA.
 * Las asociaciones tienen una estructura especial con nodeType y api attributes.
 *
 * Uso:
 *   buildPsXml('cart', { id_currency: 1, id_lang: 1 })
 *   buildPsXml('cart', { id: 5, associations: { cart_rows: [...] } })
 */
export function buildPsXml(
  resource: string,
  data: Record<string, unknown>,
): string {
  const inner = serializeFields(data)
  return `<?xml version="1.0" encoding="UTF-8"?>\n<prestashop xmlns:xlink="http://www.w3.org/1999/xlink">\n  <${resource}>\n${inner}  </${resource}>\n</prestashop>`
}

function serializeFields(data: Record<string, unknown>, indent = '    '): string {
  return Object.entries(data).map(([key, value]) => {
    if (key === 'associations' && value && typeof value === 'object') {
      return serializeAssociations(value as Record<string, unknown[]>, indent)
    }
    if (value === null || value === undefined) return `${indent}<${key}></${key}>`
    return `${indent}<${key}><![CDATA[${value}]]></${key}>`
  }).join('\n') + '\n'
}

function serializeAssociations(assocs: Record<string, unknown[]>, indent: string): string {
  const inner = Object.entries(assocs).map(([key, items]) => {
    // cart_rows → cart_row (singular: quitar la 's' final si aplica)
    const nodeType = key.endsWith('s') ? key.slice(0, -1) : key
    const rows = (items ?? []).map((item) => {
      const fields = Object.entries(item as Record<string, unknown>)
        .map(([k, v]) => `${indent}      <${k}><![CDATA[${v}]]></${k}>`)
        .join('\n')
      return `${indent}    <${nodeType}>\n${fields}\n${indent}    </${nodeType}>`
    }).join('\n')
    return `${indent}  <${key} nodeType="${nodeType}" api="${key}">\n${rows}\n${indent}  </${key}>`
  }).join('\n')
  return `${indent}<associations>\n${inner}\n${indent}</associations>`
}

/**
 * Construye la URL pública de una imagen de producto de PS.
 * PS sirve imágenes en: /api/images/products/{productId}/{imageId}
 */
export function psImageUrl(productId: number, imageId: number): string {
  const { baseUrl, apiKey } = getConfig()
  // Las imágenes requieren auth también
  const encoded = btoa(`${apiKey}:`)
  return `${baseUrl}/api/images/products/${productId}/${imageId}?ws_key=${apiKey}`
}
