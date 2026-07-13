/**
 * Validaciones de formularios compartidas (cliente + servidor).
 * Límites pensados para uso real en tienda (más estrictos que la BD de PS8).
 */

import type { AddressInput, RegisterPayload, UpdateProfilePayload } from '../types/customer.types'
import type { CheckoutAddressInput } from '../types/checkout.types'
import type { ContactFormPayload } from '../types/contact.types'

export const FIELD_LIMITS = {
  firstName: 20,
  lastName: 20,
  email: 48,
  passwordMin: 8,
  passwordMax: 32,
  alias: 20,
  company: 40,
  address1: 80,
  address2: 40,
  city: 30,
  state: 30,
  postcode: 10,
  phone: 20,
  messageMin: 10,
  messageMax: 1000,
  orderReference: 16,
  search: 100,
} as const

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
const PERSON_NAME_REGEX = /^[\p{L}\s'-]+$/u
const POSTCODE_REGEX = /^[a-zA-Z0-9\s-]+$/
const ORDER_REFERENCE_REGEX = /^[a-zA-Z0-9-]+$/
const PHONE_INVALID_CHARS_REGEX = /[^\d+\s()-]/

function trim(value: string | undefined | null): string {
  return value?.trim() ?? ''
}

function hasMinDigits(value: string, min: number): boolean {
  return value.replace(/\D/g, '').length >= min
}

export function clampField(value: string, max: number): string {
  return value.slice(0, max)
}

export function sanitizePhone(value: string): string {
  return value.replace(/[^\d+\s()-]/g, '').slice(0, FIELD_LIMITS.phone)
}

export function sanitizePersonName(value: string, max = FIELD_LIMITS.firstName): string {
  return value.replace(/[^\p{L}\s'-]/gu, '').slice(0, max)
}

export function sanitizePostcode(value: string): string {
  return value.replace(/[^a-zA-Z0-9\s-]/g, '').slice(0, FIELD_LIMITS.postcode)
}

export function isValidEmail(value: string): boolean {
  const email = trim(value).toLowerCase()
  if (!email || email.length > FIELD_LIMITS.email) return false
  return EMAIL_REGEX.test(email)
}

export function validateEmail(value: string, label = 'El correo electrónico'): string | null {
  const email = trim(value)
  if (!email) return `${label} es requerido`
  if (email.length > FIELD_LIMITS.email) return `${label} es demasiado largo`
  if (!isValidEmail(email)) return `${label} no es válido`
  return null
}

export function validatePersonName(value: string, label: string, max = FIELD_LIMITS.firstName): string | null {
  const name = trim(value)
  if (!name) return `${label} es requerido`
  if (name.length > max) return `${label} no puede superar ${max} caracteres`
  if (!PERSON_NAME_REGEX.test(name)) return `${label} solo puede contener letras, espacios, guiones y apóstrofes`
  return null
}

export function validatePhone(value: string | undefined, required = false): string | null {
  const phone = trim(value)
  if (!phone) return required ? 'El teléfono es requerido' : null
  if (phone.length > FIELD_LIMITS.phone) return `El teléfono no puede superar ${FIELD_LIMITS.phone} caracteres`
  if (PHONE_INVALID_CHARS_REGEX.test(phone)) return 'El teléfono solo puede contener números, espacios y los símbolos + - ( )'
  if (!hasMinDigits(phone, 7)) return 'El teléfono debe tener al menos 7 dígitos'
  return null
}

export function validatePostcode(value: string): string | null {
  const postcode = trim(value)
  if (!postcode) return 'El código postal es requerido'
  if (postcode.length > FIELD_LIMITS.postcode) return `El código postal no puede superar ${FIELD_LIMITS.postcode} caracteres`
  if (!POSTCODE_REGEX.test(postcode)) return 'El código postal solo puede contener letras, números, espacios y guiones'
  return null
}

export function validateRequiredText(
  value: string | undefined,
  label: string,
  max: number,
): string | null {
  const text = trim(value)
  if (!text) return `${label} es requerido`
  if (text.length > max) return `${label} no puede superar ${max} caracteres`
  return null
}

export function validateBirthDate(value: string | undefined): string | null {
  if (!value?.trim()) return null

  const date = new Date(value)
  if (isNaN(date.getTime())) return 'La fecha de nacimiento no es válida'

  const today = new Date()
  const minAge = 16
  const maxAge = 120

  const age = today.getFullYear() - date.getFullYear()
    - (today < new Date(today.getFullYear(), date.getMonth(), date.getDate()) ? 1 : 0)

  if (date > today) return 'La fecha de nacimiento no puede ser futura'
  if (age < minAge) return `Debes tener al menos ${minAge} años para registrarte`
  if (age > maxAge) return 'La fecha de nacimiento no es válida'

  return null
}

export function validatePassword(value: string, label = 'La contraseña'): string | null {
  if (!value) return `${label} es requerida`
  if (value.length < FIELD_LIMITS.passwordMin) return `${label} debe tener al menos ${FIELD_LIMITS.passwordMin} caracteres`
  if (value.length > FIELD_LIMITS.passwordMax) return `${label} no puede superar ${FIELD_LIMITS.passwordMax} caracteres`
  return null
}

export function validateAddressFields(input: {
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
}): string | null {
  return validateRequiredText(input.alias, 'El alias', FIELD_LIMITS.alias)
    ?? validatePersonName(input.firstName, 'El nombre')
    ?? validatePersonName(input.lastName, 'El apellido', FIELD_LIMITS.lastName)
    ?? (input.company?.trim()
      ? validateRequiredText(input.company, 'La empresa', FIELD_LIMITS.company)
      : null)
    ?? validateRequiredText(input.address1, 'La dirección', FIELD_LIMITS.address1)
    ?? (input.address2?.trim()
      ? validateRequiredText(input.address2, 'La dirección complementaria', FIELD_LIMITS.address2)
      : null)
    ?? validateRequiredText(input.city, 'La ciudad', FIELD_LIMITS.city)
    ?? (input.state?.trim()
      ? validateRequiredText(input.state, 'La provincia', FIELD_LIMITS.state)
      : null)
    ?? validatePostcode(input.postcode)
    ?? validateRequiredText(input.country, 'El país', 64)
    ?? validatePhone(input.phone)
}

export function validateAddressInput(input: AddressInput): string | null {
  return validateAddressFields(input)
}

export function validateCheckoutAddress(input: Partial<CheckoutAddressInput>): string | null {
  return validatePersonName(input.firstName ?? '', 'El nombre')
    ?? validatePersonName(input.lastName ?? '', 'El apellido', FIELD_LIMITS.lastName)
    ?? (input.company?.trim()
      ? validateRequiredText(input.company, 'La empresa', FIELD_LIMITS.company)
      : null)
    ?? validateRequiredText(input.address1 ?? '', 'La dirección', FIELD_LIMITS.address1)
    ?? (input.address2?.trim()
      ? validateRequiredText(input.address2, 'La dirección complementaria', FIELD_LIMITS.address2)
      : null)
    ?? validateRequiredText(input.city ?? '', 'La ciudad', FIELD_LIMITS.city)
    ?? (input.state?.trim()
      ? validateRequiredText(input.state, 'La provincia', FIELD_LIMITS.state)
      : null)
    ?? validatePostcode(input.postcode ?? '')
    ?? validateRequiredText(input.country ?? '', 'El país', 64)
    ?? validatePhone(input.phone)
}

export function validateRegisterPayload(payload: RegisterPayload): string | null {
  return validatePersonName(payload.firstName ?? '', 'El nombre')
    ?? validatePersonName(payload.lastName ?? '', 'El apellido', FIELD_LIMITS.lastName)
    ?? validateEmail(payload.email ?? '')
    ?? validatePassword(payload.password ?? '')
    ?? validateBirthDate(payload.birthDate)
}

export function validateProfilePayload(payload: UpdateProfilePayload): string | null {
  return validatePersonName(payload.firstName, 'El nombre')
    ?? validatePersonName(payload.lastName, 'El apellido')
    ?? validateEmail(payload.email)
}

export function validateContactPayload(payload: ContactFormPayload): string | null {
  if (!payload.subjectId) return 'Selecciona un asunto'
  return validateEmail(payload.email)
    ?? validateRequiredText(payload.message, 'El mensaje', FIELD_LIMITS.messageMax)
    ?? (trim(payload.message).length < FIELD_LIMITS.messageMin
      ? `El mensaje debe tener al menos ${FIELD_LIMITS.messageMin} caracteres`
      : null)
    ?? (payload.orderReference?.trim()
      ? (
        payload.orderReference.trim().length > FIELD_LIMITS.orderReference
          ? 'La referencia del pedido es demasiado larga'
          : !ORDER_REFERENCE_REGEX.test(payload.orderReference.trim())
            ? 'La referencia del pedido solo puede contener letras, números y guiones'
            : null
      )
      : null)
}
