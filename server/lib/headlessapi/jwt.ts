/**
 * Verificador JWT en Node.js sin dependencias externas.
 * Usa el módulo nativo `crypto` de Node — misma lógica que el JWT.php del módulo.
 */

import { createHmac } from 'node:crypto'
import { useRuntimeConfig } from '#imports'

export interface JwtPayload {
  sub: number
  email: string
  firstName: string
  lastName: string
  iat: number
  exp: number
}

function base64urlDecode(str: string): string {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)
  return Buffer.from(padded, 'base64').toString('utf8')
}

function base64urlEncode(buf: Buffer): string {
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

/** Verifica y decodifica un JWT firmado por el módulo PHP. */
export function verifyJwt(token: string): JwtPayload {
  const secret = useRuntimeConfig().headlessApi?.jwtSecret
  if (!secret) throw new Error('NUXT_HEADLESS_JWT_SECRET no está configurado')

  const parts = token.split('.')
  if (parts.length !== 3) throw new Error('Token malformado')

  const [header, payload, sig] = parts as [string, string, string]

  const expectedSig = base64urlEncode(
    createHmac('sha256', secret).update(`${header}.${payload}`).digest(),
  )

  if (expectedSig !== sig) throw new Error('Firma inválida')

  const data = JSON.parse(base64urlDecode(payload)) as JwtPayload

  if (data.exp < Math.floor(Date.now() / 1000)) {
    throw new Error('Token expirado')
  }

  return data
}

/** Retorna el payload sin lanzar excepción — útil para rutas opcionales. */
export function tryVerifyJwt(token: string): JwtPayload | null {
  try {
    return verifyJwt(token)
  }
  catch {
    return null
  }
}
