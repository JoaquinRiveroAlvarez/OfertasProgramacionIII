using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using CentralizadorDescuentos.Entities.Promociones;

namespace CentralizadorDescuentos.Entities.Feedback
{
    [Table("ReportesFeedback")]
    public class ReporteFeedback
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int PromocionId { get; set; }

        [ForeignKey("PromocionId")]
        public virtual Promocion Promocion { get; set; } = null!;

        [Required]
        [MaxLength(30)]
        public string TipoReporte { get; set; } = "Funciono"; // Funciono, NoFunciono, Vencida, DatoIncorrecto

        [MaxLength(500)]
        public string? Comentario { get; set; }

        [MaxLength(64)]
        public string? IpHash { get; set; }

        public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
    }
}
