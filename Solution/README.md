# Centralizador Inteligente de Descuentos (Comida Rápida) - MVP

Solución unificada con arquitectura limpia organizada **por tecnología (capas)** y sub-dividida **por funcionalidad** dentro de cada tecnología.

## 🏗️ Arquitectura de la Solución (C# + MySQL + React)

```text
CentralizadorDescuentos/
├── CentralizadorDescuentos.sln               # Solución de Visual Studio
├── CentralizadorDescuentos.csproj             # Proyecto Web API .NET 8/9
├── Program.cs                                 # Inyección de dependencias y pipeline HTTP
├── appsettings.json                           # Cadena de conexión MySQL y configuración
│
├── Data/                                      # Contexto de persistencia
│   └── ApplicationDbContext.cs                # EF Core configurado con Pomelo MySQL
│
├── Database/                                  # Scripts SQL DDL
│   └── schema_mysql.sql                       # Esquema de tablas, índices y datos iniciales
│
├── Entities/                                  # Entidades de dominio (Tablas MySQL)
│   ├── Promociones/
│   │   ├── Promocion.cs                       # Entidad principal con clave única de upsert
│   │   └── Restriccion.cs                     # Letra chica (días, medios de pago, local)
│   ├── Marcas/
│   │   └── Marca.cs                           # McDonald's, Burger King, Mostaza
│   ├── Feedback/
│   │   └── ReporteFeedback.cs                 # Calificaciones y reportes de usuario
│   └── Ingesta/
│       └── RegistroIngesta.cs                 # Trazabilidad de scraping y OCR
│
├── DTOs/                                      # Contratos de transferencia de datos
│   ├── Promociones/
│   │   ├── PromocionDto.cs                    # Datos normalizados para el frontend
│   │   └── FiltroPromocionDto.cs              # Parámetros de búsqueda y filtros
│   ├── Feedback/
│   │   └── CrearFeedbackDto.cs                # Calificación "Me funcionó" y reportes
│   └── Ingesta/
│       └── OfertaCrudaDto.cs                  # Datos capturados antes del parseo LLM
│
├── Repositories/                              # Acceso a datos
│   ├── Interfaces/
│   │   ├── IPromocionRepository.cs
│   │   └── IFeedbackRepository.cs
│   ├── Promociones/
│   │   └── PromocionRepository.cs             # Consultas optimizadas con EF Core en MySQL
│   └── Feedback/
│       └── FeedbackRepository.cs
│
├── Services/                                  # Lógica de negocio y reglas del MVP
│   ├── Interfaces/
│   │   ├── IPromocionService.cs
│   │   ├── IIngestaScrapingService.cs
│   │   └── ILlmParserService.cs
│   ├── Promociones/
│   │   └── PromocionService.cs                # Recomendación por preferencias y semáforo
│   ├── Ingesta/
│   │   ├── ScrapingService.cs                 # Extracción periódica de las 3 marcas
│   │   ├── LlmParserService.cs                # Normalización con Gemini IA
│   │   └── DeduplicacionService.cs            # Motor de Upsert y hash único
│   └── Feedback/
│       └── FeedbackService.cs
│
├── Controllers/                               # Controladores REST API
│   ├── Promociones/
│   │   └── PromocionesController.cs           # Endpoints públicos para el feed
│   ├── Feedback/
│   │   └── FeedbackController.cs              # Recepción de calificaciones y reportes
│   └── Ingesta/
│       └── IngestaController.cs               # Triggers de extracción automática/asistida
│
└── ClientApp/                                 # Frontend SPA en React + Vite + Tailwind
    └── src/
        ├── components/                        # Dividido por funcionalidad
        │   ├── promociones/                   # CatalogoFeed, TarjetaOferta, FichaDetalle
        │   ├── feedback/                      # FeedbackPrompt, ReporteModal
        │   └── preferencias/                  # Selector de gustos inicial
        ├── services/                          # Cliente API REST
        └── types/                             # Tipos TypeScript
```

## 🚀 Puesta en Marcha

### 1. Base de Datos MySQL
Importar el archivo `Database/schema_mysql.sql` en tu servidor MySQL (local, Docker o Cloud):
```bash
mysql -u root -p < Database/schema_mysql.sql
```

### 2. Backend C# .NET
Configurar la cadena de conexión en `appsettings.json` y ejecutar:
```bash
dotnet restore
dotnet run
```
Acceder a Swagger en: `https://localhost:7001/swagger`

### 3. Frontend React
```bash
cd ClientApp
npm install
npm run dev
```
