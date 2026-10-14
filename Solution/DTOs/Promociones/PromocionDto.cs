namespace CentralizadorDescuentos.DTOs.Promociones
{
    public class PromocionDto
    {
        public int Id { get; set; }
        public int MarcaId { get; set; }
        public string MarcaNombre { get; set; } = string.Empty;
        public string? MarcaLogoUrl { get; set; }
        public string Titulo { get; set; } = string.Empty;
        public string? Descripcion { get; set; }
        public string TipoBeneficio { get; set; } = string.Empty;
        public decimal? PrecioOriginal { get; set; }
        public decimal? PrecioPromocional { get; set; }
        public int? PorcentajeDescuento { get; set; }
        public string? CodigoCupon { get; set; }
        public string UrlOrigen { get; set; } = string.Empty;
        public bool RequiereApp { get; set; }
        public bool RequiereLogin { get; set; }
        public DateTime? VigenciaHasta { get; set; }
        public string Estado { get; set; } = "Activo";
        public int ReportesPositivos { get; set; }
        public int ReportesNegativos { get; set; }
        public string SemaforoValidez { get; set; } = "Verde"; // Verde, Amarillo, Rojo
        public DateTime FechaUltimaVerificacion { get; set; }
        public List<string> Restricciones { get; set; } = new();
    }

    public class FiltroPromocionDto
    {
        public string? Marca { get; set; }
        public string? Categoria { get; set; }
        public string? Busqueda { get; set; }
        public decimal? PrecioMaximo { get; set; }
        public bool SoloSinApp { get; set; } = false;
        public int Pagina { get; set; } = 1;
        public int TamanoPagina { get; set; } = 20;
    }
}
