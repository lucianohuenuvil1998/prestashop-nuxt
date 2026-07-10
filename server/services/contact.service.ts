/**
 * ContactService — lógica de negocio del formulario de contacto.
 *
 * Phase 2: asuntos y mensajes mock en memoria.
 * Phase 3: delegar en ContactAdapter → PrestaShop 8.
 */

import type { ContactSubject, ContactFormPayload, ContactMessage } from '~~/shared/types/contact.types'
import { createError } from 'h3'
import { MOCK_CONTACT_SUBJECTS } from '../repositories/mock/contact-subjects.data'
import { mockContactStore } from '../repositories/mock/mock-contact.store'
import { validateContactPayload } from '~~/shared/validation/form.validation'

export const ContactService = {
  async getSubjects(): Promise<ContactSubject[]> {
    return MOCK_CONTACT_SUBJECTS
  },

  async submitMessage(payload: ContactFormPayload): Promise<ContactMessage> {
    const validationError = validateContactPayload(payload)
    if (validationError) {
      throw createError({ statusCode: 400, statusMessage: validationError })
    }

    const email = payload.email.trim().toLowerCase()

    const subject = MOCK_CONTACT_SUBJECTS.find((s) => s.id === payload.subjectId)

    if (!subject) {
      throw createError({ statusCode: 400, statusMessage: 'Asunto no válido' })
    }

    return mockContactStore.save({
      subjectId: subject.id,
      subjectName: subject.name,
      email,
      orderReference: payload.orderReference?.trim() || null,
      message: payload.message.trim(),
    })
  },
}
