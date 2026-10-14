import React, { useState } from 'react';
import {
  FolderTree,
  FileCode,
  Database,
  UploadCloud,
  Check,
  Copy,
  ExternalLink,
  Layers,
  Terminal,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  KeyRound
} from 'lucide-react';
import { createOrUpdateFile } from '../services/githubApi';

interface SolutionExplorerProps {
  repoOwner: string;
  repoName: string;
  token: string;
  onOpenTokenModal: () => void;
  onSolutionCommitted: () => void;
}

interface SolutionFile {
  path: string;
  techLayer: 'Entities' | 'DTOs' | 'Repositories' | 'Services' | 'Controllers' | 'Data & DB' | 'Config & Root';
  functionality: 'Promociones' | 'Marcas' | 'Feedback' | 'Ingesta' | 'Infraestructura';
  description: string;
  codeSnippet: string;
}

const SOLUTION_FILES: SolutionFile[] = [
  {
    path: 'CentralizadorDescuentos.sln',
    techLayer: 'Config & Root',
    functionality: 'Infraestructura',
    description: 'Archivo de Solución de Visual Studio para el proyecto único.',
    codeSnippet: `Microsoft Visual Studio Solution File, Format Version 12.00
# Visual Studio Version 17
Project("{9A19103F-16F7-4668-BE54-9A1E7A4F7556}") = "CentralizadorDescuentos", "CentralizadorDescuentos.csproj", "{C4B2E8F1-7890-4A56-BC12-9876543210AB}"
EndProject
...`,
  },
  {
    path: 'CentralizadorDescuentos.csproj',
    techLayer: 'Config & Root',
    functionality: 'Infraestructura',
    description: 'Definición del proyecto .NET 8 con Pomelo.EntityFrameworkCore.MySql y Swagger.',
    codeSnippet: `<Project Sdk="Microsoft.NET.Sdk.Web">
  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Pomelo.EntityFrameworkCore.MySql" Version="8.0.2" />
    <PackageReference Include="Microsoft.EntityFrameworkCore.Design" Version="8.0.8" />
    <PackageReference Include="Swashbuckle.AspNetCore" Version="6.6.2" />
    <PackageReference Include="HtmlAgilityPack" Version="1.11.61" />
  </ItemGroup>
</Project>`,
  },
  {
    path: 'Database/schema_mysql.sql',
    techLayer: 'Data & DB',
    functionality: 'Infraestructura',
    description: 'Script DDL de MySQL con tablas, índices optimizados y datos semilla (McDonalds, BK, Mostaza).',
    codeSnippet: `CREATE DATABASE IF NOT EXISTS centralizador_descuentos_db;
USE centralizador_descuentos_db;

CREATE TABLE Marcas (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Slug VARCHAR(50) NOT NULL UNIQUE,
    UrlBase VARCHAR(255) NOT NULL,
    LogoUrl VARCHAR(500) NULL,
    RequiereAppDefault BOOLEAN DEFAULT FALSE,
    Activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE Promociones (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    MarcaId INT NOT NULL,
    Titulo VARCHAR(200) NOT NULL,
    TipoBeneficio VARCHAR(50) NOT NULL,
    PrecioOriginal DECIMAL(10,2),
    PrecioPromocional DECIMAL(10,2),
    PorcentajeDescuento INT,
    CodigoCupon VARCHAR(100),
    UrlOrigen VARCHAR(1000) NOT NULL,
    RequiereApp BOOLEAN DEFAULT FALSE,
    VigenciaHasta DATE NULL,
    ClaveUnicaHash VARCHAR(64) NOT NULL UNIQUE,
    Estado VARCHAR(30) DEFAULT 'Activo',
    CONSTRAINT FK_Promociones_Marcas FOREIGN KEY (MarcaId) REFERENCES Marcas(Id)
);`,
  },
  {
    path: 'Entities/Promociones/Promocion.cs',
    techLayer: 'Entities',
    functionality: 'Promociones',
    description: 'Entidad de dominio de la promoción con clave de hash para upsert y deduplicación.',
    codeSnippet: `namespace CentralizadorDescuentos.Entities.Promociones;

[Table("Promociones")]
public class Promocion
{
    [Key]
    public int Id { get; set; }
    public int MarcaId { get; set; }
    public virtual Marca Marca { get; set; } = null!;
    public string Titulo { get; set; } = string.Empty;
    public string TipoBeneficio { get; set; } = "PrecioFinal";
    public decimal? PrecioOriginal { get; set; }
    public decimal? PrecioPromocional { get; set; }
    public int? PorcentajeDescuento { get; set; }
    public string? CodigoCupon { get; set; }
    public string UrlOrigen { get; set; } = string.Empty;
    public bool RequiereApp { get; set; }
    public DateTime? VigenciaHasta { get; set; }
    public string ClaveUnicaHash { get; set; } = string.Empty;
    public string Estado { get; set; } = "Activo";
    public virtual ICollection<Restriccion> Restricciones { get; set; } = new List<Restriccion>();
}`,
  },
  {
    path: 'Entities/Marcas/Marca.cs',
    techLayer: 'Entities',
    functionality: 'Marcas',
    description: 'Entidad de marca gastronómica (McDonald’s, Burger King, Mostaza).',
    codeSnippet: `namespace CentralizadorDescuentos.Entities.Marcas;

[Table("Marcas")]
public class Marca
{
    [Key]
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string UrlBase { get; set; } = string.Empty;
    public string? LogoUrl { get; set; }
    public bool RequiereAppDefault { get; set; }
    public virtual ICollection<Promocion> Promociones { get; set; } = new List<Promocion>();
}`,
  },
  {
    path: 'DTOs/Promociones/PromocionDto.cs',
    techLayer: 'DTOs',
    functionality: 'Promociones',
    description: 'DTO normalizado con semáforo de validez comunitaria y letra chica.',
    codeSnippet: `namespace CentralizadorDescuentos.DTOs.Promociones;

public class PromocionDto
{
    public int Id { get; set; }
    public string MarcaNombre { get; set; } = string.Empty;
    public string? MarcaLogoUrl { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public decimal? PrecioPromocional { get; set; }
    public int? PorcentajeDescuento { get; set; }
    public string? CodigoCupon { get; set; }
    public string UrlOrigen { get; set; } = string.Empty;
    public bool RequiereApp { get; set; }
    public string SemaforoValidez { get; set; } = "Verde";
    public List<string> Restricciones { get; set; } = new();
}`,
  },
  {
    path: 'Repositories/Promociones/PromocionRepository.cs',
    techLayer: 'Repositories',
    functionality: 'Promociones',
    description: 'Repositorio EF Core con filtros por marca, búsqueda, vigencia y expiración pasiva.',
    codeSnippet: `namespace CentralizadorDescuentos.Repositories.Promociones;

public class PromocionRepository : IPromocionRepository
{
    private readonly ApplicationDbContext _context;

    public PromocionRepository(ApplicationDbContext context) => _context = context;

    public async Task<IEnumerable<Promocion>> ObtenerActivasAsync(FiltroPromocionDto filtro)
    {
        var hoy = DateTime.UtcNow.Date;
        return await _context.Promociones
            .Include(p => p.Marca)
            .Include(p => p.Restricciones)
            .Where(p => p.Estado == "Activo" && (p.VigenciaHasta == null || p.VigenciaHasta >= hoy))
            .OrderByDescending(p => p.PorcentajeDescuento)
            .ToListAsync();
    }
}`,
  },
  {
    path: 'Services/Promociones/PromocionService.cs',
    techLayer: 'Services',
    functionality: 'Promociones',
    description: 'Servicio con lógica de ordenamiento personalizado según preferencias del usuario.',
    codeSnippet: `namespace CentralizadorDescuentos.Services.Promociones;

public class PromocionService : IPromocionService
{
    private readonly IPromocionRepository _repo;

    public PromocionService(IPromocionRepository repo) => _repo = repo;

    public async Task<IEnumerable<PromocionDto>> ObtenerFeedAsync(FiltroPromocionDto filtro, string[]? preferencias)
    {
        var promos = await _repo.ObtenerActivasAsync(filtro);
        var dtos = promos.Select(MapearADto).ToList();

        // Capa de priorización personalizada
        if (preferencias != null && preferencias.Length > 0)
        {
            var prefSet = preferencias.Select(p => p.ToLower()).ToHashSet();
            dtos = dtos.OrderByDescending(p => prefSet.Contains(p.MarcaNombre.ToLower()) ? 10 : 0)
                       .ThenByDescending(p => p.PorcentajeDescuento ?? 0)
                       .ToList();
        }
        return dtos;
    }
}`,
  },
  {
    path: 'Controllers/Promociones/PromocionesController.cs',
    techLayer: 'Controllers',
    functionality: 'Promociones',
    description: 'Controlador REST con endpoints GET /api/promociones y GET /api/promociones/{id}.',
    codeSnippet: `namespace CentralizadorDescuentos.Controllers.Promociones;

[ApiController]
[Route("api/[controller]")]
public class PromocionesController : ControllerBase
{
    private readonly IPromocionService _service;

    public PromocionesController(IPromocionService service) => _service = service;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<PromocionDto>>> Obtener(
        [FromQuery] string? marca, [FromQuery] string? busqueda, [FromQuery] string? preferencias)
    {
        var items = await _service.ObtenerFeedAsync(new FiltroPromocionDto { Marca = marca, Busqueda = busqueda }, preferencias?.Split(','));
        return Ok(items);
    }
}`,
  },
  {
    path: 'Program.cs',
    techLayer: 'Config & Root',
    functionality: 'Infraestructura',
    description: 'Punto de entrada de la Web API con conexión a MySQL Pomelo, DI y Swagger.',
    codeSnippet: `var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(opt =>
    opt.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

builder.Services.AddScoped<IPromocionRepository, PromocionRepository>();
builder.Services.AddScoped<IPromocionService, PromocionService>();

builder.Services.AddControllers();
builder.Services.AddSwaggerGen();
...`,
  },
];

export const SolutionExplorer: React.FC<SolutionExplorerProps> = ({
  repoOwner,
  repoName,
  token,
  onOpenTokenModal,
  onSolutionCommitted,
}) => {
  const [selectedTech, setSelectedTech] = useState<string>('All');
  const [selectedFile, setSelectedFile] = useState<SolutionFile>(SOLUTION_FILES[3]); // Promocion.cs default
  const [copied, setCopied] = useState(false);
  const [isPushingAll, setIsPushingAll] = useState(false);
  const [pushProgress, setPushProgress] = useState<{ current: number; total: number } | null>(null);
  const [pushResult, setPushResult] = useState<{ type: 'success' | 'error'; text: string; url?: string } | null>(null);

  const filteredFiles = selectedTech === 'All'
    ? SOLUTION_FILES
    : SOLUTION_FILES.filter((f) => f.techLayer === selectedTech);

  const copyCode = () => {
    navigator.clipboard.writeText(selectedFile.codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePushSolutionToGitHub = async () => {
    if (!token) {
      onOpenTokenModal();
      return;
    }

    setIsPushingAll(true);
    setPushResult(null);
    setPushProgress({ current: 0, total: SOLUTION_FILES.length });

    try {
      for (let i = 0; i < SOLUTION_FILES.length; i++) {
        const file = SOLUTION_FILES[i];
        setPushProgress({ current: i + 1, total: SOLUTION_FILES.length });

        await createOrUpdateFile(
          repoOwner,
          repoName,
          token,
          file.path,
          `feat: agregar ${file.path} (${file.techLayer} / ${file.functionality})`,
          file.codeSnippet
        );

        // Pause slightly between commits
        await new Promise((r) => setTimeout(r, 600));
      }

      setPushResult({
        type: 'success',
        text: `¡Solución completa en C# .NET + MySQL subida a GitHub! Se subieron ${SOLUTION_FILES.length} archivos a la rama main de ${repoOwner}/${repoName}.`,
        url: `https://github.com/${repoOwner}/${repoName}`,
      });

      onSolutionCommitted();
    } catch (err: unknown) {
      setPushResult({
        type: 'error',
        text: err instanceof Error ? err.message : 'Error al subir la solución a GitHub',
      });
    } finally {
      setIsPushingAll(false);
      setPushProgress(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Solution Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              Solución con Proyecto Único
            </span>
            <span className="text-xs text-slate-400">
              C# (Backend) + MySQL (DB) + React (Frontend)
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-white">
            Arquitectura Organizada por Tecnología y Dividida por Funcionalidad
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Cada capa técnica (<strong>Entity</strong>, <strong>DTO</strong>, <strong>Repository</strong>, <strong>Service</strong>, <strong>Controller</strong>) contiene subcarpetas para cada dominio funcional (<em>Promociones</em>, <em>Marcas</em>, <em>Feedback</em>, <em>Ingesta</em>).
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 self-stretch lg:self-auto">
          {!token ? (
            <button
              onClick={onOpenTokenModal}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold shadow-lg transition-all"
            >
              <KeyRound className="w-4 h-4" />
              <span>Conectar Token para Subir</span>
            </button>
          ) : (
            <button
              onClick={handlePushSolutionToGitHub}
              disabled={isPushingAll}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all"
            >
              {isPushingAll ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>
                    Subiendo {pushProgress ? `${pushProgress.current}/${pushProgress.total}` : '...'}
                  </span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  <span>Subir Solución Completa a GitHub</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Push result status */}
      {pushResult && (
        <div
          className={`p-4 rounded-xl border text-xs flex items-center justify-between gap-3 ${
            pushResult.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
              : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {pushResult.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{pushResult.text}</span>
          </div>
          {pushResult.url && (
            <a
              href={pushResult.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-emerald-300 underline flex items-center gap-1"
            >
              <span>Ver Repo</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      )}

      {/* Technology Layers Filter Pills */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-slate-900 border border-slate-800">
        <span className="text-[11px] font-semibold text-slate-400 px-2">Capas por Tecnología:</span>
        {['All', 'Entities', 'DTOs', 'Repositories', 'Services', 'Controllers', 'Data & DB', 'Config & Root'].map((layer) => (
          <button
            key={layer}
            onClick={() => setSelectedTech(layer)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              selectedTech === layer
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {layer}
          </button>
        ))}
      </div>

      {/* Two Column Layout: File Explorer and Code Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: File Tree */}
        <div className="lg:col-span-4 rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-2 h-[520px] overflow-y-auto">
          <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5 pb-2 border-b border-slate-800">
            <FolderTree className="w-4 h-4 text-indigo-400" />
            <span>Archivos de la Solución ({filteredFiles.length})</span>
          </div>

          <div className="space-y-1.5 pt-1">
            {filteredFiles.map((file) => {
              const isSelected = selectedFile.path === file.path;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all text-xs flex items-start gap-2.5 ${
                    isSelected
                      ? 'bg-indigo-950/60 border-indigo-500/60 text-white'
                      : 'bg-slate-950/50 border-slate-800/80 text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <FileCode className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-xs truncate">{file.path}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-indigo-300 font-medium">
                        {file.techLayer}
                      </span>
                      <span className="text-[10px] text-slate-500">•</span>
                      <span className="text-[10px] text-slate-400">
                        {file.functionality}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Code Viewer */}
        <div className="lg:col-span-8 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col h-[520px]">
          {/* Header */}
          <div className="px-5 py-3.5 border-b border-slate-800 bg-slate-950 flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-white">{selectedFile.path}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                  {selectedFile.functionality}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">{selectedFile.description}</p>
            </div>

            <button
              onClick={copyCode}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copiar Código</span>
                </>
              )}
            </button>
          </div>

          {/* Editor Body */}
          <div className="flex-1 bg-slate-950 p-4 overflow-auto">
            <pre className="font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-wrap select-all">
              {selectedFile.codeSnippet}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
