#!/usr/bin/env node

/**
 * Script para subir automáticamente las 9 Issues del MVP a GitHub
 * Uso:
 *   GITHUB_TOKEN=tu_personal_access_token node scripts/upload_issues_to_github.js [nombre_del_repo]
 *
 * Ejemplo:
 *   GITHUB_TOKEN=ghp_xxxx node scripts/upload_issues_to_github.js OfertasProgramacionIII
 */

import https from 'node:https';

const OWNER = 'JoaquinRiveroAlvarez';
const REPO = process.argv[2] || 'OfertasProgramacionIII';
const TOKEN = process.env.GITHUB_TOKEN;

if (!TOKEN) {
  console.error('\n❌ ERROR: Se requiere la variable de entorno GITHUB_TOKEN.');
  console.log('Ejemplo de ejecución:');
  console.log(`  GITHUB_TOKEN=ghp_tu_token node scripts/upload_issues_to_github.js ${REPO}\n`);
  process.exit(1);
}

const ISSUES = [
  {
    title: '[BACKEND] Arquitectura Base C# .NET con MySQL: Capas Entity, DTO, Repository, Service',
    labels: ['backend', 'csharp', 'mysql', 'architecture'],
    body: `### 📌 Contexto y Objetivo
Configurar la base del proyecto en C# .NET conectada a base de datos MySQL (Entity Framework Core), respetando la arquitectura requerida: división por tecnología (capas: Entity, DTO, Repositorio, Servicio, Controlador) y sub-dividida por funcionalidad (Promociones, Ingesta, Feedback).

### 📋 Criterios de Aceptación
- [ ] Conexión a MySQL funcional con cadena de conexión en appsettings.json
- [ ] Estructura de carpetas por tecnología y por funcionalidad
- [ ] DbContext configurado con Pomelo.EntityFrameworkCore.MySql
- [ ] Inyección de dependencias para repositorios y servicios en Program.cs
- [ ] Swagger / OpenAPI configurado para probar los endpoints.`
  },
  {
    title: '[DATABASE] Modelo Relacional MySQL y Migraciones EF Core para Descuentos y Feedback',
    labels: ['database', 'mysql', 'schema'],
    body: `### 📌 Objetivo
Crear el modelo de datos relacional en MySQL para almacenar el catálogo unificado de promociones de comida rápida (McDonald's, Burger King, Mostaza), optimizando la lectura y deduplicación.

### 📋 Criterios de Aceptación
- [ ] Tabla Marcas con metadatos y logos
- [ ] Tabla Promociones con precios, porcentajes, vigencia y clave única
- [ ] Tabla Restricciones con días, horarios, medios de pago y apps
- [ ] Tabla ReportesFeedback con semáforo de validez comunitaria
- [ ] Índices para búsquedas optimizadas por marca y vigencia.`
  },
  {
    title: '[BACKEND] Pipeline de Extracción Automatizado y Asistido para 3 Marcas Clave',
    labels: ['backend', 'scraping', 'ingesta', 'csharp'],
    body: `### 📌 Objetivo
Implementar el servicio de extracción periódica de promociones crudas desde McDonald’s, Burger King y Mostaza, con soporte para ingesta asistida por imágenes mediante OCR.

### 📋 Criterios de Aceptación
- [ ] Servicio IIngestaScrapingService con implementación para las 3 marcas
- [ ] Integración de OCR para folletos o cupones en formato imagen
- [ ] Guardado de datos crudos para trazabilidad
- [ ] Tarea programada (BackgroundService) para ejecución periódica diaria.`
  },
  {
    title: '[BACKEND] Parser, Estructurador y Filtro de Restricciones vía LLM (Inteligencia Artificial)',
    labels: ['backend', 'ai', 'llm', 'normalization'],
    body: `### 📌 Objetivo
Transformar el contenido desestructurado extraído de los sitios en un JSON estricto y normalizado mediante Inteligencia Artificial (LLM).

### 📋 Criterios de Aceptación
- [ ] Prompt engineering con salida JSON estructurada garantizada
- [ ] Extracción precisa de marca, producto, precio original, precio promo y % ahorro
- [ ] Normalización de vigencias y fechas al formato estándar YYYY-MM-DD
- [ ] Detección explícita de letra chica: medio de pago, días permitidos y si exige app/login.`
  },
  {
    title: '[BACKEND] Lógica de Limpieza, Deduplicación y Upsert en MySQL con Expiración Pasiva',
    labels: ['backend', 'mysql', 'deduplication', 'business-logic'],
    body: `### 📌 Objetivo
Garantizar la consistencia del catálogo, evitando duplicados mediante hash SHA256 único y ocultando automáticamente ofertas vencidas o reportadas como fallidas.

### 📋 Criterios de Aceptación
- [ ] Generación de hash SHA256 único por oferta
- [ ] Lógica de Upsert: actualiza si existe, crea si es nueva
- [ ] Filtro pasivo automático que oculta ofertas con fecha de vigencia superada
- [ ] Ocultamiento preventivo si acumula reportes críticos de la comunidad.`
  },
  {
    title: '[FRONTEND] Feed Visual Unificado con Buscador, Selector de Marcas y Preferencias',
    labels: ['frontend', 'react', 'tailwind', 'ui'],
    body: `### 📌 Objetivo
Construir la experiencia del usuario final en React (SPA): un feed de cupones rápido, limpio, sin inicio de sesión obligatorio, que personalice el catálogo según las preferencias temporales del usuario.

### 📋 Criterios de Aceptación
- [ ] Feed responsivo optimizado para navegación en smartphones
- [ ] Captura ágil de hasta 3 categorías o marcas preferidas (en localStorage)
- [ ] Buscador reactivo y selector por marca y rango de precio
- [ ] Etiqueta visual transparente: "Coincide con tu preferencia"
- [ ] Zero-login: no requiere registro ni login para usar la aplicación.`
  },
  {
    title: '[FRONTEND] Ficha Detallada del Descuento y Mecanismo de Canje Rápido (Deep Linking)',
    labels: ['frontend', 'react', 'ux', 'deeplink'],
    body: `### 📌 Objetivo
Eliminar la fricción al momento de utilizar la promoción: el usuario ve la información clara, comprende las condiciones ("letra chica") y puede canjearla en la plataforma del restaurante en un solo toque.

### 📋 Criterios de Aceptación
- [ ] Visualización de porcentaje de ahorro, precio original tachado y precio final
- [ ] Alerta explícita si el destino exige app nativa, registro o cupón físico
- [ ] Botón de canje en 1 toque: copia el código al portapapeles y abre enlace profundo
- [ ] Indicador de última verificación técnica ("Verificado hace 2 horas").`
  },
  {
    title: '[FRONTEND & BACKEND] Bucle de Retroalimentación Inmediata (Feedback Loop y Reportes)',
    labels: ['frontend', 'backend', 'feedback', 'quality'],
    body: `### 📌 Objetivo
Permitir que la comunidad valide en tiempo real las ofertas sin depender exclusivamente del scraper, aportando evidencia social de cupones vigentes o caídos.

### 📋 Criterios de Aceptación
- [ ] Botones rápidos "¿Te funcionó?" (👍 Sí / 👎 No)
- [ ] Formulario breve de reporte de error o cupón vencido
- [ ] Ajuste dinámico del orden del feed según la calificación
- [ ] Indicador semáforo de validez pública en la tarjeta de oferta.`
  },
  {
    title: '[INTEGRACIÓN] Endpoints RESTful en C# .NET y Conexión Frontend React',
    labels: ['backend', 'frontend', 'api', 'integration'],
    body: `### 📌 Objetivo
Integrar el frontend React con la Web API en C# .NET, conectando la persistencia de datos en MySQL con la interfaz de usuario.

### 📋 Criterios de Aceptación
- [ ] GET /api/promociones con paginación, filtros de marca y búsqueda
- [ ] GET /api/promociones/{id} para ficha detallada
- [ ] POST /api/feedback para calificación comunitaria
- [ ] POST /api/ingesta/trigger para ejecución programada o manual
- [ ] Cliente API en React con Axios o Fetch y manejo de loading/errores.`
  }
];

function postIssue(issue) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(issue);
    const options = {
      hostname: 'api.github.com',
      port: 443,
      path: `/repos/${OWNER}/${REPO}/issues`,
      method: 'POST',
      headers: {
        'User-Agent': 'Node-Issue-Uploader',
        'Authorization': `Bearer ${TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(body));
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function run() {
  console.log(`\n🚀 Iniciando subida de ${ISSUES.length} issues a https://github.com/${OWNER}/${REPO}...\n`);

  for (let i = 0; i < ISSUES.length; i++) {
    const issue = ISSUES[i];
    try {
      const res = await postIssue(issue);
      console.log(`✅ [${i + 1}/${ISSUES.length}] Creada Issue #${res.number}: ${res.title}`);
      console.log(`   🔗 ${res.html_url}`);
      await new Promise(r => setTimeout(r, 600));
    } catch (err) {
      console.error(`❌ Error al crear issue "${issue.title}":`, err.message);
    }
  }

  console.log(`\n🎉 ¡Finalizado! Revisá tus issues en: https://github.com/${OWNER}/${REPO}/issues\n`);
}

run();
