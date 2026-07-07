/**
 * Servicio del dominio Auth.
 *
 * Phase 2: usa credenciales simuladas.
 * Phase 3: reemplazar el bloque MOCK por llamadas a AuthAdapter → PrestashopClient.
 *
 * Credenciales de prueba:
 *   Email:    cliente@test.com
 *   Password: password123
 */

import type { Customer, AuthSession, LoginCredentials } from '~~/shared/types/customer.types'
import { createError } from 'h3'

// ─── Mock ─────────────────────────────────────────────────────────────────────
const MOCK_TOKEN = 'mock-auth-token-phase2'

const MOCK_SESSION: AuthSession = {
  customerId: 1,
  email: 'cliente@test.com',
  firstName: 'María',
  lastName: 'González',
  token: MOCK_TOKEN,
}

const MOCK_CUSTOMER: Customer = {
  id: 1,
  email: MOCK_SESSION.email,
  firstName: MOCK_SESSION.firstName,
  lastName: MOCK_SESSION.lastName,
  addresses: [
    {
      id: 1,
      alias: 'Casa',
      firstName: MOCK_SESSION.firstName,
      lastName: MOCK_SESSION.lastName,
      company: null,
      address1: 'Av. Corrientes 1234',
      address2: null,
      city: 'Buenos Aires',
      state: 'Buenos Aires',
      postcode: 'C1043',
      country: 'Argentina',
      countryCode: 'AR',
      phone: '+54 11 1234-5678',
    },
  ],
}
// ─────────────────────────────────────────────────────────────────────────────

export const AuthService = {
  async login(credentials: LoginCredentials): Promise<AuthSession> {
    if (
      credentials.email !== MOCK_SESSION.email ||
      credentials.password !== 'password123'
    ) {
      throw createError({ statusCode: 401, statusMessage: 'Email o contraseña incorrectos' })
    }
    return MOCK_SESSION
  },

  async logout(_token: string): Promise<void> {
    // Phase 3: invalidar token en PS
  },

  async getCurrentCustomer(token: string): Promise<Customer> {
    if (token !== MOCK_TOKEN) {
      throw createError({ statusCode: 401, statusMessage: 'Sesión inválida o expirada' })
    }
    return MOCK_CUSTOMER
  },
}
