# Arquitectura: Headless E-Commerce — Nuxt 4 + PrestaShop 8

## 1. Principios rectores

| Principio | Aplicación concreta |
|---|---|
| **Single Responsibility** | Cada archivo tiene un único motivo de cambio: rutas solo despachan, servicios solo orquestan, adapters solo traducen |
| **Open/Closed** | Los adapters son intercambiables sin tocar la lógica de negocio |
| **Dependency Inversion** | Los servicios dependen de interfaces de tipos, no de implementaciones concretas del adapter |
| **Clean Architecture** | El dominio no conoce ni a Nuxt ni a PrestaShop; la infraestructura depende del dominio, nunca al revés |
| **Separation of Concerns** | Frontend nunca llama a PrestaShop directamente; toda comunicación pasa por Server Routes |

---

## 2. Flujo de datos (macro)

```
Browser (Vue)
    │  useFetch / $fetch
    ▼
app/composables/           ← capa de orquestación UI
    │
    ▼ HTTP (interno)
server/api/                ← handlers delgados: validan entrada, devuelven respuesta
    │
    ▼ llamada de función
server/services/           ← lógica de negocio pura, agnóstica de HTTP
    │
    ▼ llamada de función
server/adapters/prestashop/  ← traducción dominio ↔ PrestaShop API
    │
    ▼ HTTP (externo)
Módulo headless de PrestaShop 8
    │
    ▼
Core de PrestaShop
```

**Regla de dependencia:** cada capa solo conoce la capa inmediatamente siguiente. Ninguna capa mira "hacia arriba".

---

## 3. Estructura de carpetas completa

```
prestashop-nuxt/
│
├── app/                              # Código cliente (Nuxt 4: directorio fuente)
│   │
│   ├── assets/                       # CSS global, fuentes, imágenes procesables
│   │   └── css/
│   │       └── main.css
│   │
│   ├── components/                   # Componentes Vue, organizados por dominio
│   │   ├── ui/                       # Primitivos reutilizables (Button, Input, Badge…)
│   │   ├── layout/                   # Header, Footer, Nav, Breadcrumb
│   │   ├── catalog/                  # ProductCard, ProductGrid, Filters, CategoryTree
│   │   ├── cart/                     # CartDrawer, CartItem, CartSummary
│   │   ├── checkout/                 # AddressForm, ShippingSelector, PaymentStep
│   │   └── account/                  # LoginForm, OrderHistory, AddressBook
│   │
│   ├── composables/                  # Lógica reactiva que consume Server Routes
│   │   ├── catalog/
│   │   │   ├── useProducts.ts        # listado, filtros, paginación
│   │   │   └── useProduct.ts         # detalle de producto
│   │   ├── cart/
│   │   │   └── useCart.ts            # agregar, quitar, actualizar, vaciar
│   │   ├── checkout/
│   │   │   └── useCheckout.ts        # pasos del checkout
│   │   └── auth/
│   │       └── useAuth.ts            # login, logout, sesión
│   │
│   ├── layouts/
│   │   ├── default.vue
│   │   └── checkout.vue              # layout sin nav para el flujo de pago
│   │
│   ├── middleware/                   # Guards de ruta (solo cliente)
│   │   ├── auth.ts                   # redirige si no hay sesión
│   │   └── guest.ts                  # redirige si ya está autenticado
│   │
│   ├── pages/                        # Enrutamiento basado en archivos
│   │   ├── index.vue                 # Home
│   │   ├── catalog/
│   │   │   ├── index.vue             # /catalog — listado con filtros
│   │   │   └── [slug].vue            # /catalog/:slug — categoría
│   │   ├── product/
│   │   │   └── [slug].vue            # /product/:slug — PDP
│   │   ├── cart/
│   │   │   └── index.vue             # /cart
│   │   ├── checkout/
│   │   │   ├── index.vue             # /checkout
│   │   │   └── confirmation.vue      # /checkout/confirmation
│   │   └── account/
│   │       ├── login.vue
│   │       └── index.vue
│   │
│   ├── stores/                       # Estado global Pinia (solo estado UI/cliente)
│   │   ├── cart.store.ts             # estado del carrito en cliente (cache local)
│   │   ├── auth.store.ts             # datos de sesión del usuario
│   │   └── ui.store.ts               # drawer abierto, toast, loading global
│   │
│   ├── utils/                        # Utilidades puras del cliente
│   │   ├── currency.ts               # formateo de precios
│   │   └── slugify.ts
│   │
│   └── app.vue
│
├── server/                           # Código servidor (Nitro / Nuxt Server)
│   │
│   ├── api/                          # Server Routes — handlers HTTP delgados
│   │   │                             # Convenio: [dominio]/[recurso].[método].ts
│   │   ├── catalog/
│   │   │   ├── products.get.ts       # GET  /api/catalog/products
│   │   │   └── products/
│   │   │       └── [slug].get.ts     # GET  /api/catalog/products/:slug
│   │   ├── categories/
│   │   │   └── index.get.ts          # GET  /api/categories
│   │   ├── cart/
│   │   │   ├── index.get.ts          # GET  /api/cart
│   │   │   ├── index.post.ts         # POST /api/cart (crear carrito)
│   │   │   └── items/
│   │   │       ├── index.post.ts     # POST /api/cart/items
│   │   │       └── [id].delete.ts    # DELETE /api/cart/items/:id
│   │   ├── checkout/
│   │   │   ├── summary.get.ts        # GET  /api/checkout/summary
│   │   │   └── order.post.ts         # POST /api/checkout/order
│   │   └── auth/
│   │       ├── login.post.ts         # POST /api/auth/login
│   │       ├── logout.post.ts        # POST /api/auth/logout
│   │       └── me.get.ts             # GET  /api/auth/me
│   │
│   ├── services/                     # Lógica de negocio — agnóstica de HTTP y PS
│   │   ├── catalog.service.ts
│   │   ├── cart.service.ts
│   │   ├── checkout.service.ts
│   │   └── auth.service.ts
│   │
│   ├── adapters/
│   │   └── prestashop/               # Infraestructura: todo lo que sabe de PS va aquí
│   │       ├── prestashop.client.ts  # cliente HTTP base (fetch wrapper con auth)
│   │       ├── catalog.adapter.ts    # llama al módulo PS y mapea respuestas
│   │       ├── cart.adapter.ts
│   │       ├── checkout.adapter.ts
│   │       ├── auth.adapter.ts
│   │       └── mappers/              # Funciones puras: PSRawResponse → DomainEntity
│   │           ├── product.mapper.ts
│   │           ├── cart.mapper.ts
│   │           └── order.mapper.ts
│   │
│   ├── middleware/                   # Server middleware (Nitro)
│   │   ├── auth.ts                   # valida sesión en rutas protegidas
│   │   └── logger.ts                 # logging de requests
│   │
│   └── utils/                        # Utilidades exclusivas del servidor
│       ├── error.ts                  # factory de errores HTTP normalizados
│       └── session.ts                # helpers de sesión/cookie
│
├── shared/                           # Código compartido app ↔ server (Nuxt 4)
│   └── types/                        # Contratos TypeScript del dominio
│       ├── product.types.ts          # Product, ProductVariant, ProductImage
│       ├── category.types.ts         # Category, CategoryTree
│       ├── cart.types.ts             # Cart, CartItem, CartTotals
│       ├── order.types.ts            # Order, OrderLine, OrderStatus
│       ├── customer.types.ts         # Customer, Address
│       └── api.types.ts              # ApiResponse<T>, ApiError, PaginatedResult<T>
│
├── public/
├── nuxt.config.ts
├── package.json
├── tsconfig.json
└── architecture.md
```

---

## 4. Responsabilidades por capa

### 4.1 `app/pages/` — Vistas

- Declaran qué datos necesitan vía composables.
- No llaman a `$fetch` directamente.
- No contienen condicionales de negocio.
- Solo orquestan layout, componentes y estado visual.

### 4.2 `app/composables/` — Orquestación UI

- Son el único punto desde donde el cliente llama a las Server Routes.
- Gestionan estados de loading, error y datos con `useAsyncData` / `useFetch`.
- Sincronizan respuestas del servidor con los stores Pinia si aplica.
- No formatean HTML ni gestionan estilos.

```typescript
// Patrón de composable
export function useProducts(filters: MaybeRef<ProductFilters>) {
  return useAsyncData(
    'products',
    () => $fetch<ApiResponse<Product[]>>('/api/catalog/products', {
      query: toValue(filters),
    }),
    { watch: [() => toValue(filters)] }
  )
}
```

### 4.3 `app/stores/` — Estado global cliente

- Solo persisten estado que no puede vivir en el componente ni en el composable.
- El carrito y la sesión son los candidatos principales.
- No hacen fetch directo; los composables los alimentan.

### 4.4 `server/api/` — Handlers HTTP (Server Routes)

- Son los únicos archivos con conocimiento de `H3Event`, `readBody`, `getQuery`.
- Validan la forma de la request (tipado).
- Llaman a un servicio y devuelven el resultado.
- Manejan errores con `createError` de H3.
- **No contienen lógica de negocio.**

```typescript
// Patrón de server route
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  // validar query...
  const products = await CatalogService.getProducts(query)
  return products
})
```

### 4.5 `server/services/` — Lógica de negocio

- Orquestan llamadas a uno o más adapters.
- Aplican reglas de negocio (stock mínimo, descuentos, validaciones de checkout…).
- Devuelven entidades del dominio (`shared/types/`), nunca respuestas crudas de PS.
- Son funciones o módulos de objeto literal; no clases con estado.
- Son 100% testeables en aislamiento mockeando adapters.

```typescript
// Patrón de servicio
export const CatalogService = {
  async getProducts(filters: ProductFilters): Promise<PaginatedResult<Product>> {
    const raw = await CatalogAdapter.fetchProducts(filters)
    return raw // ya mapeado por el adapter
  },
}
```

### 4.6 `server/adapters/prestashop/` — Infraestructura

- Saben exactamente cómo hablar con el módulo headless de PrestaShop.
- Transforman la request del dominio al formato que espera PS.
- Transforman la respuesta de PS a entidades del dominio usando los mappers.
- Concentran toda la fragilidad de la integración en un único lugar.

```typescript
// Patrón de adapter
export const CatalogAdapter = {
  async fetchProducts(filters: ProductFilters): Promise<PaginatedResult<Product>> {
    const raw = await PrestashopClient.get<PSProductListResponse>('/products', filters)
    return ProductMapper.toPaginatedResult(raw)
  },
}
```

### 4.7 `server/adapters/prestashop/mappers/` — Transformadores

- Funciones puras: entrada = respuesta cruda de PS, salida = entidad del dominio.
- Sin efectos secundarios, sin dependencias externas.
- Triviales de testear con fixtures.

### 4.8 `shared/types/` — Contrato del dominio

- Son la única fuente de verdad para la forma de los datos.
- Importables tanto desde `app/` como desde `server/`.
- Nunca contienen lógica, solo tipos e interfaces.

---

## 5. Convenciones de nomenclatura

| Artefacto | Convención | Ejemplo |
|---|---|---|
| Componente Vue | PascalCase | `ProductCard.vue` |
| Composable | camelCase, prefijo `use` | `useCart.ts` |
| Store Pinia | camelCase, sufijo `.store` | `cart.store.ts` |
| Server Route | snake_case, sufijo de método | `products.get.ts` |
| Servicio | camelCase, sufijo `.service` | `catalog.service.ts` |
| Adapter | camelCase, sufijo `.adapter` | `cart.adapter.ts` |
| Mapper | camelCase, sufijo `.mapper` | `product.mapper.ts` |
| Tipos | camelCase, sufijo `.types` | `cart.types.ts` |
| Exportación de servicio | PascalCase (objeto literal) | `CatalogService` |
| Exportación de adapter | PascalCase (objeto literal) | `CatalogAdapter` |

---

## 6. Estrategia de tipos

- `shared/types/api.types.ts` define el envelope genérico de todas las respuestas:

```typescript
export interface ApiResponse<T> {
  data: T
  meta?: PaginationMeta
}

export interface ApiError {
  statusCode: number
  message: string
  details?: unknown
}

export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  perPage: number
}
```

- Los tipos de PrestaShop crudos (`PSProductResponse`, etc.) viven **únicamente** dentro de `server/adapters/prestashop/` y nunca salen de esa carpeta.
- Los tipos del dominio (`Product`, `Cart`, etc.) son los que cruzan todas las fronteras.

---

## 7. Manejo de errores

- `server/utils/error.ts` centraliza la creación de errores HTTP.
- Los adapters lanzan errores tipados si PS falla.
- Los servicios los propagan o los transforman si aplica lógica de reintento.
- Las Server Routes los capturan con `try/catch` y usan `createError` para responder.
- Los composables exponen el `error` de `useAsyncData` para que las páginas lo muestren.

---

## 8. Configuración y secretos

- Las credenciales del módulo PS (URL base, API key) van en `runtimeConfig` de `nuxt.config.ts`, bajo `runtimeConfig.prestashop`.
- `PrestashopClient` las lee via `useRuntimeConfig()` (solo disponible en servidor).
- Nunca se exponen al cliente.

```typescript
// nuxt.config.ts
runtimeConfig: {
  prestashop: {
    baseUrl: '',   // sobreescrito por NUXT_PRESTASHOP_BASE_URL
    apiKey: '',    // sobreescrito por NUXT_PRESTASHOP_API_KEY
  }
}
```

---

## 9. Reglas de oro (invariantes del proyecto)

1. **El browser nunca sabe la URL de PrestaShop.** Toda comunicación pasa por Server Routes.
2. **Las Server Routes no tienen lógica de negocio.** Solo validan, llaman al servicio y responden.
3. **Los servicios no conocen H3 ni fetch de HTTP.** Solo orquestan adapters.
4. **Los adapters no conocen Nuxt.** Solo conocen el protocolo del módulo PS.
5. **Los tipos del dominio son la única moneda de cambio** entre capas. Nunca pasan DTOs de PS hacia arriba.
6. **TypeScript strict en toda la base de código.** Sin `any` implícito.
7. **Un composable por responsabilidad.** `useCart` no hace fetch de catálogo.
8. **Los stores Pinia son caché de estado cliente,** no la fuente de verdad.
