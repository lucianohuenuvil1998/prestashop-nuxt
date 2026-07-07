export interface Category {
  id: number
  name: string
  slug: string
  description: string
  parentId: number | null
  image: string | null
  position: number
}

export interface CategoryTree extends Category {
  children: CategoryTree[]
}
