/**
 * useContact — orquesta el formulario de contacto.
 */

import type { ContactSubject, ContactFormPayload, ContactMessage } from '~~/shared/types/contact.types'

export function useContact() {
  const { data: subjects, pending: loadingSubjects } = useAsyncData<ContactSubject[]>(
    'contact-subjects',
    () => $fetch('/api/contact/subjects'),
  )

  async function submitMessage(payload: ContactFormPayload): Promise<ContactMessage> {
    return $fetch<ContactMessage>('/api/contact', {
      method: 'POST',
      body: payload,
    })
  }

  return {
    subjects: readonly(subjects),
    loadingSubjects: readonly(loadingSubjects),
    submitMessage,
  }
}
