using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using CentralizadorDescuentos.Entities.Marcas;
using CentralizadorDescuentos.Entities.Feedback;

namespace CentralizadorDescuentos.Entities.Promociones
{
    [Table("Promociones")]
    public class Promocion
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int MarcaId { get; set; }

        [ForeignKey("MarcaId")]
        public virtual Marca Marca { get; set; } = null!;

        public int? CategoriaId { get; set; }

        [Required]
        [MaxLength(200)]
        public string Titulo { get; set; } = string.Empty;

        public string? Descripcion { get; set; }

        [Required]
        [MaxLength(50)]
        public string TipoBeneficio { get; set; } = "PrecioFinal"; // Porcentaje, PrecioFinal, 2x1, CuponApp

        [Column(TypeName = "decimal(10,2)")]
        public decimal? PrecioOriginal { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal? PrecioPromocional { get; set; }

        public int? PorcentajeDescuento { get; set; }

        [MaxLength(100)]
        public string? CodigoCupon { get; set; }

        [Required]
        [MaxLength(1000)]
        public string UrlOrigen { get; set; } = string.Empty;

        public bool RequiereApp { get; set; } = false;

        public bool RequiereLogin { get; set; } = false;

        public DateTime? VigenciaHasta { get; set; }

        [Required]
        [MaxLength(64)]
        public string ClaveUnicaHash { get; set; } = string.Empty;

        [MaxLength(30)]
        public string Estado { get; set; } = "Activo"; // Activo, Expirado, EnRevision

        public int ReportesPositivos { get; set; } = 0;

        public int ReportesNegativos { get; set; } = 0;

        public DateTime FechaUltimaVerificacion { get; set; } = DateTime.UtcNow;

        public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;

        public virtual ICollection<Restriccion> Restricciones { get; set; } = new List<Restriccion>();
        public virtual ICollection<ReporteFeedback> Reportes { get; set; } = new List<ReporteFeedback>();
    }

    [Table("Restricciones")]
    public class Restriccion
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int PromocionId { get; set; }

        [ForeignKey("PromocionId")]
        public virtual Promocion Promocion { get; set; } = null!;

        [Required]
        [MaxLength(50)]
        public string Tipo { get; set; } = "MedioDePago";

        [Required]
        [MaxLength(255)]
        public string Descripcion { get; set; } = string.Empty;
    }
}
