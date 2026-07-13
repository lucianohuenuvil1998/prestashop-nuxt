/**
 * Proveedor de repositorios (composición raíz del servidor).
 *
 * Activa los repositorios de PrestaShop cuando USE_PRESTASHOP=true en .env.
 * De lo contrario usa los mocks para desarrollo local sin PS.
 *
 * Este es el único archivo que cambia al integrar PrestaShop.
 * El resto del sistema (servicios, rutas) no se toca.
 */

import type { IProductRepository } from '../types/product.repository'
import type { ICartRepository } from '../types/cart.repository'
import type { ICategoryRepository } from '../types/category.repository'

// ─── Mocks ────────────────────────────────────────────────────────────────────
import { MockProductRepository } from './mock/mock-product.repository'
import { MockCartRepository } from './mock/mock-cart.repository'
import { MockCategoryRepository } from './mock/mock-category.repository'

// ─── PrestaShop ───────────────────────────────────────────────────────────────
import { PsProductRepository } from './prestashop/ps-product.repository'
import { PsCartRepository } from './prestashop/ps-cart.repository'
import { PsCategoryRepository } from './prestashop/ps-category.repository'

// eslint-disable-next-line node/prefer-global/process
const usePS = (globalThis as Record<string, unknown>).process
  ? ((globalThis as { process?: { env?: Record<string, string> } }).process?.env?.USE_PRESTASHOP === 'true')
  : false

export const productRepository: IProductRepository = usePS
  ? new PsProductRepository()
  : new MockProductRepository()

// El carrito siempre usa almacenamiento en memoria (servidor Nuxt).
// Al pagar, los items se sincronizan con PS para crear el pedido real.
// Esto evita el problema del XML PUT de PS WS y hace las operaciones instantáneas.
export const cartRepository: ICartRepository = new MockCartRepository()

export const categoryRepository: ICategoryRepository = usePS
  ? new PsCategoryRepository()
  : new MockCategoryRepository()
