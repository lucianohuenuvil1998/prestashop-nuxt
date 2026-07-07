import { createError } from 'h3'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

interface RequestOptions {
  query?: Record<string, unknown>
  body?: unknown
}

async function request<T>(method: HttpMethod, path: string, options: RequestOptions = {}): Promise<T> {
  const config = useRuntimeConfig()

  const { baseUrl, apiKey } = config.prestashop

  if (!baseUrl) {
    throw createError({ statusCode: 503, statusMessage: 'PrestaShop base URL is not configured' })
  }

  return $fetch<T>(path, {
    baseURL: baseUrl,
    method,
    query: options.query,
    body: options.body,
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    onResponseError({ response }) {
      throw createError({
        statusCode: response.status,
        statusMessage: `PrestaShop error: ${response.statusText}`,
      })
    },
  })
}

export const PrestashopClient = {
  get<T>(path: string, query?: Record<string, unknown>): Promise<T> {
    return request<T>('GET', path, { query })
  },

  post<T>(path: string, body?: unknown): Promise<T> {
    return request<T>('POST', path, { body })
  },

  put<T>(path: string, body?: unknown): Promise<T> {
    return request<T>('PUT', path, { body })
  },

  delete<T>(path: string): Promise<T> {
    return request<T>('DELETE', path)
  },
}
