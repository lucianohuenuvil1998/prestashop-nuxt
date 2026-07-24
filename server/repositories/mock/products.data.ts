/**
 * Datos simulados del dominio Product.
 *
 * Este archivo es la única fuente de verdad de MockProductRepository.
 * Existe de forma independiente para que los datos sean fácilmente
 * inspeccionables, editables y extensibles sin tocar la lógica del repositorio.
 *
 * Cuando se integre PrestaShop, este archivo se vuelve obsoleto:
 * los datos reales provendrán de la API del módulo headless.
 */

import type { Product } from '~~/shared/types/product.types'

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    slug: 'auriculares-bluetooth-pro',
    name: 'Auriculares Bluetooth Pro',
    shortDescription: 'Cancelación de ruido activa, 30 h de batería y sonido de alta fidelidad.',
    description: `
      <p>Los Auriculares Bluetooth Pro combinan tecnología de cancelación de ruido activa (ANC) con
      drivers de 40 mm para una experiencia de audio inmersiva. Con hasta 30 horas de autonomía
      en modo ANC y 40 sin ella, son el compañero ideal para el trabajo, el transporte y los viajes.</p>
      <ul>
        <li>Cancelación de ruido activa híbrida</li>
        <li>Bluetooth 5.3 con multipoint (2 dispositivos simultáneos)</li>
        <li>Carga rápida: 10 min → 3 h de uso</li>
        <li>Micrófono cuádruple con reducción de ruido</li>
      </ul>
    `.trim(),
    price: 89.99,
    regularPrice: 119.99,
    currency: 'CLP',
    sku: 'AUR-BT-PRO-001',
    isAvailable: true,
    stock: { quantity: 42, isInStock: true },
    images: [
      {
        id: 101,
        url: 'https://picsum.photos/seed/aur1/800/800',
        alt: 'Auriculares Bluetooth Pro — vista frontal',
        position: 0,
      },
      {
        id: 102,
        url: 'https://picsum.photos/seed/aur2/800/800',
        alt: 'Auriculares Bluetooth Pro — vista lateral',
        position: 1,
      },
    ],
    categories: [{ id: 1, name: 'Electrónica', slug: 'electronica' }],
    variants: [
      {
        id: 1001,
        attributes: { Color: 'Negro' },
        price: 89.99,
        sku: 'AUR-BT-PRO-001-BLK',
        stock: { quantity: 25, isInStock: true },
      },
      {
        id: 1002,
        attributes: { Color: 'Blanco' },
        price: 89.99,
        sku: 'AUR-BT-PRO-001-WHT',
        stock: { quantity: 17, isInStock: true },
      },
    ],
    createdAt: '2026-01-10T09:00:00Z',
    updatedAt: '2026-06-20T14:30:00Z',
  },

  {
    id: 2,
    slug: 'teclado-mecanico-compacto',
    name: 'Teclado Mecánico Compacto',
    shortDescription: 'Layout 75 %, switches táctiles, retroiluminación RGB por tecla.',
    description: `
      <p>El Teclado Mecánico Compacto ofrece la experiencia de escritura de un teclado full-size
      en un formato 75 % que ocupa un 30 % menos de espacio en tu escritorio. Cada tecla cuenta
      con retroiluminación RGB individual y los switches táctiles brindan retroalimentación
      precisa sin el ruido de los clicky.</p>
      <ul>
        <li>Switches táctiles hot-swap (intercambiables sin soldadura)</li>
        <li>Conexión USB-C y Bluetooth 5.0</li>
        <li>Construcción en aluminio anodizado</li>
        <li>Compatible con Windows, macOS y Linux</li>
      </ul>
    `.trim(),
    price: 129.00,
    regularPrice: 129.00,
    currency: 'CLP',
    sku: 'TEC-MEC-75-001',
    isAvailable: true,
    stock: { quantity: 18, isInStock: true },
    images: [
      {
        id: 201,
        url: 'https://picsum.photos/seed/tec1/800/800',
        alt: 'Teclado Mecánico Compacto — vista superior',
        position: 0,
      },
    ],
    categories: [{ id: 1, name: 'Electrónica', slug: 'electronica' }],
    variants: [
      {
        id: 2001,
        attributes: { Color: 'Gris espacial' },
        price: 129.00,
        sku: 'TEC-MEC-75-001-GRY',
        stock: { quantity: 10, isInStock: true },
      },
      {
        id: 2002,
        attributes: { Color: 'Blanco lunar' },
        price: 129.00,
        sku: 'TEC-MEC-75-001-WHT',
        stock: { quantity: 8, isInStock: true },
      },
    ],
    createdAt: '2026-02-05T10:00:00Z',
    updatedAt: '2026-06-18T09:00:00Z',
  },

  {
    id: 3,
    slug: 'monitor-27-4k-ips',
    name: 'Monitor 27" 4K IPS',
    shortDescription: 'Panel IPS 4K UHD, 144 Hz, HDR400, ideal para diseño y productividad.',
    description: `
      <p>Este monitor de 27 pulgadas con panel IPS y resolución 4K UHD (3840×2160) entrega
      colores precisos y ángulos de visión de 178° en cualquier dirección. Con una tasa de
      refresco de 144 Hz y tiempo de respuesta de 1 ms (MPRT), también es válido para gaming.</p>
      <ul>
        <li>Resolución 3840×2160 (4K UHD)</li>
        <li>144 Hz / 1 ms MPRT</li>
        <li>Cobertura sRGB 99 % / DCI-P3 90 %</li>
        <li>Puertos: 2× HDMI 2.1, 1× DisplayPort 1.4, 4× USB-A 3.2</li>
        <li>Soporte ajustable en altura, inclinación y rotación</li>
      </ul>
    `.trim(),
    price: 549.99,
    regularPrice: 649.99,
    currency: 'CLP',
    sku: 'MON-27-4K-IPS-001',
    isAvailable: true,
    stock: { quantity: 7, isInStock: true },
    images: [
      {
        id: 301,
        url: 'https://picsum.photos/seed/mon1/800/800',
        alt: 'Monitor 27" 4K IPS — vista frontal',
        position: 0,
      },
      {
        id: 302,
        url: 'https://picsum.photos/seed/mon2/800/800',
        alt: 'Monitor 27" 4K IPS — vista trasera',
        position: 1,
      },
    ],
    categories: [{ id: 1, name: 'Electrónica', slug: 'electronica' }],
    variants: [],
    createdAt: '2026-03-01T00:00:00Z',
    updatedAt: '2026-07-01T00:00:00Z',
  },

  {
    id: 4,
    slug: 'hub-usb-c-7-en-1',
    name: 'Hub USB-C 7 en 1',
    shortDescription: 'Expande tu laptop con HDMI 4K, USB-A 3.0, lector SD y carga de 100 W.',
    description: `
      <p>El Hub USB-C 7 en 1 convierte un único puerto USB-C en siete conexiones simultáneas.
      Diseñado para laptops ultradelgadas que sacrifican conectividad por tamaño, este hub
      permite trabajar con monitor externo, periféricos y tarjetas de memoria al mismo tiempo.</p>
      <ul>
        <li>1× HDMI 4K@60 Hz</li>
        <li>3× USB-A 3.0 (5 Gbps)</li>
        <li>1× USB-C datos (5 Gbps) + 1× USB-C PD 100 W</li>
        <li>Lector SD/MicroSD simultáneo</li>
        <li>Carcasa de aluminio con disipación de calor pasiva</li>
      </ul>
    `.trim(),
    price: 49.99,
    regularPrice: 49.99,
    currency: 'CLP',
    sku: 'HUB-USBC-7IN1-001',
    isAvailable: true,
    stock: { quantity: 89, isInStock: true },
    images: [
      {
        id: 401,
        url: 'https://picsum.photos/seed/hub1/800/800',
        alt: 'Hub USB-C 7 en 1',
        position: 0,
      },
    ],
    categories: [{ id: 1, name: 'Electrónica', slug: 'electronica' }],
    variants: [],
    createdAt: '2026-01-22T00:00:00Z',
    updatedAt: '2026-05-10T00:00:00Z',
  },

  {
    id: 5,
    slug: 'silla-ergonomica-mesh',
    name: 'Silla Ergonómica Mesh',
    shortDescription: 'Respaldo de malla transpirable, soporte lumbar ajustable y reposabrazos 4D.',
    description: `
      <p>La Silla Ergonómica Mesh fue diseñada para largas jornadas de trabajo. Su respaldo de
      malla de alta tensión permite la circulación del aire mientras el soporte lumbar dinámico
      se adapta a la curva de tu columna. Los reposabrazos 4D se ajustan en altura, profundidad,
      anchura y ángulo.</p>
      <ul>
        <li>Respaldo en malla de alta tensión</li>
        <li>Soporte lumbar dinámico ajustable</li>
        <li>Reposabrazos 4D</li>
        <li>Inclinación sincronizada 0–135°</li>
        <li>Capacidad: 150 kg</li>
      </ul>
    `.trim(),
    price: 399.00,
    regularPrice: 499.00,
    currency: 'CLP',
    sku: 'SIL-ERG-MESH-001',
    isAvailable: true,
    stock: { quantity: 12, isInStock: true },
    images: [
      {
        id: 501,
        url: 'https://picsum.photos/seed/sil1/800/800',
        alt: 'Silla Ergonómica Mesh — vista frontal',
        position: 0,
      },
      {
        id: 502,
        url: 'https://picsum.photos/seed/sil2/800/800',
        alt: 'Silla Ergonómica Mesh — vista lateral',
        position: 1,
      },
    ],
    categories: [{ id: 2, name: 'Hogar y Oficina', slug: 'hogar-y-oficina' }],
    variants: [
      {
        id: 5001,
        attributes: { Color: 'Negro' },
        price: 399.00,
        sku: 'SIL-ERG-MESH-001-BLK',
        stock: { quantity: 8, isInStock: true },
      },
      {
        id: 5002,
        attributes: { Color: 'Gris' },
        price: 399.00,
        sku: 'SIL-ERG-MESH-001-GRY',
        stock: { quantity: 4, isInStock: true },
      },
    ],
    createdAt: '2026-02-14T00:00:00Z',
    updatedAt: '2026-06-30T00:00:00Z',
  },

  {
    id: 6,
    slug: 'lampara-escritorio-led',
    name: 'Lámpara de Escritorio LED',
    shortDescription: 'Luz LED articulada con 5 temperaturas de color, control táctil y puerto USB-A.',
    description: `
      <p>La Lámpara de Escritorio LED ofrece iluminación precisa para tu área de trabajo con
      5 temperaturas de color (2700 K–6500 K) y 10 niveles de brillo ajustables mediante
      control táctil. Su brazo articulado de aluminio permite posicionarla exactamente donde
      la necesitas, y el puerto USB-A integrado carga tu smartphone sin ocupar un enchufe adicional.</p>
      <ul>
        <li>5 temperaturas de color + 10 niveles de brillo</li>
        <li>Brazo articulado con sujeción de escritorio</li>
        <li>Control táctil con memoria de último ajuste</li>
        <li>Puerto USB-A 5 W integrado</li>
        <li>Vida útil del LED: &gt;50.000 h</li>
      </ul>
    `.trim(),
    price: 59.99,
    regularPrice: 79.99,
    currency: 'CLP',
    sku: 'LAM-LED-DESK-001',
    isAvailable: true,
    stock: { quantity: 34, isInStock: true },
    images: [
      {
        id: 601,
        url: 'https://picsum.photos/seed/lam1/800/800',
        alt: 'Lámpara de Escritorio LED',
        position: 0,
      },
    ],
    categories: [{ id: 2, name: 'Hogar y Oficina', slug: 'hogar-y-oficina' }],
    variants: [
      {
        id: 6001,
        attributes: { Color: 'Negro mate' },
        price: 59.99,
        sku: 'LAM-LED-DESK-001-BLK',
        stock: { quantity: 20, isInStock: true },
      },
      {
        id: 6002,
        attributes: { Color: 'Blanco' },
        price: 59.99,
        sku: 'LAM-LED-DESK-001-WHT',
        stock: { quantity: 14, isInStock: true },
      },
    ],
    createdAt: '2026-03-20T00:00:00Z',
    updatedAt: '2026-07-01T00:00:00Z',
  },

  {
    id: 7,
    slug: 'webcam-4k-autofocus',
    name: 'Webcam 4K Autofocus',
    shortDescription: 'Sensor Sony 4K, autofocus continuo, micrófono estéreo con reducción de ruido.',
    description: `
      <p>La Webcam 4K Autofocus es la solución definitiva para videoconferencias y streaming.
      Su sensor Sony de 1/2.8" captura imágenes nítidas incluso en condiciones de poca luz gracias
      al procesamiento HDR integrado. El autofocus continuo de 60 Hz garantiza que siempre estés
      en foco, y el micrófono estéreo dual elimina el ruido ambiental de fondo.</p>
      <ul>
        <li>Resolución 4K@30 Hz / 1080p@60 Hz</li>
        <li>Autofocus continuo 60 Hz</li>
        <li>Campo de visión ajustable: 65°, 78°, 90°</li>
        <li>Micrófono estéreo con supresión de ruido por IA</li>
        <li>Compatible con Zoom, Teams, Meet y OBS</li>
      </ul>
    `.trim(),
    price: 149.99,
    regularPrice: 199.99,
    currency: 'CLP',
    sku: 'CAM-4K-AF-001',
    isAvailable: true,
    stock: { quantity: 0, isInStock: false },
    images: [
      {
        id: 701,
        url: 'https://picsum.photos/seed/cam1/800/800',
        alt: 'Webcam 4K Autofocus',
        position: 0,
      },
    ],
    categories: [{ id: 1, name: 'Electrónica', slug: 'electronica' }],
    variants: [],
    createdAt: '2026-04-01T00:00:00Z',
    updatedAt: '2026-07-05T00:00:00Z',
  },

  {
    id: 8,
    slug: 'alfombrilla-escritorio-xxl',
    name: 'Alfombrilla de Escritorio XXL',
    shortDescription: 'Superficie extendida 90×40 cm para teclado y ratón, base antideslizante.',
    description: `
      <p>La Alfombrilla de Escritorio XXL cubre todo el área de trabajo y elimina la necesidad
      de una alfombrilla de ratón independiente. Su superficie de tela micro-texturizada es
      compatible con cualquier tipo de ratón (óptico, láser, gaming) y la base de caucho
      natural de 3 mm evita cualquier desplazamiento durante el uso.</p>
      <ul>
        <li>Dimensiones: 90 × 40 × 0.3 cm</li>
        <li>Superficie de tela micro-texturizada</li>
        <li>Base de caucho natural antideslizante</li>
        <li>Bordes cosidos para mayor durabilidad</li>
        <li>Resistente a derrames (secado rápido)</li>
      </ul>
    `.trim(),
    price: 29.99,
    regularPrice: 29.99,
    currency: 'CLP',
    sku: 'ALF-DESK-XXL-001',
    isAvailable: true,
    stock: { quantity: 156, isInStock: true },
    images: [
      {
        id: 801,
        url: 'https://picsum.photos/seed/alf1/800/800',
        alt: 'Alfombrilla de Escritorio XXL',
        position: 0,
      },
    ],
    categories: [{ id: 2, name: 'Hogar y Oficina', slug: 'hogar-y-oficina' }],
    variants: [
      {
        id: 8001,
        attributes: { Color: 'Negro' },
        price: 29.99,
        sku: 'ALF-DESK-XXL-001-BLK',
        stock: { quantity: 90, isInStock: true },
      },
      {
        id: 8002,
        attributes: { Color: 'Azul marino' },
        price: 29.99,
        sku: 'ALF-DESK-XXL-001-NVY',
        stock: { quantity: 66, isInStock: true },
      },
    ],
    createdAt: '2026-05-01T00:00:00Z',
    updatedAt: '2026-07-01T00:00:00Z',
  },
]
