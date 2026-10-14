using CentralizadorDescuentos.DTOs.Promociones;

namespace CentralizadorDescuentos.Services.Interfaces
{
    public interface IPromocionService
    {
        Task<IEnumerable<PromocionDto>> ObtenerFeedAsync(FiltroPromocionDto filtro, string[]? preferenciasUsuario);
        Task<PromocionDto?> ObtenerDetalleAsync(int id);
    }
}
