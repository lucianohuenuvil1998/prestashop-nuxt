import type { Customer, AuthSession, LoginCredentials } from '~~/shared/types/customer.types'
import { PrestashopClient } from './prestashop.client'
import type { PSAuthResponse, PSCustomerResponse } from './prestashop.types'

function toAuthSession(raw: PSAuthResponse): AuthSession {
  return {
    customerId: raw.customer.id_customer,
    email: raw.customer.email,
    firstName: raw.customer.firstname,
    lastName: raw.customer.lastname,
    token: raw.token,
  }
}

function toCustomer(raw: PSCustomerResponse): Customer {
  return {
    id: raw.id_customer,
    email: raw.email,
    firstName: raw.firstname,
    lastName: raw.lastname,
    addresses: [],
  }
}

export const AuthAdapter = {
  async login(credentials: LoginCredentials): Promise<AuthSession> {
    const raw = await PrestashopClient.post<PSAuthResponse>('/auth/login', credentials)
    return toAuthSession(raw)
  },

  async logout(token: string): Promise<void> {
    await PrestashopClient.post('/auth/logout', { token })
  },

  async fetchCurrentCustomer(token: string): Promise<Customer> {
    const raw = await PrestashopClient.get<PSCustomerResponse>('/auth/me', { token })
    return toCustomer(raw)
  },
}
