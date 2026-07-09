import type { ContactSubject } from '~~/shared/types/contact.types'

/**
 * Asuntos de contacto mock, equivalentes a los configurados en PS8
 * en Servicio al cliente > Contactos.
 */
export const MOCK_CONTACT_SUBJECTS: ContactSubject[] = [
  {
    id: 1,
    name: 'Servicio al cliente',
    description: 'Consultas sobre pedidos, envíos, devoluciones y facturación.',
    email: 'servicio@nuxtshop.com',
  },
  {
    id: 2,
    name: 'Información del producto',
    description: 'Dudas sobre características, compatibilidad o disponibilidad.',
    email: 'productos@nuxtshop.com',
  },
  {
    id: 3,
    name: 'Soporte técnico',
    description: 'Problemas con el sitio web, pagos o tu cuenta.',
    email: 'soporte@nuxtshop.com',
  },
  {
    id: 4,
    name: 'Otro',
    description: 'Cualquier otra consulta no contemplada en las opciones anteriores.',
    email: 'contacto@nuxtshop.com',
  },
]
