using CentralizadorDescuentos.DTOs.Promociones;
using CentralizadorDescuentos.Entities.Promociones;
using CentralizadorDescuentos.Repositories.Interfaces;
using CentralizadorDescuentos.Services.Interfaces;

namespace CentralizadorDescuentos.Services.Promociones
{
    public class PromocionService : IPromocionService
    {
        private readonly IPromocionRepository _promocionRepository;

        public PromocionService(IPromocionRepository promocionRepository)
        {
            _promocionRepository = promocionRepository;
        }

        public async Task<IEnumerable<PromocionDto>> ObtenerFeedAsync(FiltroPromocionDto filtro, string[]? preferenciasUsuario)
        {
            var promociones = await _promocionRepository.ObtenerActivasAsync(filtro);

            var dtos = promociones.Select(MapearADto).ToList();

            // Capa de Recomendación y Priorización Personalizada (basada en preferencias)
            if (preferenciasUsuario != null && preferenciasUsuario.Length > 0)
            {
                var prefNormalizadas = preferenciasUsuario.Select(p => p.ToLower().Trim()).ToHashSet();

                dtos = dtos.OrderByDescending(p =>
                {
                    bool coincideMarca = prefNormalizadas.Contains(p.MarcaNombre.ToLower());
                    bool coincideTitulo = prefNormalizadas.Any(pr => p.Titulo.ToLower().Contains(pr));
                    return (coincideMarca ? 10 : 0) + (coincideTitulo ? 5 : 0);
                })
                .ThenByDescending(p => p.PorcentajeDescuento ?? 0)
                .ToList();
            }

            return dtos;
        }

        public async Task<PromocionDto?> ObtenerDetalleAsync(int id)
        {
            var p = await _promocionRepository.ObtenerPorIdAsync(id);
            if (p == null) return null;
            return MapearADto(p);
        }

        private static PromocionDto MapearADto(Promocion p)
        {
            // Cálculo del semáforo comunitario de validez
            int totalReportes = p.ReportesPositivos + p.ReportesNegativos;
            string semaforo = "Verde";
            if (totalReportes >= 3)
            {
                double ratioNegativo = (double)p.ReportesNegativos / totalReportes;
                if (ratioNegativo > 0.6) semaforo = "Rojo";
                else if (ratioNegativo > 0.3) semaforo = "Amarillo";
            }

            return new PromocionDto
            {
                Id = p.Id,
                MarcaId = p.MarcaId,
                MarcaNombre = p.Marca?.Nombre ?? "Marca",
                MarcaLogoUrl = p.Marca?.LogoUrl,
                Titulo = p.Titulo,
                Descripcion = p.Descripcion,
                TipoBeneficio = p.TipoBeneficio,
                PrecioOriginal = p.PrecioOriginal,
                PrecioPromocional = p.PrecioPromocional,
                PorcentajeDescuento = p.PorcentajeDescuento,
                CodigoCupon = p.CodigoCupon,
                UrlOrigen = p.UrlOrigen,
                RequiereApp = p.RequiereApp,
                RequiereLogin = p.RequiereLogin,
                VigenciaHasta = p.VigenciaHasta,
                Estado = p.Estado,
                ReportesPositivos = p.ReportesPositivos,
                ReportesNegativos = p.ReportesNegativos,
                SemaforoValidez = semaforo,
                FechaUltimaVerificacion = p.FechaUltimaVerificacion,
                Restricciones = p.Restricciones?.Select(r => r.Descripcion).ToList() ?? new List<string>()
            };
        }
    }
}
