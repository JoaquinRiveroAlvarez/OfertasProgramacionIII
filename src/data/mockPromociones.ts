export type MarcaNombre =
  | 'PedidosYa'
  | 'Rappi'
  | 'Betos Lomitos'
  | 'Lomiterías 2x1'
  | 'KFC'
  | "McDonald's"
  | 'Burger King'
  | 'Mostaza'
  | "Wendy's"
  | 'Subway';

export type CategoriaPromo =
  | 'Lomitos & Sándwiches'
  | 'Hamburguesas'
  | 'Combos'
  | 'Pollo'
  | 'Postres & Helados';

export interface VariantePrecio {
  nombre: string;
  precio: number;
  precioOriginal?: number;
  detalle?: string;
  ahorro?: number;
}

export interface CondicionesOnline {
  compraMinima: string;
  mediosDePago: string;
  diasValidos: string;
  alcanceZona: string;
  modalidad: 'Delivery a Domicilio' | 'Retiro Take Away Online' | 'Delivery & Retiro Web';
  limitePorUsuario?: string;
  envioGratis?: boolean;
}

export interface PromocionItem {
  id: number;
  marcaId: number;
  marcaNombre: MarcaNombre;
  marcaLogo: string;
  marcaColor: string;
  marcaBgBadge: string;
  titulo: string;
  descripcion: string;
  categoria: CategoriaPromo;
  tipoBeneficio: '2x1' | 'Porcentaje' | 'PrecioFinal' | 'Envío Gratis';
  precioOriginal: number;
  precioPromocional: number;
  porcentajeDescuento: number;
  requiereCodigo: boolean;
  codigoCupon?: string;
  urlTiendaOnline: string;
  nombrePlataforma: string;
  seccionNombre: string;
  vigenciaHasta: string;
  semaforoValidez: 'Verde' | 'Amarillo' | 'Rojo';
  reportesPositivos: number;
  reportesNegativos: number;
  fechaUltimaVerificacion: string;
  condiciones: CondicionesOnline;
  variantesPrecios?: VariantePrecio[];
  pasosCompraOnline: string[];
  terminosYCondiciones: string[];
}

export const CATALOGO_DESCUENTOS_INICIAL: PromocionItem[] = [
  // --- BETOS LOMITOS ---
  {
    id: 201,
    marcaId: 1,
    marcaNombre: 'Betos Lomitos',
    marcaLogo: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=128&auto=format&fit=crop&q=80',
    marcaColor: 'from-amber-600 to-orange-700',
    marcaBgBadge: 'bg-amber-600/20 text-amber-300 border-amber-500/30',
    titulo: 'Promo 2x1 Lomito Clásico Completo Online',
    descripcion: '2 Lomitos Betos en pan francés tradicional o árabe con bife de lomo tierno, lechuga, tomate, mayonesa casera y papas fritas bastón.',
    categoria: 'Lomitos & Sándwiches',
    tipoBeneficio: '2x1',
    precioOriginal: 31000,
    precioPromocional: 15500,
    porcentajeDescuento: 50,
    requiereCodigo: true,
    codigoCupon: 'BETOS2X1ONLINE',
    urlTiendaOnline: 'https://betos.com.ar/',
    nombrePlataforma: 'Betos Lomitos Tienda Web',
    seccionNombre: 'Betos Online - Promociones & 2x1 en Lomitos',
    vigenciaHasta: '30 de Noviembre de 2026',
    semaforoValidez: 'Verde',
    reportesPositivos: 114,
    reportesNegativos: 3,
    fechaUltimaVerificacion: 'Hace 10 minutos',
    condiciones: {
      compraMinima: '$12.000',
      mediosDePago: 'Cualquier medio digital (Mercado Pago, Tarjeta de Crédito/Débito, MODO)',
      diasValidos: 'Lunes a Jueves de 19:30 a 23:30 hs',
      alcanceZona: 'Córdoba Capital, Rosario, CABA, GBA, Mendoza y sucursales con reparto propio',
      modalidad: 'Delivery & Retiro Web',
      limitePorUsuario: 'Hasta 2 promociones por pedido online',
      envioGratis: false
    },
    variantesPrecios: [
      {
        nombre: '2x1 Lomito Clásico + Papas (Delivery)',
        precio: 15500,
        precioOriginal: 31000,
        detalle: 'Envío estándar según zona de cobertura',
        ahorro: 15500
      },
      {
        nombre: '2x1 Lomito Especial (Jamón, Queso y Huevo)',
        precio: 18900,
        precioOriginal: 37800,
        detalle: 'Incluye porción doble de papas fritas',
        ahorro: 18900
      },
      {
        nombre: 'Take Away Web (Retiro programado en sucursal)',
        precio: 14500,
        precioOriginal: 29000,
        detalle: 'Descuento extra por retiro en mostrador online',
        ahorro: 14500
      }
    ],
    pasosCompraOnline: [
      'Ingresá al portal web oficial de Betos Lomitos haciendo clic en "Ir a Comprar Online".',
      'Seleccioná tu sucursal más cercana e ingresá tu dirección para verificar entrega.',
      'Agregá los 2 lomitos al carrito de compras.',
      'En la pantalla de pago (Checkout), pegá el cupón BETOS2X1ONLINE en la casilla de cupones.',
      'Confirmá tu método de pago online (Mercado Pago o tarjeta) y recibilo en tu casa.'
    ],
    terminosYCondiciones: [
      'Válido únicamente para órdenes realizadas por el canal web online o delivery telefónico oficial.',
      'No acumulable con promociones bancarias semanales.',
      'Sujeto a disponibilidad de lomo fresco en la sucursal seleccionada.'
    ]
  },

  // --- PEDIDOSYA (LOMITOS Y COMIDAS) ---
  {
    id: 202,
    marcaId: 2,
    marcaNombre: 'PedidosYa',
    marcaLogo: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=128&auto=format&fit=crop&q=80',
    marcaColor: 'from-rose-600 to-red-700',
    marcaBgBadge: 'bg-rose-600/20 text-rose-300 border-rose-500/30',
    titulo: '2x1 en Lomitos Cordobeses y Hamburguesas Gourmet',
    descripcion: 'Paga 1 y lleva 2 en lomitos completos al pan francés con papas rústicas en decenas de lomiterías y restaurantes adheridos en tu zona.',
    categoria: 'Lomitos & Sándwiches',
    tipoBeneficio: '2x1',
    precioOriginal: 27800,
    precioPromocional: 13900,
    porcentajeDescuento: 50,
    requiereCodigo: false,
    codigoCupon: undefined,
    urlTiendaOnline: 'https://www.pedidosya.com.ar/',
    nombrePlataforma: 'PedidosYa Argentina Delivery',
    seccionNombre: 'PedidosYa - Sección "Promos 2x1 y Descuentos del Día"',
    vigenciaHasta: '15 de Diciembre de 2026',
    semaforoValidez: 'Verde',
    reportesPositivos: 248,
    reportesNegativos: 8,
    fechaUltimaVerificacion: 'Hace 5 minutos',
    condiciones: {
      compraMinima: '$9.000',
      mediosDePago: 'PedidosYa Pagos (Tarjeta de débito/crédito, Mercado Pago, prepagas)',
      diasValidos: 'Todos los días (almuerzos y cenas)',
      alcanceZona: 'Nacional (CABA, Buenos Aires, Córdoba, Santa Fe, Tucumán, Mendoza, etc.)',
      modalidad: 'Delivery a Domicilio',
      limitePorUsuario: 'Sin límite de órdenes durante la vigencia',
      envioGratis: true
    },
    variantesPrecios: [
      {
        nombre: 'Promo 2x1 Lomito Criollo con Papas',
        precio: 13900,
        precioOriginal: 27800,
        detalle: 'Descuento aplicado directo en restaurantes con etiqueta 2x1',
        ahorro: 13900
      },
      {
        nombre: 'Combo 2x1 Lomito + Gaseosa 1.5L',
        precio: 16900,
        precioOriginal: 33800,
        detalle: 'Bebida tamaño familiar incluida',
        ahorro: 16900
      }
    ],
    pasosCompraOnline: [
      'Hacé clic en "Ir a Comprar en PedidosYa".',
      'Ingresá tu dirección de entrega para ver los locales con 2x1 en tu barrio.',
      'Entrá al filtro "2x1 y Promociones" y elegí tu lomitería preferida.',
      'El descuento del 50% / 2x1 se aplica de forma automática al agregar los 2 productos al carrito.',
      'Finalizá con tu método de pago preferido sin necesidad de tipear ningún cupón manual.'
    ],
    terminosYCondiciones: [
      'Aplica solo en comercios gastronómicos que exhiban la insignia "2x1" en la plataforma.',
      'Costo de envío bonificado para compras superiores a $12.000 o con PedidosYa Plus.',
      'Precios y disponibilidad pueden variar según el restaurante seleccionado.'
    ]
  },

  // --- RAPPI ARGENTINA ---
  {
    id: 203,
    marcaId: 3,
    marcaNombre: 'Rappi',
    marcaLogo: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=128&auto=format&fit=crop&q=80',
    marcaColor: 'from-orange-500 to-amber-600',
    marcaBgBadge: 'bg-orange-600/20 text-orange-300 border-orange-500/30',
    titulo: 'Cupón 45% OFF en Restaurantes & Lomiterías Top',
    descripcion: 'Descuento especial en tu pedido online de lomitos, hamburguesas y combos en restaurantes participantes de delivery en Argentina.',
    categoria: 'Combos',
    tipoBeneficio: 'Porcentaje',
    precioOriginal: 22000,
    precioPromocional: 12100,
    porcentajeDescuento: 45,
    requiereCodigo: true,
    codigoCupon: 'RAPPI-LOMITOS45',
    urlTiendaOnline: 'https://www.rappi.com.ar/',
    nombrePlataforma: 'Rappi Argentina Web & App',
    seccionNombre: 'Rappi - Cupones y Restaurantes con Descuento Directo',
    vigenciaHasta: '28 de Febrero de 2027',
    semaforoValidez: 'Verde',
    reportesPositivos: 182,
    reportesNegativos: 6,
    fechaUltimaVerificacion: 'Hace 15 minutos',
    condiciones: {
      compraMinima: '$11.000',
      mediosDePago: 'Tarjeta de crédito, débito, Apple Pay o RappiPay',
      diasValidos: 'Martes, Miércoles, Jueves y Domingos',
      alcanceZona: 'CABA, GBA Norte/Sur/Oeste, La Plata, Córdoba, Rosario y Mar del Plata',
      modalidad: 'Delivery a Domicilio',
      limitePorUsuario: '1 cupón por usuario por semana',
      envioGratis: false
    },
    variantesPrecios: [
      {
        nombre: 'Combo 2 Lomitos Gourmet + Papas + Bebidas',
        precio: 16500,
        precioOriginal: 30000,
        detalle: 'Con cupón RAPPI-LOMITOS45 aplicado',
        ahorro: 13500
      },
      {
        nombre: 'Lomito Individual Premium al Plato con Guarnición',
        precio: 9500,
        precioOriginal: 17200,
        detalle: 'Con cupón aplicado',
        ahorro: 7700
      }
    ],
    pasosCompraOnline: [
      'Copiá el código RAPPI-LOMITOS45 con el botón de la tarjeta.',
      'Hacé clic en "Ir a Comprar en Rappi" para abrir la tienda online.',
      'Agregá los platos de tu restaurante preferido alcanzando el mínimo de $11.000.',
      'En el carrito, hacé clic en "Ingresar cupón" y pegá RAPPI-LOMITOS45.',
      'Verificá la reducción del 45% y confirmá el envío a tu domicilio.'
    ],
    terminosYCondiciones: [
      'Tope máximo de reintegro/descuento: $14.000 por orden.',
      'Válido para usuarios registrados en Rappi Argentina.',
      'No aplica para propinas ni tarifa de servicio.'
    ]
  },

  // --- LOMITERÍAS 2X1 ARGENTINA ---
  {
    id: 204,
    marcaId: 4,
    marcaNombre: 'Lomiterías 2x1',
    marcaLogo: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=128&auto=format&fit=crop&q=80',
    marcaColor: 'from-amber-700 to-yellow-600',
    marcaBgBadge: 'bg-yellow-600/20 text-yellow-300 border-yellow-500/30',
    titulo: 'Mega Promo 2x1 Lomito XL en Pan Baguette Casero',
    descripcion: 'Dos lomitos tamaño extra grande de bife seleccionado, jamón cocido natural, queso mozzarella fundido, huevo frito a la plancha y papas bastón.',
    categoria: 'Lomitos & Sándwiches',
    tipoBeneficio: '2x1',
    precioOriginal: 34000,
    precioPromocional: 17000,
    porcentajeDescuento: 50,
    requiereCodigo: true,
    codigoCupon: 'LOMITO2X1ARG',
    urlTiendaOnline: 'https://www.pedidosya.com.ar/',
    nombrePlataforma: 'Tiendas de Lomitos Online (PedidosYa & Web)',
    seccionNombre: 'Sección Especial: 2x1 en Lomitos y Minutas Tradicionales',
    vigenciaHasta: '10 de Enero de 2027',
    semaforoValidez: 'Verde',
    reportesPositivos: 97,
    reportesNegativos: 2,
    fechaUltimaVerificacion: 'Hace 30 minutos',
    condiciones: {
      compraMinima: '$15.000',
      mediosDePago: 'Mercado Pago online, Tarjetas bancarias, Billeteras virtuales',
      diasValidos: 'Miércoles, Jueves y Viernes',
      alcanceZona: 'Córdoba, Santa Fe, Buenos Aires, Entre Ríos y San Juan',
      modalidad: 'Delivery & Retiro Web',
      limitePorUsuario: 'Hasta 3 combos por cliente',
      envioGratis: false
    },
    variantesPrecios: [
      {
        nombre: '2 Lomitos XL Clásicos + 2 Porciones de Papas',
        precio: 17000,
        precioOriginal: 34000,
        detalle: 'Pagas 1 y llevas 2',
        ahorro: 17000
      },
      {
        nombre: '2 Lomitos XL en Pan Árabe Especial',
        precio: 18500,
        precioOriginal: 37000,
        detalle: 'Pan árabe tostado a la manteca',
        ahorro: 18500
      },
      {
        nombre: 'Adicional Cerveza 1 Litro o Gaseosa',
        precio: 3500,
        precioOriginal: 5200,
        detalle: 'Precio promocional agregado al 2x1',
        ahorro: 1700
      }
    ],
    pasosCompraOnline: [
      'Copiá el cupón LOMITO2X1ARG con un solo clic.',
      'Entrá al link oficial de compra online en la lomitería o portal de delivery.',
      'Armá tu pedido con los dos sándwiches XL y elegí el punto de cocción y pan.',
      'Aplicá el código en el resumen antes de abonar para descontar el segundo lomito.',
      'Aboná online de forma segura y seguí el repartidor en tiempo real.'
    ],
    terminosYCondiciones: [
      'Aplica para órdenes entregadas a domicilio o retiro coordinado por la web.',
      'Las porciones de papas no son canjeables por ensalada en esta promo 2x1.',
      'Stock limitado a 80 combos 2x1 por día.'
    ]
  },

  // --- KFC ARGENTINA ONLINE ---
  {
    id: 205,
    marcaId: 5,
    marcaNombre: 'KFC',
    marcaLogo: 'https://upload.wikimedia.org/wikipedia/sco/b/bf/KFC_logo.svg',
    marcaColor: 'from-red-600 to-rose-700',
    marcaBgBadge: 'bg-red-700/20 text-red-300 border-red-600/30',
    titulo: 'Martes Locos Online: Bucket 8 Piezas + 4 Papas Delivery',
    descripcion: '8 piezas de pollo frito 100% crujiente receta secreta u original con 4 acompañamientos de papas regulares directo a tu domicilio.',
    categoria: 'Pollo',
    tipoBeneficio: 'Porcentaje',
    precioOriginal: 21500,
    precioPromocional: 14900,
    porcentajeDescuento: 31,
    requiereCodigo: true,
    codigoCupon: 'KFC-ONLINE30',
    urlTiendaOnline: 'https://kfc.com.ar/',
    nombrePlataforma: 'KFC Argentina Tienda Web Oficial',
    seccionNombre: 'KFC Argentina - Menú Online de Buckets & Martes Locos',
    vigenciaHasta: '31 de Diciembre de 2026',
    semaforoValidez: 'Verde',
    reportesPositivos: 156,
    reportesNegativos: 4,
    fechaUltimaVerificacion: 'Hace 8 minutos',
    condiciones: {
      compraMinima: '$10.000',
      mediosDePago: 'Mercado Pago, Tarjetas de crédito y débito en la pasarela online',
      diasValidos: 'Todos los martes y fines de semana',
      alcanceZona: 'CABA, GBA Norte, Oeste y Sur, Rosario, Mendoza',
      modalidad: 'Delivery a Domicilio',
      limitePorUsuario: 'Válido para todas las compras online',
      envioGratis: true
    },
    variantesPrecios: [
      {
        nombre: 'Bucket 8 Piezas + 4 Papas (Envío Gratis)',
        precio: 14900,
        precioOriginal: 21500,
        detalle: 'Opción más vendida online',
        ahorro: 6600
      },
      {
        nombre: 'Bucket 12 Piezas Familiar con 6 Papas y 4 Salsas',
        precio: 20800,
        precioOriginal: 29900,
        detalle: 'Ideal para 4 a 5 personas',
        ahorro: 9100
      },
      {
        nombre: 'Retiro Web en Sucursal (Take Away)',
        precio: 13900,
        precioOriginal: 21500,
        detalle: 'Ahorro extra de $1.000 por retiro propio',
        ahorro: 7600
      }
    ],
    pasosCompraOnline: [
      'Copiá el código KFC-ONLINE30 con el botón en pantalla.',
      'Hacé clic en "Ir a Comprar en KFC Argentina" para entrar al catálogo oficial.',
      'Elegí "Delivery a Domicilio" y colocá tu dirección.',
      'Sumá el Bucket Martes Locos a tu pedido y avanzá al checkout.',
      'Ingresá KFC-ONLINE30 en el campo de promociones para aplicar el 30% OFF.'
    ],
    terminosYCondiciones: [
      'Exclusivo para pedidos realizados por la plataforma online kfc.com.ar o apps de delivery oficiales.',
      'No combinable con otras promociones de menú presencial.',
      'Sujeto al radio de entrega de la sucursal más cercana.'
    ]
  },

  // --- MOSTAZA DIGITAL & DELIVERY ---
  {
    id: 206,
    marcaId: 6,
    marcaNombre: 'Mostaza',
    marcaLogo: 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Mostaza_logo.svg',
    marcaColor: 'from-amber-600 to-red-600',
    marcaBgBadge: 'bg-amber-600/20 text-amber-300 border-amber-500/30',
    titulo: '40% OFF en Combo Mega Lomito & Mega Cuarto XL Online',
    descripcion: 'Combo completo con carne 100% vacuna o lomito a la plancha, doble queso cheddar fundido, panceta crujiente, papas y gaseosa regular.',
    categoria: 'Hamburguesas',
    tipoBeneficio: 'Porcentaje',
    precioOriginal: 16500,
    precioPromocional: 9800,
    porcentajeDescuento: 40,
    requiereCodigo: true,
    codigoCupon: 'MOSTAZAONLINE40',
    urlTiendaOnline: 'https://www.mostazaweb.com.ar/',
    nombrePlataforma: 'Mostaza Digital Web & Pedidos Online',
    seccionNombre: 'Mostaza Web - Catálogo de Combos Mega y Descuentos Delivery',
    vigenciaHasta: '30 de Noviembre de 2026',
    semaforoValidez: 'Verde',
    reportesPositivos: 142,
    reportesNegativos: 5,
    fechaUltimaVerificacion: 'Hace 22 minutos',
    condiciones: {
      compraMinima: '$8.500',
      mediosDePago: 'Mercado Pago, Tarjeta de Crédito, MODO, Débito',
      diasValidos: 'Lunes a Domingos de 11:30 a 23:59 hs',
      alcanceZona: 'Nacional: CABA, GBA, Córdoba, Santa Fe, Neuquén, Mendoza, Salta',
      modalidad: 'Delivery & Retiro Web',
      limitePorUsuario: 'Hasta 2 canjes por cuenta online',
      envioGratis: false
    },
    variantesPrecios: [
      {
        nombre: 'Combo Mega Doble Cuarto XL (Delivery a Domicilio)',
        precio: 9800,
        precioOriginal: 16500,
        detalle: 'Incluye papas grandes y gaseosa',
        ahorro: 6700
      },
      {
        nombre: 'Dupla Mega: 2 Combos Mega Cuarto XL para Compartir',
        precio: 17500,
        precioOriginal: 31000,
        detalle: '2 sándwiches XL + 2 papas + 2 bebidas',
        ahorro: 13500
      },
      {
        nombre: 'Retiro en Sucursal (Take Away Web)',
        precio: 9200,
        precioOriginal: 16500,
        detalle: 'Listo para retirar sin filas',
        ahorro: 7300
      }
    ],
    pasosCompraOnline: [
      'Copiá el código MOSTAZAONLINE40.',
      'Ingresá al sitio oficial de Mostaza mediante el enlace directo.',
      'Seleccioná tu pedido delivery en la sección "Combos Mega".',
      'Pegá el cupón MOSTAZAONLINE40 en el resumen de compra.',
      'Pagá online con cualquier billetera virtual o tarjeta.'
    ],
    terminosYCondiciones: [
      'Válido para compras en la tienda oficial online de Mostaza y sucursales conectadas.',
      'No aplica para compras directas en caja sin pedido previo web.',
      'Sujeto a disponibilidad del local que asigne el sistema.'
    ]
  },

  // --- BURGER KING ONLINE ---
  {
    id: 207,
    marcaId: 7,
    marcaNombre: 'Burger King',
    marcaLogo: 'https://upload.wikimedia.org/wikipedia/commons/8/85/Burger_King_logo_%281999%29.svg',
    marcaColor: 'from-amber-500 to-red-600',
    marcaBgBadge: 'bg-amber-600/20 text-amber-300 border-amber-500/30',
    titulo: 'Mi BK Delivery: 2x1 Whopper Jr con Queso y Papas',
    descripcion: 'Paga 1 Whopper Jr con queso y papas y llevate el segundo sin cargo pidiendo desde la web o app oficial de Mi BK Delivery.',
    categoria: 'Hamburguesas',
    tipoBeneficio: '2x1',
    precioOriginal: 21800,
    precioPromocional: 10900,
    porcentajeDescuento: 50,
    requiereCodigo: true,
    codigoCupon: 'BK-DELIVERY2X1',
    urlTiendaOnline: 'https://www.burgerking.com.ar/',
    nombrePlataforma: 'Burger King Argentina Delivery Web',
    seccionNombre: 'Burger King Argentina - Menú Online y Cupones Mi BK',
    vigenciaHasta: '15 de Diciembre de 2026',
    semaforoValidez: 'Verde',
    reportesPositivos: 210,
    reportesNegativos: 7,
    fechaUltimaVerificacion: 'Hace 12 minutos',
    condiciones: {
      compraMinima: '$10.000',
      mediosDePago: 'Tarjeta de Crédito, Débito, Mercado Pago, MODO',
      diasValidos: 'Todos los días de 11:00 a 00:00 hs',
      alcanceZona: 'CABA, Gran Buenos Aires, Córdoba, Rosario, Mar del Plata y La Plata',
      modalidad: 'Delivery a Domicilio',
      limitePorUsuario: 'Válido 1 vez al día por usuario registrado',
      envioGratis: true
    },
    variantesPrecios: [
      {
        nombre: '2x1 Whopper Jr con Queso + 2 Papas Medianas',
        precio: 10900,
        precioOriginal: 21800,
        detalle: 'Envío sin cargo en compras superiores a $12.000',
        ahorro: 10900
      },
      {
        nombre: '2x1 Combo Whopper Clásico Grande (Carne 100% a la parrilla)',
        precio: 17900,
        precioOriginal: 35800,
        detalle: '2 sándwiches grandes + 2 papas grandes',
        ahorro: 17900
      }
    ],
    pasosCompraOnline: [
      'Copiá el código BK-DELIVERY2X1.',
      'Accedé al sitio oficial Burger King Argentina mediante el botón de compra.',
      'Ingresá a tu cuenta de Mi BK e indicá tu dirección de entrega.',
      'Sumá el Whopper Jr o Combo Whopper y pegá el código en el carrito.',
      'Aboná con tarjeta o billetera virtual para confirmar el despacho.'
    ],
    terminosYCondiciones: [
      'Exclusivo para órdenes canalizadas a través de Mi BK Delivery.',
      'No válido para compras presenciales en mostrador ni Auto-King.',
      'Promoción válida en Argentina hasta agotar stock asignado de 500 combos diarios.'
    ]
  },

  // --- MCDONALD'S MCDELIVERY ---
  {
    id: 208,
    marcaId: 8,
    marcaNombre: "McDonald's",
    marcaLogo: 'https://upload.wikimedia.org/wikipedia/commons/3/36/McDonald%27s_Golden_Arches.svg',
    marcaColor: 'from-red-600 to-amber-500',
    marcaBgBadge: 'bg-red-600/20 text-red-300 border-red-500/30',
    titulo: 'McDelivery Online: 35% OFF en Combo Cuarto de Libra',
    descripcion: 'Combo Mediano Cuarto de Libra con Queso: hamburguesa con doble queso cheddar, cebolla, mostaza y kétchup + papas medianas + bebida.',
    categoria: 'Combos',
    tipoBeneficio: 'Porcentaje',
    precioOriginal: 13800,
    precioPromocional: 8900,
    porcentajeDescuento: 35,
    requiereCodigo: true,
    codigoCupon: 'MC-DELIVERY35',
    urlTiendaOnline: 'https://www.mcdonalds.com.ar/apps',
    nombrePlataforma: "McDonald's McDelivery Online",
    seccionNombre: "McDonald's Argentina - McDelivery y Pide & Pasa Web",
    vigenciaHasta: '20 de Diciembre de 2026',
    semaforoValidez: 'Verde',
    reportesPositivos: 289,
    reportesNegativos: 9,
    fechaUltimaVerificacion: 'Hace 4 minutos',
    condiciones: {
      compraMinima: '$8.000',
      mediosDePago: 'Tarjetas de crédito, débito, Mercado Pago',
      diasValidos: 'Miércoles a Domingos',
      alcanceZona: 'Todo el país donde opere McDelivery o PedidosYa asociado',
      modalidad: 'Delivery & Retiro Web',
      limitePorUsuario: 'Hasta 2 combos por orden online',
      envioGratis: false
    },
    variantesPrecios: [
      {
        nombre: 'Combo Mediano Cuarto de Libra (Delivery)',
        precio: 8900,
        precioOriginal: 13800,
        detalle: 'Con cupón MC-DELIVERY35 aplicado',
        ahorro: 4900
      },
      {
        nombre: 'Dupla McDelivery: 2 Combos Cuarto de Libra',
        precio: 16200,
        precioOriginal: 27600,
        detalle: 'Para dos personas con descuento acumulable',
        ahorro: 11400
      },
      {
        nombre: 'Opción Retiro Pide & Pasa (Retiro express)',
        precio: 8400,
        precioOriginal: 13800,
        detalle: 'Comprás online y retirás sin bajarte del auto o local',
        ahorro: 5400
      }
    ],
    pasosCompraOnline: [
      'Copiá el código MC-DELIVERY35.',
      'Hacé clic en "Ir a Comprar en McDelivery" para abrir la web oficial.',
      'Ingresá tu código postal o ubicación para verificar la cobertura delivery.',
      'Añadí el Combo Cuarto de Libra a la canasta de compras.',
      'Ingresá MC-DELIVERY35 en el formulario de pago y aboná digitalmente.'
    ],
    terminosYCondiciones: [
      'Válido para compras realizadas por la plataforma digital McDelivery o apps autorizadas.',
      'No combinable con beneficios de canje en mostrador físico.',
      'Válido en la República Argentina.'
    ]
  },

  // --- WENDY'S ONLINE ---
  {
    id: 209,
    marcaId: 9,
    marcaNombre: "Wendy's",
    marcaLogo: 'https://upload.wikimedia.org/wikipedia/en/3/32/Wendy%27s_full_logo_2012.svg',
    marcaColor: 'from-blue-600 to-indigo-700',
    marcaBgBadge: 'bg-blue-600/20 text-blue-300 border-blue-500/30',
    titulo: '2x1 Son of Baconator Online con Papas Sea Salt',
    descripcion: 'Paga 1 Son of Baconator (doble medallón de carne fresca nunca congelada, queso y panceta ahumada) y llevate el segundo de regalo en tu pedido online.',
    categoria: 'Hamburguesas',
    tipoBeneficio: '2x1',
    precioOriginal: 25000,
    precioPromocional: 12500,
    porcentajeDescuento: 50,
    requiereCodigo: true,
    codigoCupon: 'WENDYS-BACON2X1',
    urlTiendaOnline: 'https://www.wendys.com.ar/',
    nombrePlataforma: "Wendy's Argentina Online Store",
    seccionNombre: "Wendy's Argentina - Menú Online y Promociones Delivery",
    vigenciaHasta: '15 de Enero de 2027',
    semaforoValidez: 'Verde',
    reportesPositivos: 78,
    reportesNegativos: 2,
    fechaUltimaVerificacion: 'Hace 18 minutos',
    condiciones: {
      compraMinima: '$12.000',
      mediosDePago: 'Cualquier tarjeta bancaria, Mercado Pago',
      diasValidos: 'Jueves y Viernes (todo el día)',
      alcanceZona: 'CABA y principales corredores gastronómicos de Buenos Aires',
      modalidad: 'Delivery a Domicilio',
      limitePorUsuario: '1 promoción 2x1 por orden',
      envioGratis: false
    },
    variantesPrecios: [
      {
        nombre: '2x1 Son of Baconator + 2 Porciones de Papas',
        precio: 12500,
        precioOriginal: 25000,
        detalle: 'Pagas 1 hamburguesa y recibes 2 completas',
        ahorro: 12500
      },
      {
        nombre: 'Upgrade Combo Familiar con Frosty Chocolate',
        precio: 16800,
        precioOriginal: 31000,
        detalle: 'Suma postre Frosty clásico al 2x1',
        ahorro: 14200
      }
    ],
    pasosCompraOnline: [
      'Copiá el código WENDYS-BACON2X1.',
      'Hacé clic en "Ir a Comprar en Wendy\'s".',
      'Configurá tu dirección de delivery en la web oficial o app asociada.',
      'Cargá el sándwich Son of Baconator en el pedido.',
      'Aplicá el cupón antes de proceder con el pago online.'
    ],
    terminosYCondiciones: [
      'Exclusivo para pedidos online de entrega a domicilio.',
      'No transferible ni canjeable por dinero en efectivo.',
      'Válido en sucursales adheridas de la red Wendy\'s Argentina.'
    ]
  },

  // --- SUBWAY ARGENTINA ONLINE ---
  {
    id: 210,
    marcaId: 10,
    marcaNombre: 'Subway',
    marcaLogo: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Subway_2016_logo.svg',
    marcaColor: 'from-emerald-600 to-green-700',
    marcaBgBadge: 'bg-emerald-600/20 text-emerald-300 border-emerald-500/30',
    titulo: 'Delivery 2x1 Sub 15cm Pollo Teriyaki o Italiano B.M.T.',
    descripcion: 'Llevate 2 sándwiches Sub 15cm a elección con pan recién horneado, vegetales frescos a gusto y salsas exclusivas en tu compra online.',
    categoria: 'Lomitos & Sándwiches',
    tipoBeneficio: '2x1',
    precioOriginal: 17800,
    precioPromocional: 8900,
    porcentajeDescuento: 50,
    requiereCodigo: true,
    codigoCupon: 'SUBWAY-ONLINE2X1',
    urlTiendaOnline: 'https://www.subway.com/es-AR',
    nombrePlataforma: 'Subway Argentina Online & Delivery',
    seccionNombre: 'Subway Argentina - Menú Online de Subs y Promociones 2x1',
    vigenciaHasta: '10 de Diciembre de 2026',
    semaforoValidez: 'Verde',
    reportesPositivos: 64,
    reportesNegativos: 1,
    fechaUltimaVerificacion: 'Hace 45 minutos',
    condiciones: {
      compraMinima: '$7.500',
      mediosDePago: 'Cualquier medio de pago online admitido en la plataforma',
      diasValidos: 'Lunes a Viernes',
      alcanceZona: 'CABA, GBA, Córdoba, Rosario, Mendoza, Tucumán',
      modalidad: 'Delivery & Retiro Web',
      limitePorUsuario: 'Hasta 2 pares por cliente',
      envioGratis: false
    },
    variantesPrecios: [
      {
        nombre: '2x1 Sub 15cm (Pollo Teriyaki o B.M.T)',
        precio: 8900,
        precioOriginal: 17800,
        detalle: 'Pagas 1 llevas 2 subs de 15cm',
        ahorro: 8900
      },
      {
        nombre: 'Upgrade a 2 Subs Footlong 30cm',
        precio: 14500,
        precioOriginal: 29000,
        detalle: 'Doble tamaño para compartir',
        ahorro: 14500
      }
    ],
    pasosCompraOnline: [
      'Copiá el código SUBWAY-ONLINE2X1 con el botón de la ficha.',
      'Accedé al sitio de Subway Argentina o canal de delivery oficial.',
      'Personalizá tus dos subs de 15cm con tu selección de panes y vegetales.',
      'Pegá el cupón en el checkout para que el segundo sub quede bonificado al 100%.',
      'Completá el pago online seguro.'
    ],
    terminosYCondiciones: [
      'Válido en la República Argentina para pedidos online.',
      'No incluye extras como doble queso ni adiciones especiales.',
      'Sujeto a disponibilidad de insumos frescos por local.'
    ]
  }
];
