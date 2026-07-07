import type { Category } from '~~/shared/types/category.types'

export const MOCK_CATEGORIES: Category[] = [
  {
    id: 1,
    name: 'Electrónica',
    slug: 'electronica',
    description: 'Dispositivos, periféricos y accesorios tecnológicos.',
    parentId: null,
    image: null,
    position: 0,
  },
  {
    id: 2,
    name: 'Hogar y Oficina',
    slug: 'hogar-y-oficina',
    description: 'Equipamiento ergonómico e iluminación para tu espacio de trabajo.',
    parentId: null,
    image: null,
    position: 1,
  },
]
