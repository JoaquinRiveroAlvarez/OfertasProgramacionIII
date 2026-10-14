import React, { useState } from 'react';
import {
  Terminal,
  Play,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Code2,
  ChevronDown,
  ChevronUp,
  Server
} from 'lucide-react';

export const SwaggerLivePreview: React.FC = () => {
  const [activeEndpoint, setActiveEndpoint] = useState<string>('get-promos');
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [filterMarca, setFilterMarca] = useState('mcdonalds');
  const [filterPref, setFilterPref] = useState('hamburguesas');
  const [testResponse, setTestResponse] = useState<string | null>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);

  const endpoints = [
    {
      id: 'get-promos',
      method: 'GET',
      path: '/api/Promociones',
      desc: 'Obtiene el feed activo con filtros de marca, búsqueda y priorización por preferencias del usuario.',
    },
    {
      id: 'get-promo-id',
      method: 'GET',
      path: '/api/Promociones/{id}',
      desc: 'Obtiene la ficha estructurada con condiciones y letra chica de una promoción específica.',
    },
    {
      id: 'post-feedback',
      method: 'POST',
      path: '/api/Feedback',
      desc: 'Registra la calificación comunitaria (Me funcionó / No me funcionó) o reporte de error.',
    },
    {
      id: 'post-ingesta',
      method: 'POST',
      path: '/api/Ingesta/trigger',
      desc: 'Dispara el pipeline de extracción y estructuración con IA de McDonald’s, Burger King y Mostaza.',
    },
  ];

  const handleExecute = () => {
    if (activeEndpoint === 'get-promos') {
      setStatusCode(200);
      setTestResponse(
        JSON.stringify(
          [
            {
              id: 1,
              marcaId: 1,
              marcaNombre: "McDonald's",
              titulo: "Cuarto de Libra Doble + Papas Medianas",
              precioOriginal: 12500.0,
              precioPromocional: 7900.0,
              porcentajeDescuento: 37,
              codigoCupon: "MCD-CUARTO37",
              requiereApp: true,
              semaforoValidez: "Verde",
              restricciones: ["Exclusivo canje en App oficial", "Consumo en mostrador"]
            },
            {
              id: 4,
              marcaId: 1,
              marcaNombre: "McDonald's",
              titulo: "Sundae de Dulce de Leche o Chocolate Gratis",
              precioOriginal: 4500.0,
              precioPromocional: 0.0,
              porcentajeDescuento: 100,
              codigoCupon: "MCD-SUNDAE0",
              requiereApp: true,
              semaforoValidez: "Verde",
              restricciones: ["Con la compra de combo mediano o grande"]
            }
          ],
          null,
          2
        )
      );
    } else if (activeEndpoint === 'get-promo-id') {
      setStatusCode(200);
      setTestResponse(
        JSON.stringify(
          {
            id: 2,
            marcaId: 2,
            marcaNombre: "Burger King",
            titulo: "2x1 en Whopper Clásico a la Parrilla",
            precioOriginal: 14000.0,
            precioPromocional: 7000.0,
            porcentajeDescuento: 50,
            codigoCupon: "BK-WHOPP2X1",
            urlOrigen: "https://www.burgerking.com.ar/cupones",
            requiereApp: true,
            vigenciaHasta: "2026-10-28T00:00:00Z",
            estado: "Activo",
            reportesPositivos: 42,
            reportesNegativos: 3,
            semaforoValidez: "Verde",
            fechaUltimaVerificacion: "2026-10-14T08:15:00Z",
            restricciones: ["Presentar en caja", "Límite 2 por persona"]
          },
          null,
          2
        )
      );
    } else if (activeEndpoint === 'post-feedback') {
      setStatusCode(200);
      setTestResponse(
        JSON.stringify(
          {
            exito: true,
            mensaje: "Calificación registrada con éxito. Semáforo actualizado.",
            nuevoSemaforo: "Verde"
          },
          null,
          2
        )
      );
    } else {
      setStatusCode(200);
      setTestResponse(
        JSON.stringify(
          {
            totalLeidas: 14,
            nuevas: 3,
            actualizadas: 11,
            errores: 0,
            tiempoEjecucionSegundos: 4.8
          },
          null,
          2
        )
      );
    }
  };

  const curlCommand = `curl -X 'GET' 'https://localhost:7069/api/Promociones?marca=${filterMarca}&preferencias=${filterPref}' -H 'accept: application/json'`;

  const copyCurl = () => {
    navigator.clipboard.writeText(curlCommand);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Alert explaining why it showed nothing in local */}
      <div className="p-5 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs space-y-2.5 shadow-xl">
        <div className="flex items-start gap-2.5 font-bold text-amber-300 text-sm">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <span>¿Por qué en local se ejecutaba pero no mostraba nada en los puertos?</span>
        </div>
        <p className="leading-relaxed">
          En los proyectos Web API de C# .NET, la ruta raíz <code className="bg-slate-900 px-1.5 py-0.5 rounded text-amber-300 font-mono">/</code> no tiene ninguna página asignada por defecto (devuelve un HTTP 404 en blanco). La documentación interactiva de Swagger se encuentra en <code className="bg-slate-900 px-1.5 py-0.5 rounded text-amber-300 font-mono">/swagger</code>:
        </p>
        <ul className="list-disc list-inside space-y-1 font-mono text-[11px] text-amber-100 pl-1">
          <li><strong>URL Swagger directa:</strong> <code className="text-white">https://localhost:7069/swagger</code> o <code className="text-white">http://localhost:5273/swagger</code></li>
          <li><strong>Solución que ya apliqué:</strong> En <code className="text-indigo-300">Program.cs</code> agregué la redirección automática de <code className="text-indigo-300">/</code> hacia <code className="text-indigo-300">/swagger</code> y configuré <code className="text-indigo-300">launchSettings.json</code> para que abra Swagger automáticamente en tu navegador.</li>
        </ul>
      </div>

      {/* Swagger Interactive UI Preview */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
        {/* Swagger Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
              {'{ }'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Swagger UI - API Centralizador Descuentos</h3>
                <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">v1</span>
              </div>
              <p className="text-xs text-slate-400">
                Especificación OpenAPI 3.0 para .NET 8 Web API
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="font-mono text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg">
              Base URL: https://localhost:7069
            </span>
          </div>
        </div>

        {/* Endpoints List */}
        <div className="p-5 space-y-3">
          {endpoints.map((ep) => {
            const isSelected = activeEndpoint === ep.id;
            return (
              <div
                key={ep.id}
                className={`rounded-xl border transition-all overflow-hidden ${
                  isSelected
                    ? 'bg-slate-950/80 border-indigo-500/50 shadow-lg'
                    : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Method row */}
                <div
                  onClick={() => setActiveEndpoint(ep.id)}
                  className="p-3.5 flex items-center justify-between gap-3 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-black font-mono tracking-wider ${
                        ep.method === 'GET'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {ep.method}
                    </span>
                    <span className="font-mono text-xs font-bold text-white">{ep.path}</span>
                    <span className="text-xs text-slate-400 hidden sm:inline">- {ep.desc}</span>
                  </div>

                  <div className="text-slate-500">
                    {isSelected ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>

                {/* Expanded Playground */}
                {isSelected && (
                  <div className="p-4 border-t border-slate-800/80 bg-slate-900/60 space-y-4 text-xs">
                    {ep.id === 'get-promos' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                            Parámetro: marca (string)
                          </label>
                          <input
                            type="text"
                            value={filterMarca}
                            onChange={(e) => setFilterMarca(e.target.value)}
                            placeholder="mcdonalds, burger-king, mostaza"
                            className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                            Parámetro: preferencias (string)
                          </label>
                          <input
                            type="text"
                            value={filterPref}
                            onChange={(e) => setFilterPref(e.target.value)}
                            placeholder="hamburguesas, combos"
                            className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 font-mono"
                          />
                        </div>
                      </div>
                    )}

                    {/* Actions: Try it out & Execute */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleExecute}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
                        >
                          <Play className="w-3.5 h-3.5" />
                          <span>Execute (Probar endpoint en vivo)</span>
                        </button>
                      </div>

                      <button
                        onClick={copyCurl}
                        className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-mono"
                      >
                        {copiedCurl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedCurl ? '¡Copiado!' : 'Copiar cURL'}</span>
                      </button>
                    </div>

                    {/* Response display */}
                    {testResponse && (
                      <div className="space-y-1.5 pt-2 border-t border-slate-800">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-slate-300">Server Response:</span>
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[11px]">
                            HTTP {statusCode} OK
                          </span>
                        </div>
                        <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-300 overflow-x-auto leading-relaxed max-h-60">
                          {testResponse}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
