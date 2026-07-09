/**
 * Tipos del formulario de contacto (PrestaShop 8).
 *
 * En PS8, los asuntos provienen de "Servicio al cliente > Contactos"
 * y cada uno tiene un email de destino asociado.
 */

export interface ContactSubject {
  id: number
  name: string
  description: string
  /** Email del departamento que recibe el mensaje. */
  email: string
}

export interface ContactFormPayload {
  subjectId: number
  email: string
  orderReference?: string
  message: string
}

export interface ContactMessage {
  id: number
  subjectId: number
  subjectName: string
  email: string
  orderReference: string | null
  message: string
  createdAt: string
}
