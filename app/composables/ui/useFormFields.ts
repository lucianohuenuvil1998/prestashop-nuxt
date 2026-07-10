/**
 * Helpers reactivos para restricciones de entrada en formularios.
 */

import {
  clampField,
  FIELD_LIMITS,
  sanitizePersonName,
  sanitizePhone,
  sanitizePostcode,
} from '~~/shared/validation/form.validation'

export function useFormFields() {
  function limitPersonName(value: string, max = FIELD_LIMITS.firstName): string {
    return sanitizePersonName(value, max)
  }

  function limitPhone(value: string): string {
    return sanitizePhone(value)
  }

  function limitPostcode(value: string): string {
    return sanitizePostcode(value)
  }

  function limitText(value: string, max: number): string {
    return clampField(value, max)
  }

  return {
    FIELD_LIMITS,
    limitPersonName,
    limitPhone,
    limitPostcode,
    limitText,
  }
}
