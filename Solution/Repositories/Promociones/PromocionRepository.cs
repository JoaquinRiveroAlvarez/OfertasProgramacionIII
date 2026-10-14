using Microsoft.EntityFrameworkCore;
using CentralizadorDescuentos.Data;
using CentralizadorDescuentos.Entities.Promociones;
using CentralizadorDescuentos.Repositories.Interfaces;
using CentralizadorDescuentos.DTOs.Promociones;

namespace CentralizadorDescuentos.Repositories.Promociones
{
    public class PromocionRepository : IPromocionRepository
    {
        private readonly ApplicationDbContext _context;

        public PromocionRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Promocion>> ObtenerActivasAsync(FiltroPromocionDto filtro)
        {
            var hoy = DateTime.UtcNow.Date;

            // Motor de reglas: Solo activas, no expiradas
            var query = _context.Promociones
                .Include(p => p.Marca)
                .Include(p => p.Restricciones)
                .Where(p => p.Estado == "Activo" && (p.VigenciaHasta == null || p.VigenciaHasta >= hoy))
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(filtro.Marca))
            {
                var marcaSlug = filtro.Marca.ToLower().Trim();
                query = query.Where(p => p.Marca.Slug == marcaSlug || p.Marca.Nombre.ToLower().Contains(marcaSlug));
            }

            if (!string.IsNullOrWhiteSpace(filtro.Busqueda))
            {
                var b = filtro.Busqueda.ToLower().Trim();
                query = query.Where(p => p.Titulo.ToLower().Contains(b) || (p.Descripcion != null && p.Descripcion.ToLower().Contains(b)));
            }

            if (filtro.PrecioMaximo.HasValue)
            {
                query = query.Where(p => p.PrecioPromocional <= filtro.PrecioMaximo.Value);
            }

            if (filtro.SoloSinApp)
            {
                query = query.Where(p => !p.RequiereApp);
            }

            return await query
                .OrderByDescending(p => p.PorcentajeDescuento)
                .ThenByDescending(p => p.ReportesPositivos)
                .Skip((filtro.Pagina - 1) * filtro.TamanoPagina)
                .Take(filtro.TamanoPagina)
                .ToListAsync();
        }

        public async Task<Promocion?> ObtenerPorIdAsync(int id)
        {
            return await _context.Promociones
                .Include(p => p.Marca)
                .Include(p => p.Restricciones)
                .Include(p => p.Reportes)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<Promocion?> ObtenerPorHashAsync(string hash)
        {
            return await _context.Promociones
                .FirstOrDefaultAsync(p => p.ClaveUnicaHash == hash);
        }

        public async Task<Promocion> InsertarAsync(Promocion promocion)
        {
            await _context.Promociones.AddAsync(promocion);
            await _context.SaveChangesAsync();
            return promocion;
        }

        public async Task ActualizarAsync(Promocion promocion)
        {
            _context.Promociones.Update(promocion);
            await _context.SaveChangesAsync();
        }

        public async Task DesactivarVencidasAsync()
        {
            var hoy = DateTime.UtcNow.Date;
            var vencidas = await _context.Promociones
                .Where(p => p.Estado == "Activo" && p.VigenciaHasta < hoy)
                .ToListAsync();

            foreach (var item in vencidas)
            {
                item.Estado = "Expirado";
            }

            if (vencidas.Count > 0)
            {
                await _context.SaveChangesAsync();
            }
        }
    }
}
