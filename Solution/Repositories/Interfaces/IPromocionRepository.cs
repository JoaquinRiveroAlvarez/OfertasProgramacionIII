using CentralizadorDescuentos.Entities.Promociones;
using CentralizadorDescuentos.DTOs.Promociones;

namespace CentralizadorDescuentos.Repositories.Interfaces
{
    public interface IPromocionRepository
    {
        Task<IEnumerable<Promocion>> ObtenerActivasAsync(FiltroPromocionDto filtro);
        Task<Promocion?> ObtenerPorIdAsync(int id);
        Task<Promocion?> ObtenerPorHashAsync(string hash);
        Task<Promocion> InsertarAsync(Promocion promocion);
        Task ActualizarAsync(Promocion promocion);
        Task DesactivarVencidasAsync();
    }
}
