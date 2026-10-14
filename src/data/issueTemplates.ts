import { IssueTemplate } from '../types/github';

export interface MvpIssueItem {
  id: string;
  number: number;
  title: string;
  module: 'Backend & Datos' | 'Frontend & Cliente' | 'Arquitectura & DB';
  description: string;
  labels: string[];
  body: string;
  criteriosAceptacion: string[];
}

export const MVP_ISSUES: MvpIssueItem[] = [
  {
    id: 'issue-1-arq-backend',
    number: 1,
    title: '[BACKEND] Arquitectura Base C# .NET con MySQL: Capas Entity, DTO, Repository, Service',
    module: 'Arquitectura & DB',
    description: 'Configuración de la solución unificada en C# .NET y MySQL con separación de capas por tecnología y submódulos por funcionalidad.',
    labels: ['backend', 'csharp', 'mysql', 'architecture'],
    criteriosAceptacion: [
      'Configuración de Pomelo.EntityFrameworkCore.MySql en appsettings.json',
      'Estructura de carpetas por tecnología: Entities, DTOs, Repositories, Services, Controllers',
      'Subdivisiones internas por funcionalidad (Promociones, Ingesta, Feedback, Marcas)',
      'Inyección de dependencias configurada en Program.cs',
      'DbContext con entidades maestras y relaciones'
    ],
    body: `### 📌 Contexto y Objetivo
Configurar la base del proyecto en C# .NET conectada a base de datos MySQL (Entity Framework Core), respetando la arquitectura requerida: división por tecnología (capas: Entity, DTO, Repositorio, Servicio, Controlador) y sub-dividida por funcionalidad (Promociones, Ingesta, Feedback).

### 🛠️ Especificación Técnica
- **Framework:** .NET 8 / 9 Web API
- **ORM:** Entity Framework Core + Pomelo.EntityFrameworkCore.MySql
- **Estructura:**
  - \`/Entities/Promociones\`, \`/Entities/Ingesta\`, \`/Entities/Feedback\`
  - \`/DTOs/Promociones\`, \`/DTOs/Ingesta\`, \`/DTOs/Feedback\`
  - \`/Repositories/Promociones\`, \`/Repositories/Feedback\`
  - \`/Services/Promociones\`, \`/Services/Ingesta\`, \`/Services/Feedback\`
  - \`/Controllers/PromocionesController.cs\`, \`/Controllers/IngestaController.cs\`

### 📋 Criterios de Aceptación
- [ ] Conexión a MySQL funcional con cadena de conexión segura en \`appsettings.json\`.
- [ ] Aplicación de migraciones iniciales para crear las tablas en MySQL.
- [ ] Inyección de dependencias para interfaces de repositorios y servicios en \`Program.cs\`.
- [ ] Swagger / OpenAPI configurado para probar los endpoints.`
  },
  {
    id: 'issue-2-db-schema',
    number: 2,
    title: '[DATABASE] Modelo Relacional MySQL y Migraciones EF Core para Descuentos y Feedback',
    module: 'Arquitectura & DB',
    description: 'Diseño del esquema de base de datos MySQL para comercios (McDonalds, Burger King, Mostaza), cupones, restricciones y retroalimentación.',
    labels: ['database', 'mysql', 'schema'],
    criteriosAceptacion: [
      'Tabla Comercios/Marcas con metadatos y logos',
      'Tabla Promociones con precios, porcentajes, vigencia y clave única',
      'Tabla Restricciones con días, horarios, medios de pago y apps',
      'Tabla ReportesFeedback con semáforo de validez comunitaria',
      'Índices para búsquedas optimizadas por marca y vigencia'
    ],
    body: `### 📌 Objetivo
Crear el modelo de datos relacional en MySQL para almacenar el catálogo unificado de promociones de comida rápida, optimizando la lectura y deduplicación.

### 📋 Tablas e Índices
- \`Marcas\`: Id, Nombre (McDonald's, Burger King, Mostaza), UrlBase, LogoUrl, Activo.
- \`Promociones\`: Id, MarcaId, Titulo, Descripcion, TipoBeneficio, PrecioOriginal, PrecioPromocional, PorcentajeDescuento, CodigoCupon, UrlOrigen, RequiereApp, RequiereLogin, VigenciaHasta, ClaveUnicaHash, Estado, FechaUltimaVerificacion.
- \`Restricciones\`: Id, PromocionId, Tipo (MedioPago, Horario, Local, etc.), Descripcion.
- \`FeedbackReportes\`: Id, PromocionId, TipoReporte (Funciono, NoFunciono, Vencida, DatoIncorrecto), Comentario, FechaCreacion.

### 📋 Criterios de Aceptación
- [ ] Script DDL SQL ejecutable en MySQL 8+.
- [ ] Índice único sobre \`ClaveUnicaHash\` para garantizar upsert sin duplicados.
- [ ] Relaciones con borrado en cascada o restricción íntegra.`
  },
  {
    id: 'issue-3-ingesta-scraping',
    number: 3,
    title: '[BACKEND] Pipeline de Extracción Automatizado y Asistido para 3 Marcas Clave',
    module: 'Backend & Datos',
    description: 'Servicio en C# para capturar datos crudos (HTML/JSON/Texto e imágenes) periódicamente de McDonald’s, Burger King y Mostaza.',
    labels: ['backend', 'scraping', 'ingesta', 'csharp'],
    criteriosAceptacion: [
      'Scraping acotado a fuentes públicas de McDonald’s, Burger King y Mostaza',
      'Módulo de ingesta asistida para procesar imágenes con promociones (OCR)',
      'Manejo de reintentos y tolerancia a fallos ante cambios en sitios web',
      'Registro de auditoría de lecturas y fallos por fuente'
    ],
    body: `### 📌 Objetivo
Implementar el servicio de extracción periódica de promociones crudas desde las 3 marcas seleccionadas, evitando dependencia de interfaces manuales pero permitiendo carga asistida por imágenes mediante OCR.

### 📋 Tareas
- [ ] Servicio \`IIngestaScrapingService\` con implementación para cada una de las 3 marcas.
- [ ] Integración de OCR (Tesseract / Cloud Vision o lectura estructurada) para folletos o cupones en imagen.
- [ ] Guardado de datos crudos para trazabilidad en caso de contingencia técnica.
- [ ] Tarea programada (HostedService / BackgroundService) para ejecución diaria.`
  },
  {
    id: 'issue-4-parser-llm',
    number: 4,
    title: '[BACKEND] Parser, Estructurador y Filtro de Restricciones vía LLM (Inteligencia Artificial)',
    module: 'Backend & Datos',
    description: 'Procesamiento de texto/imágenes crudas mediante IA para normalizar en JSON estricto con precios, fechas, código y letra chica.',
    labels: ['backend', 'ai', 'llm', 'normalization'],
    criteriosAceptacion: [
      'Prompt engineering con salida JSON estructurada garantizada',
      'Extracción precisa de marca, producto, precio anterior, precio promo y % ahorro',
      'Normalización de vigencias y fechas al formato estándar YYYY-MM-DD',
      'Detección explícita de letra chica: medio de pago, días permitidos y si exige app/login'
    ],
    body: `### 📌 Objetivo
Transformar el contenido desestructurado y heterogéneo extraído de los sitios de comida rápida en una ficha de promoción estandarizada y normalizada mediante un modelo de lenguaje (LLM).

### 📋 Estructura JSON esperada:
\`\`\`json
{
  "marca": "McDonald's",
  "producto": "Cuarto de Libra Doble",
  "precioOriginal": 12000.0,
  "precioPromocional": 7900.0,
  "porcentajeDescuento": 34,
  "codigoCupon": "MCD2026",
  "vigenciaHasta": "2026-10-31",
  "requiereApp": true,
  "requiereLogin": false,
  "restricciones": ["Válido solo de lunes a jueves", "Excluye delivery"]
}
\`\`\`

### 📋 Criterios de Aceptación
- [ ] Servicio \`ILlmParserService\` implementado en C# consumiendo API de Gemini.
- [ ] Mecanismo de fallback si el modelo retorna datos incompletos.
- [ ] Pruebas unitarias con ejemplos reales de las 3 marcas.`
  },
  {
    id: 'issue-5-deduplicacion-upsert',
    number: 5,
    title: '[BACKEND] Lógica de Limpieza, Deduplicación y Upsert en MySQL con Expiración Pasiva',
    module: 'Backend & Datos',
    description: 'Motor de reglas con hash único por oferta (comercio + título/código) para actualizar existentes, descartar duplicados y ocultar vencidas.',
    labels: ['backend', 'mysql', 'deduplication', 'business-logic'],
    criteriosAceptacion: [
      'Generación de hash SHA256 único por oferta',
      'Lógica de Upsert: actualiza precio/vigencia si ya existe, crea si es nueva',
      'Filtro pasivo automático que oculta ofertas con fecha de vigencia superada',
      'Ocultamiento preventivo si acumula reportes críticos de la comunidad'
    ],
    body: `### 📌 Objetivo
Garantizar la consistencia del catálogo, evitando que lecturas repetidas generen duplicados en la base de datos MySQL, y desactivando automáticamente ofertas que ya no tengan vigencia o fallen repetidamente.

### 📋 Reglas de Negocio
1. **Deduplicación:** \`hash = SHA256(MarcaId + TituloNormalizado + CodigoCupon)\`.
2. **Upsert:** Si la clave existe, se actualiza \`FechaUltimaVerificacion\` y precios. Si no existe, se inserta registro nuevo.
3. **Expiración Pasiva:** \`WHERE VigenciaHasta >= CURDATE() AND Estado = 'Activo'\`.
4. **Semáforo Comunitario:** Si el ratio de \`NoFuncionó\` supera el 70% con al menos 5 reportes, marcar como \`EnRevision\`.`
  },
  {
    id: 'issue-6-front-feed',
    number: 6,
    title: '[FRONTEND] Feed Visual Unificado con Buscador, Selector de Marcas y Preferencias',
    module: 'Frontend & Cliente',
    description: 'Interfaz en React optimizada para móviles con catálogo de las 3 marcas, captura ágil de preferencias y filtros en vivo.',
    labels: ['frontend', 'react', 'tailwind', 'ui'],
    criteriosAceptacion: [
      'Feed responsivo optimizado para navegación ágil en smartphones',
      'Captura ágil de hasta 3 categorías o marcas preferidas (guardadas en localStorage)',
      'Buscador por texto y chips de filtro por marca (McDonalds, Burger King, Mostaza)',
      'Etiqueta visual transparente: "Coincide con tu preferencia por #Hamburguesas"',
      'Zero-login: no requiere registro ni login para usar la aplicación'
    ],
    body: `### 📌 Objetivo
Construir la experiencia del usuario final en React (SPA): un feed de cupones rápido, limpio, sin inicio de sesión obligatorio, que personalice el catálogo según las preferencias temporales del usuario.

### 📋 Componentes React a Desarrollar
- \`PreferenciasModal.tsx\`: Selección rápida de gustos al entrar (máx 3 categorías).
- \`CatalogoFeed.tsx\`: Grilla responsiva de tarjetas de descuentos.
- \`FiltrosBar.tsx\`: Buscador reactivo y selector por marca y rango de precio.
- \`TarjetaOferta.tsx\`: Resumen con porcentaje de descuento, precio final y etiqueta de coincidencia.`
  },
  {
    id: 'issue-7-front-detalle-canje',
    number: 7,
    title: '[FRONTEND] Ficha Detallada del Descuento y Mecanismo de Canje Rápido (Deep Linking)',
    module: 'Frontend & Cliente',
    description: 'Modal con toda la información estructurada, letra chica, botón de copia automática de cupón y redirección a la app oficial.',
    labels: ['frontend', 'react', 'ux', 'deeplink'],
    criteriosAceptacion: [
      'Visualización de porcentaje de ahorro, precio original tachado y precio final',
      'Alerta explícita si el destino exige app nativa, registro o cupón físico',
      'Botón de canje en 1 toque: copia el código al portapapeles y abre enlace profundo',
      'Indicador de última verificación técnica ("Verificado hace 2 horas")'
    ],
    body: `### 📌 Objetivo
Eliminar la fricción al momento de utilizar la promoción: el usuario ve la información clara, comprende las condiciones ("letra chica") y puede canjearla en la plataforma del restaurante en un solo toque.

### 📋 Requerimientos
- [ ] Botón \`Canjear Descuento\`:
  - Copia automática del \`codigoCupon\` al portapapeles con toast de confirmación.
  - Apertura del enlace oficial (Deep link a la app de la marca o web oficial).
- [ ] Avisos previos claros si requiere app instalada o registro previo en la marca.`
  },
  {
    id: 'issue-8-front-feedback-loop',
    number: 8,
    title: '[FRONTEND & BACKEND] Bucle de Retroalimentación Inmediata (Feedback Loop y Reportes)',
    module: 'Frontend & Cliente',
    description: 'Mecanismo para que los usuarios califiquen si la oferta funcionó y reporten cupones vencidos o precios erróneos.',
    labels: ['frontend', 'backend', 'feedback', 'quality'],
    criteriosAceptacion: [
      'Botones rápidos "¿Te funcionó?" (👍 Sí / 👎 No)',
      'Formulario breve de reporte de error o cupón vencido',
      'Ajuste dinámico del orden del feed según la calificación',
      'Indicador semáforo de validez pública en la tarjeta de oferta'
    ],
    body: `### 📌 Objetivo
Permitir que la comunidad valide en tiempo real las ofertas sin depender exclusivamente del scraper, aportando evidencia social de cupones vigentes o caídos.

### 📋 Criterios de Aceptación
- [ ] Endpoint \`POST /api/feedback/calificar\` (\`PromocionId\`, \`Exitoso\`).
- [ ] Endpoint \`POST /api/feedback/reportar\` (\`PromocionId\`, \`Motivo\`, \`Detalle\`).
- [ ] Componente React \`FeedbackPrompt.tsx\` al regresar a la aplicación tras abrir el deep link.
- [ ] Impacto visible en el indicador semáforo de la oferta (Verde: Validada, Amarillo: Dudosa, Rojo: Vencida).`
  },
  {
    id: 'issue-9-api-integracion',
    number: 9,
    title: '[INTEGRACIÓN] Endpoints RESTful en C# .NET y Conexión Frontend React',
    module: 'Arquitectura & DB',
    description: 'Exposición de endpoints REST documentados con Swagger y cliente HTTP en React para consumo del catálogo.',
    labels: ['backend', 'frontend', 'api', 'integration'],
    criteriosAceptacion: [
      'GET /api/promociones con paginación, filtros de marca y búsqueda',
      'GET /api/promociones/{id} para ficha detallada',
      'POST /api/ingesta/trigger para ejecución programada o manual de prueba',
      'Cliente API en React con Axios o Fetch y manejo de loading/errores'
    ],
    body: `### 📌 Objetivo
Integrar el frontend React con la Web API en C# .NET, conectando la persistencia de datos en MySQL con la interfaz de usuario.

### 📋 Endpoints Clave
- \`GET /api/promociones?marca=mcdonalds&categoria=hamburguesas&q=cuarto\`
- \`GET /api/promociones/destacadas\`
- \`GET /api/marcas\`
- \`POST /api/feedback\`
- \`POST /api/ingesta/ejecutar-scraping\``
  }
];

export const PROGRAMACION_III_TEMPLATES: IssueTemplate[] = MVP_ISSUES.map((issue) => ({
  id: issue.id,
  title: issue.title,
  description: issue.description,
  labels: issue.labels,
  defaultTitle: issue.title,
  body: issue.body,
}));
