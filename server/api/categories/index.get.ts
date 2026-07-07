import { defineEventHandler } from 'h3'
import { CategoryService } from '../../services/category.service'

export default defineEventHandler(async () => {
  return CategoryService.getAll()
})
