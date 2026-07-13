/**
 * Implementación de IProductRepository que consume el WebService de PrestaShop 8.
 *
 * Estrategia:
 * - findAll: usa los filtros de la WS API directamente (search, category, sort, paginación)
 * - findBySlug: busca por link_rewrite usando filter[] de PS
 * - findRelated: busca productos de la misma categoría
 *
 * Las llamadas auxiliares (combinaciones, stock, atributos) se hacen en paralelo
 * para minimizar la latencia total.
 */

import type { IProductRepository } from '../../types/product.repository'
import type { Product } from '~~/shared/types/product.types'
import type { ProductFilters, PaginatedResult } from '~~/shared/types/api.types'
import { psGet } from '../../lib/prestashop/client'
import {
  transformProduct,
  psLang,
  type ProductTransformContext,
} from '../../lib/prestashop/transformers'
import type {
  PsProductListResponse,
  PsProductDetailResponse,
  PsCategoryListResponse,
  PsCombinationListResponse,
  PsCombinationDetailResponse,
  PsStockAvailableListResponse,
  PsProductOptionValueDetailResponse,
  PsProductOptionDetailResponse,
  PsProduct,
  PsCategory,
  PsCombination,
  PsStockAvailable,
} from '../../lib/prestashop/types'

// PS ordena con order[]=campo_ASC / campo_DESC
const SORT_MAP: Record<NonNullable<ProductFilters['sort']>, string> = {
  price_asc: 'price_ASC',
  price_desc: 'price_DESC',
  name_asc: 'name_ASC',
  name_desc: 'name_DESC',
  newest: 'date_add_DESC',
}

export class PsProductRepository implements IProductRepository {
  async findAll(filters: ProductFilters): Promise<PaginatedResult<Product>> {
    const page = filters.page ?? 1
    const perPage = filters.perPage ?? 24

    // PS usa limit=perPage&offset=(page-1)*perPage
    const params: Record<string, string | number | boolean> = {
      display: 'full',
      limit: `${(page - 1) * perPage},${perPage}`,
    }

    if (filters.search) {
      // Búsqueda por nombre con el filtro de PS
      params['filter[name]'] = `%${filters.search}%`
    }

    if (filters.categoryId) {
      params['filter[id_category_default]'] = filters.categoryId
    }

    if (filters.sort && SORT_MAP[filters.sort]) {
      params['sort'] = `[${SORT_MAP[filters.sort]}]`
    }

    // Traer productos y total en paralelo
    const [listRes, countRes] = await Promise.all([
      psGet<PsProductListResponse>('products', { params }),
      psGet<PsProductListResponse>('products', {
        params: {
          ...params,
          display: '[id]',
          limit: '0,9999',
        },
      }),
    ])

    const psProducts = listRes.products ?? []
    const total = countRes.products?.length ?? 0
    const totalPages = Math.ceil(total / perPage)

    if (psProducts.length === 0) {
      return { items: [], total, page, perPage, totalPages }
    }

    const productIds = psProducts.map(p => p.id)
    const ctx = await this.buildContext(productIds, psProducts as PsProduct[])

    const items = (psProducts as PsProduct[]).map(p => transformProduct(p, ctx))

    return { items, total, page, perPage, totalPages }
  }

  async findById(id: number): Promise<Product | null> {
    const res = await psGet<PsProductListResponse>('products', {
      params: {
        display: 'full',
        'filter[id]': id,
      },
    })

    const ps = res.products?.[0] as PsProduct | undefined
    if (!ps) return null

    const ctx = await this.buildContext([ps.id], [ps])
    return transformProduct(ps, ctx)
  }

  async findBySlug(slug: string): Promise<Product | null> {
    const res = await psGet<PsProductListResponse>('products', {
      params: {
        display: 'full',
        'filter[link_rewrite]': slug,
      },
    })

    const ps = res.products?.[0] as PsProduct | undefined
    if (!ps) return null

    const ctx = await this.buildContext([ps.id], [ps])
    return transformProduct(ps, ctx)
  }

  async findRelated(slug: string, limit = 4): Promise<Product[]> {
    // Primero obtenemos el producto actual para saber su categoría
    const current = await this.findBySlug(slug)
    if (!current || current.categories.length === 0) return []

    const categoryId = current.categories[0].id

    const res = await psGet<PsProductListResponse>('products', {
      params: {
        display: 'full',
        'filter[id_category_default]': categoryId,
        limit: `0,${limit + 1}`,
      },
    })

    const psProducts = (res.products ?? []) as PsProduct[]
    const filtered = psProducts.filter(p => p.id !== current.id).slice(0, limit)
    if (filtered.length === 0) return []

    const ctx = await this.buildContext(filtered.map(p => p.id), filtered)
    return filtered.map(p => transformProduct(p, ctx))
  }

  // ─── Context builder ────────────────────────────────────────────────────────

  /**
   * Carga en paralelo todos los datos auxiliares necesarios para transformar
   * un conjunto de productos: categorías, combinaciones, stock y atributos.
   */
  private async buildContext(
    productIds: number[],
    products: PsProduct[],
  ): Promise<ProductTransformContext> {
    const combinationIds = products.flatMap(
      p => p.associations?.combinations?.map(c => Number(c.id)) ?? [],
    )

    // Todas las categorías (usamos caché en PS via el filtro de IDs activas)
    const [categoriesRes, stockRes, combinationsRes] = await Promise.all([
      psGet<PsCategoryListResponse>('categories', {
        params: { display: 'full', 'filter[active]': 1 },
      }),
      psGet<PsStockAvailableListResponse>('stock_availables', {
        params: {
          display: 'full',
          'filter[id_product]': `[${productIds.join('|')}]`,
        },
      }),
      combinationIds.length > 0
        ? psGet<PsCombinationListResponse>('combinations', {
            params: {
              display: 'full',
              'filter[id]': `[${combinationIds.join('|')}]`,
            },
          })
        : Promise.resolve({ combinations: [] } as PsCombinationListResponse),
    ])

    const categories: PsCategory[] = categoriesRes.categories ?? []
    const stocks: PsStockAvailable[] = stockRes.stock_availables ?? []
    const combinations: PsCombination[] = combinationsRes.combinations ?? []

    // Atributos de variantes (nombre de grupo + valor)
    const attributeMap = await this.buildAttributeMap(combinations)

    return { categories, combinations, stocks, attributeMap }
  }

  /**
   * Construye un mapa id_combination → { group, value } resolviendo los
   * product_option_values y product_options de PS.
   */
  private async buildAttributeMap(
    combinations: PsCombination[],
  ): Promise<Map<number, { group: string; value: string }>> {
    const map = new Map<number, { group: string; value: string }>()
    if (combinations.length === 0) return map

    const valueIds = [
      ...new Set(
        combinations.flatMap(
          c => c.associations?.product_option_values?.map(v => Number(v.id)) ?? [],
        ),
      ),
    ]
    if (valueIds.length === 0) return map

    // Traer todos los option values en paralelo
    const valueDetails = await Promise.all(
      valueIds.map(id =>
        psGet<PsProductOptionValueDetailResponse>(`product_option_values/${id}`)
          .catch(() => null),
      ),
    )

    const groupIds = [
      ...new Set(
        valueDetails
          .filter(Boolean)
          .map(r => Number(r!.product_option_value.id_attribute_group)),
      ),
    ]

    const groupDetails = await Promise.all(
      groupIds.map(id =>
        psGet<PsProductOptionDetailResponse>(`product_options/${id}`)
          .catch(() => null),
      ),
    )

    const groupMap = new Map<number, string>()
    for (const g of groupDetails) {
      if (!g) continue
      const opt = g.product_option
      groupMap.set(opt.id, psLang(opt.public_name) || psLang(opt.name) || String(opt.id))
    }

    const valueMap = new Map<number, { group: string; value: string }>()
    for (const r of valueDetails) {
      if (!r) continue
      const ov = r.product_option_value
      const groupName = groupMap.get(Number(ov.id_attribute_group)) ?? 'Variante'
      const valueName = psLang(ov.name) || String(ov.id)
      valueMap.set(ov.id, { group: groupName, value: valueName })
    }

    for (const c of combinations) {
      const firstValueId = c.associations?.product_option_values?.[0]?.id
      if (!firstValueId) continue
      const attr = valueMap.get(Number(firstValueId))
      if (attr) map.set(c.id, attr)
    }

    return map
  }
}
