/**
 * Servicio del dominio Auth.
 *
 * Phase 2: usa mockAuthStore en memoria.
 * Phase 3: reemplazar por llamadas a AuthAdapter → PrestashopClient.
 *
 * Credenciales de prueba:
 *   Email:    cliente@test.com
 *   Password: password123
 *
 * Nota: register() aún no está en este servicio.
 *       POST /api/auth/register usa mockAuthStore directamente.
 */

import type { Customer, AuthSession, LoginCredentials } from '~~/shared/types/customer.types'
import { createError } from 'h3'
import { mockAuthStore } from '../repositories/mock/mock-auth.store'

export const AuthService = {
  async login(credentials: LoginCredentials): Promise<AuthSession> {
    const session = mockAuthStore.login(credentials)

    if (!session) {
      throw createError({ statusCode: 401, statusMessage: 'Email o contraseña incorrectos' })
    }

    return session
  },

  async logout(_token: string): Promise<void> {
    // Phase 3: invalidar token en PS
  },

  async getCurrentCustomer(token: string): Promise<Customer> {
    const customer = mockAuthStore.getByToken(token)

    if (!customer) {
      throw createError({ statusCode: 401, statusMessage: 'Sesión inválida o expirada' })
    }

    return customer
  },
}
