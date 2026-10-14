using Microsoft.AspNetCore.Mvc;
using CentralizadorDescuentos.Services.Interfaces;
using CentralizadorDescuentos.DTOs.Promociones;

namespace CentralizadorDescuentos.Controllers.Promociones
{
    [ApiController]
    [Route("api/[controller]")]
    public class PromocionesController : ControllerBase
    {
        private readonly IPromocionService _promocionService;

        public PromocionesController(IPromocionService promocionService)
        {
            _promocionService = promocionService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PromocionDto>>> ObtenerPromociones(
            [FromQuery] string? marca,
            [FromQuery] string? busqueda,
            [FromQuery] decimal? precioMaximo,
            [FromQuery] bool soloSinApp = false,
            [FromQuery] string? preferencias = null)
        {
            var filtro = new FiltroPromocionDto
            {
                Marca = marca,
                Busqueda = busqueda,
                PrecioMaximo = precioMaximo,
                SoloSinApp = soloSinApp
            };

            string[]? prefArray = !string.IsNullOrWhiteSpace(preferencias)
                ? preferencias.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                : null;

            var resultado = await _promocionService.ObtenerFeedAsync(filtro, prefArray);
            return Ok(resultado);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PromocionDto>> ObtenerDetalle(int id)
        {
            var promo = await _promocionService.ObtenerDetalleAsync(id);
            if (promo == null) return NotFound(new { mensaje = "Promoción no encontrada." });
            return Ok(promo);
        }
    }
}
