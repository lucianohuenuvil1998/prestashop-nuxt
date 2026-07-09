import type { Address } from './order.types'

export interface Customer {
  id: number
  email: string
  firstName: string
  lastName: string
  addresses: Address[]
}

/** Perfil completo del cliente (Mis datos personales — PS8). */
export interface CustomerProfile extends Customer {
  civility?: string
  birthDate?: string | null
  newsletter: boolean
  partnerOffers: boolean
}

export interface UpdateProfilePayload {
  civility?: string
  firstName: string
  lastName: string
  email: string
  birthDate?: string
  newsletter?: boolean
  partnerOffers?: boolean
}

export interface UpdatePasswordPayload {
  currentPassword: string
  newPassword: string
}

/** Payload para crear o editar una dirección (PS8). */
export interface AddressInput {
  alias: string
  firstName: string
  lastName: string
  company?: string
  address1: string
  address2?: string
  city: string
  state?: string
  postcode: string
  country: string
  phone?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

/** Payload de registro alineado con el formulario de PrestaShop 8. */
export interface RegisterPayload {
  civility?: string
  firstName: string
  lastName: string
  email: string
  password: string
  birthDate?: string
  newsletter?: boolean
  partnerOffers?: boolean
}

export interface AuthSession {
  customerId: number
  email: string
  firstName: string
  lastName: string
  token: string
}
