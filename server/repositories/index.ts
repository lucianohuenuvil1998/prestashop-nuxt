/**
 * Proveedor de repositorios (composición raíz del servidor).
 *
 * Este es el único archivo que debe modificarse cuando se cambie
 * de MockProductRepository a PrestashopProductRepository (u otra implementación).
 *
 * El resto del sistema (servicios, rutas) importa desde aquí y permanece
 * intacto durante cualquier sustitución de infraestructura.
 *
 * Principio: Open/Closed — el sistema está abierto a extensión (nueva
 * implementación) pero cerrado a modificación (nada más cambia).
 */

import type { IProductRepository } from '../types/product.repository'
import { MockProductRepository } from './mock/mock-product.repository'

import type { ICartRepository } from '../types/cart.repository'
import { MockCartRepository } from './mock/mock-cart.repository'

// ─── Al integrar PrestaShop, sustituir las líneas de abajo: ──────────────────
// import { PrestashopProductRepository } from './prestashop/prestashop-product.repository'
// import { PrestashopCartRepository } from './prestashop/prestashop-cart.repository'

export const productRepository: IProductRepository = new MockProductRepository()
export const cartRepository: ICartRepository = new MockCartRepository()
