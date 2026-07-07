import type { Address } from './order.types'

export interface Customer {
  id: number
  email: string
  firstName: string
  lastName: string
  addresses: Address[]
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthSession {
  customerId: number
  email: string
  firstName: string
  lastName: string
  token: string
}
