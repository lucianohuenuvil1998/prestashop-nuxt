/**
 * Almacenamiento en memoria de mensajes de contacto mock.
 *
 * Al integrar PrestaShop 8, los mensajes se enviarán por email
 * o se guardarán vía el módulo headless / API de PS.
 */

import type { ContactMessage } from '~~/shared/types/contact.types'

const messages: ContactMessage[] = []
let nextId = 1

export const mockContactStore = {
  save(message: Omit<ContactMessage, 'id' | 'createdAt'>): ContactMessage {
    const stored: ContactMessage = {
      ...message,
      id: nextId++,
      createdAt: new Date().toISOString(),
    }
    messages.push(stored)
    return { ...stored }
  },
}
