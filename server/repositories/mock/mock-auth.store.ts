/**
 * Almacenamiento en memoria para autenticación mock.
 *
 * Usado directamente por POST /api/auth/register mientras AuthService.register
 * no esté implementado. AuthService.login y getCurrentCustomer también leen
 * desde aquí para que los usuarios registrados puedan iniciar sesión.
 *
 * Al integrar PrestaShop 8, reemplazar por PrestashopAuthRepository.
 */

import type { Customer, CustomerProfile, AuthSession, LoginCredentials, RegisterPayload, UpdateProfilePayload, UpdatePasswordPayload, AddressInput } from '~~/shared/types/customer.types'
import type { Address } from '~~/shared/types/order.types'

interface StoredCustomer {
  id: number
  email: string
  firstName: string
  lastName: string
  password: string
  civility?: string
  birthDate?: string
  newsletter: boolean
  partnerOffers: boolean
  token: string
  addresses: Customer['addresses']
}

const customersByEmail = new Map<string, StoredCustomer>()
const customersByToken = new Map<string, StoredCustomer>()

let nextId = 2
let nextAddressId = 2

const COUNTRY_CODES: Record<string, string> = {
  Argentina: 'AR',
  Chile: 'CL',
  Uruguay: 'UY',
  Paraguay: 'PY',
  Bolivia: 'BO',
  Perú: 'PE',
  Colombia: 'CO',
  México: 'MX',
  España: 'ES',
}

function toAddress(input: AddressInput, id: number): Address {
  return {
    id,
    alias: input.alias.trim(),
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    company: input.company?.trim() || null,
    address1: input.address1.trim(),
    address2: input.address2?.trim() || null,
    city: input.city.trim(),
    state: input.state?.trim() || null,
    postcode: input.postcode.trim(),
    country: input.country.trim(),
    countryCode: COUNTRY_CODES[input.country.trim()] ?? 'XX',
    phone: input.phone?.trim() || null,
  }
}

function cloneAddresses(addresses: Address[]): Address[] {
  return JSON.parse(JSON.stringify(addresses)) as Address[]
}

// Usuario demo precargado (Phase 2)
const DEMO_CUSTOMER: StoredCustomer = {
  id: 1,
  email: 'cliente@test.com',
  firstName: 'María',
  lastName: 'González',
  password: 'password123',
  civility: '2',
  birthDate: '1990-05-15',
  newsletter: true,
  partnerOffers: false,
  token: 'mock-auth-token-phase2',
  addresses: [
    {
      id: 1,
      alias: 'Casa',
      firstName: 'María',
      lastName: 'González',
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

customersByEmail.set(DEMO_CUSTOMER.email, DEMO_CUSTOMER)
customersByToken.set(DEMO_CUSTOMER.token, DEMO_CUSTOMER)

function toCustomer(stored: StoredCustomer): Customer {
  return {
    id: stored.id,
    email: stored.email,
    firstName: stored.firstName,
    lastName: stored.lastName,
    addresses: stored.addresses,
  }
}

function toSession(stored: StoredCustomer): AuthSession {
  return {
    customerId: stored.id,
    email: stored.email,
    firstName: stored.firstName,
    lastName: stored.lastName,
    token: stored.token,
  }
}

function generateToken(): string {
  return `mock-token-${crypto.randomUUID()}`
}

function toProfile(stored: StoredCustomer): CustomerProfile {
  return {
    id: stored.id,
    email: stored.email,
    firstName: stored.firstName,
    lastName: stored.lastName,
    addresses: stored.addresses,
    civility: stored.civility,
    birthDate: stored.birthDate ?? null,
    newsletter: stored.newsletter,
    partnerOffers: stored.partnerOffers,
  }
}

function getStoredByToken(token: string): StoredCustomer | null {
  return customersByToken.get(token) ?? null
}

export const mockAuthStore = {
  emailExists(email: string): boolean {
    return customersByEmail.has(email.toLowerCase().trim())
  },

  register(payload: RegisterPayload): AuthSession {
    const email = payload.email.toLowerCase().trim()
    const token = generateToken()

    const customer: StoredCustomer = {
      id: nextId++,
      email,
      firstName: payload.firstName.trim(),
      lastName: payload.lastName.trim(),
      password: payload.password,
      civility: payload.civility,
      birthDate: payload.birthDate,
      newsletter: payload.newsletter ?? false,
      partnerOffers: payload.partnerOffers ?? false,
      token,
      addresses: [],
    }

    customersByEmail.set(email, customer)
    customersByToken.set(token, customer)

    return toSession(customer)
  },

  login(credentials: LoginCredentials): AuthSession | null {
    const stored = customersByEmail.get(credentials.email.toLowerCase().trim())
    if (!stored || stored.password !== credentials.password) return null
    return toSession(stored)
  },

  getByToken(token: string): Customer | null {
    const stored = customersByToken.get(token)
    return stored ? toCustomer(stored) : null
  },

  getProfileByToken(token: string): CustomerProfile | null {
    const stored = getStoredByToken(token)
    return stored ? toProfile(stored) : null
  },

  updateProfile(token: string, payload: UpdateProfilePayload): CustomerProfile {
    const stored = getStoredByToken(token)
    if (!stored) throw new Error('Sesión no encontrada')

    const newEmail = payload.email.toLowerCase().trim()

    if (newEmail !== stored.email && customersByEmail.has(newEmail)) {
      throw new Error('Ya existe una cuenta con este email')
    }

    if (newEmail !== stored.email) {
      customersByEmail.delete(stored.email)
      stored.email = newEmail
      customersByEmail.set(newEmail, stored)
    }

    stored.civility = payload.civility
    stored.firstName = payload.firstName.trim()
    stored.lastName = payload.lastName.trim()
    stored.birthDate = payload.birthDate || undefined
    stored.newsletter = payload.newsletter ?? false
    stored.partnerOffers = payload.partnerOffers ?? false

    return toProfile(stored)
  },

  updatePassword(token: string, payload: UpdatePasswordPayload): void {
    const stored = getStoredByToken(token)
    if (!stored) throw new Error('Sesión no encontrada')

    if (stored.password !== payload.currentPassword) {
      throw new Error('La contraseña actual no es correcta')
    }

    if (payload.newPassword.length < 8) {
      throw new Error('La nueva contraseña debe tener al menos 8 caracteres')
    }

    stored.password = payload.newPassword
  },

  getAddresses(token: string): Address[] {
    const stored = getStoredByToken(token)
    return stored ? cloneAddresses(stored.addresses) : []
  },

  addAddress(token: string, input: AddressInput): Address {
    const stored = getStoredByToken(token)
    if (!stored) throw new Error('Sesión no encontrada')

    const address = toAddress(input, nextAddressId++)
    stored.addresses.push(address)
    return { ...address }
  },

  updateAddress(token: string, addressId: number, input: AddressInput): Address {
    const stored = getStoredByToken(token)
    if (!stored) throw new Error('Sesión no encontrada')

    const idx = stored.addresses.findIndex((a) => a.id === addressId)
    if (idx < 0) throw new Error('Dirección no encontrada')

    const updated = toAddress(input, addressId)
    stored.addresses[idx] = updated
    return { ...updated }
  },

  deleteAddress(token: string, addressId: number): void {
    const stored = getStoredByToken(token)
    if (!stored) throw new Error('Sesión no encontrada')

    const before = stored.addresses.length
    stored.addresses = stored.addresses.filter((a) => a.id !== addressId)
    if (stored.addresses.length === before) throw new Error('Dirección no encontrada')
  },
}
