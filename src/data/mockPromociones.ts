export interface PromocionItem {
  id: number;
  marcaId: number;
  marcaNombre: 'McDonald\'s' | 'Burger King' | 'Mostaza';
  marcaLogo: string;
  marcaColor: string;
  titulo: string;
  descripcion: string;
  categoria: 'Hamburguesas' | 'Combos' | 'Postres' | 'Café';
  tipoBeneficio: 'PrecioFinal' | 'Porcentaje' | '2x1' | 'ProductoGratis';
  precioOriginal: number;
  precioPromocional: number;
  porcentajeDescuento: number;
  codigoCupon: string;
  urlOrigen: string;
  requiereApp: boolean;
  requiereLogin: boolean;
  vigenciaHasta: string;
  semaforoValidez: 'Verde' | 'Amarillo' | 'Rojo';
  reportesPositivos: number;
  reportesNegativos: number;
  fechaUltimaVerificacion: string;
  restricciones: string[];
}

export const CATALOGO_DESCUENTOS_INICIAL: PromocionItem[] = [
  {
    id: 1,
    marcaId: 1,
    marcaNombre: "McDonald's",
    marcaLogo: 'https://upload.wikimedia.org/wikipedia/commons/3/36/McDonald%27s_Golden_Arches.svg',
    marcaColor: 'from-amber-500 to-red-600',
    titulo: 'Cuarto de Libra Doble + Papas Medianas',
    descripcion: 'Combo icónico con doble medallón de carne 100% vacuna, doble queso cheddar fundido y papas crujientes.',
    categoria: 'Hamburguesas',
    tipoBeneficio: 'PrecioFinal',
    precioOriginal: 12500,
    precioPromocional: 7900,
    porcentajeDescuento: 37,
    codigoCupon: 'MCD-CUARTO37',
    urlOrigen: 'https://www.mcdonalds.com.ar/cupones',
    requiereApp: true,
    requiereLogin: true,
    vigenciaHasta: '31 de Octubre de 2026',
    semaforoValidez: 'Verde',
    reportesPositivos: 24,
    reportesNegativos: 1,
    fechaUltimaVerificacion: 'Hace 45 minutos',
    restricciones: [
      'Exclusivo canje a través de la App oficial de McDonald’s',
      'Válido para consumo en mostrador o AutoMac',
      'No acumulable con otras promociones',
      'Válido en sucursales adheridas de todo el país'
    ]
  },
  {
    id: 2,
    marcaId: 2,
    marcaNombre: 'Burger King',
    marcaLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Burger_King_2020.svg/800px-Burger_King_2020.svg.png',
    marcaColor: 'from-orange-500 to-amber-700',
    titulo: '2x1 en Whopper Clásico a la Parrilla',
    descripcion: 'Llevá 2 Whopper Clásicos con carne a la parrilla, tomate, lechuga y mayonesa al precio de una sola.',
    categoria: 'Combos',
    tipoBeneficio: '2x1',
    precioOriginal: 14000,
    precioPromocional: 7000,
    porcentajeDescuento: 50,
    codigoCupon: 'BK-WHOPP2X1',
    urlOrigen: 'https://www.burgerking.com.ar/cupones',
    requiereApp: true,
    requiereLogin: false,
    vigenciaHasta: '28 de Octubre de 2026',
    semaforoValidez: 'Verde',
    reportesPositivos: 42,
    reportesNegativos: 3,
    fechaUltimaVerificacion: 'Hace 1 hora',
    restricciones: [
      'Presentar código desde la app en caja',
      'No incluye bebidas ni papas fritas',
      'Límite de 2 promociones por persona por día'
    ]
  },
  {
    id: 3,
    marcaId: 3,
    marcaNombre: 'Mostaza',
    marcaLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Logo_Mostaza.png',
    marcaColor: 'from-rose-600 to-red-800',
    titulo: 'Mega Cuarto XL con 30% OFF en Efectivo o MP',
    descripcion: 'Mega hamburguesa con queso cheddar artesanal, cebolla fresca y aderezos especiales en pan suave con sésamo.',
    categoria: 'Hamburguesas',
    tipoBeneficio: 'Porcentaje',
    precioOriginal: 11000,
    precioPromocional: 7700,
    porcentajeDescuento: 30,
    codigoCupon: 'MOST-MEGA30',
    urlOrigen: 'https://www.mostazaweb.com.ar/promociones',
    requiereApp: false,
    requiereLogin: false,
    vigenciaHasta: '15 de Noviembre de 2026',
    semaforoValidez: 'Verde',
    reportesPositivos: 18,
    reportesNegativos: 0,
    fechaUltimaVerificacion: 'Hace 2 horas',
    restricciones: [
      'No requiere app instalada: podés mostrar el código en caja',
      'Válido pagando con efectivo, tarjeta de débito o QR Mercado Pago',
      'Disponible en locales físicos de todo el país'
    ]
  },
  {
    id: 4,
    marcaId: 1,
    marcaNombre: "McDonald's",
    marcaLogo: 'https://upload.wikimedia.org/wikipedia/commons/3/36/McDonald%27s_Golden_Arches.svg',
    marcaColor: 'from-amber-500 to-red-600',
    titulo: 'Sundae de Dulce de Leche o Chocolate Gratis',
    descripcion: 'Con la compra de cualquier Combo Mediano o Grande, llevate un postre Sundae sin costo adicional.',
    categoria: 'Postres',
    tipoBeneficio: 'ProductoGratis',
    precioOriginal: 4500,
    precioPromocional: 0,
    porcentajeDescuento: 100,
    codigoCupon: 'MCD-SUNDAE0',
    urlOrigen: 'https://www.mcdonalds.com.ar/cupones',
    requiereApp: true,
    requiereLogin: true,
    vigenciaHasta: '25 de Octubre de 2026',
    semaforoValidez: 'Verde',
    reportesPositivos: 31,
    reportesNegativos: 2,
    fechaUltimaVerificacion: 'Hace 3 horas',
    restricciones: [
      'Requiere escanear cupón al momento de comprar el combo',
      'Sujeto a disponibilidad de sabores en la sucursal'
    ]
  },
  {
    id: 5,
    marcaId: 2,
    marcaNombre: 'Burger King',
    marcaLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Burger_King_2020.svg/800px-Burger_King_2020.svg.png',
    marcaColor: 'from-orange-500 to-amber-700',
    titulo: 'Combo Stacker Doble con 40% OFF',
    descripcion: 'Doble medallón a la parrilla, salsa Stacker secreta, abundante panceta crocante y queso cheddar.',
    categoria: 'Combos',
    tipoBeneficio: 'Porcentaje',
    precioOriginal: 13500,
    precioPromocional: 8100,
    porcentajeDescuento: 40,
    codigoCupon: 'BK-STACKER40',
    urlOrigen: 'https://www.burgerking.com.ar/cupones',
    requiereApp: true,
    requiereLogin: false,
    vigenciaHasta: '5 de Noviembre de 2026',
    semaforoValidez: 'Verde',
    reportesPositivos: 15,
    reportesNegativos: 1,
    fechaUltimaVerificacion: 'Hace 5 horas',
    restricciones: [
      'Válido en días de semana (Lunes a Viernes)',
      'Incluye papas regulares y gaseosa mediana'
    ]
  },
  {
    id: 6,
    marcaId: 3,
    marcaNombre: 'Mostaza',
    marcaLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Logo_Mostaza.png',
    marcaColor: 'from-rose-600 to-red-800',
    titulo: 'Desayuno / Merienda: Café + 2 Medialunas',
    descripcion: 'Café tostado recién elaborado (jarrito o para llevar) acompañado de dos medialunas de manteca.',
    categoria: 'Café',
    tipoBeneficio: 'PrecioFinal',
    precioOriginal: 5200,
    precioPromocional: 3200,
    porcentajeDescuento: 38,
    codigoCupon: 'MOST-CAFE38',
    urlOrigen: 'https://www.mostazaweb.com.ar/promociones',
    requiereApp: false,
    requiereLogin: false,
    vigenciaHasta: '30 de Noviembre de 2026',
    semaforoValidez: 'Verde',
    reportesPositivos: 11,
    reportesNegativos: 0,
    fechaUltimaVerificacion: 'Hace 4 horas',
    restricciones: [
      'Válido hasta las 11:30 hs y entre 16:00 y 19:30 hs',
      'No requiere app instalada'
    ]
  }
];
