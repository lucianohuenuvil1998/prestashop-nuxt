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

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const ContactService = {
  async getSubjects(): Promise<ContactSubject[]> {
    return MOCK_CONTACT_SUBJECTS
  },

  async submitMessage(payload: ContactFormPayload): Promise<ContactMessage> {
    if (!payload.subjectId || !payload.email?.trim() || !payload.message?.trim()) {
      throw createError({ statusCode: 400, statusMessage: 'Faltan campos obligatorios' })
    }

    const email = payload.email.trim().toLowerCase()

    if (!EMAIL_REGEX.test(email)) {
      throw createError({ statusCode: 400, statusMessage: 'El email no es válido' })
    }

    if (payload.message.trim().length < 10) {
      throw createError({ statusCode: 400, statusMessage: 'El mensaje debe tener al menos 10 caracteres' })
    }

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
