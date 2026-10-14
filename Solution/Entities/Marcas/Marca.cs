using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using CentralizadorDescuentos.Entities.Promociones;

namespace CentralizadorDescuentos.Entities.Marcas
{
    [Table("Marcas")]
    public class Marca
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Nombre { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string Slug { get; set; } = string.Empty;

        [Required]
        [MaxLength(255)]
        public string UrlBase { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? LogoUrl { get; set; }

        public bool RequiereAppDefault { get; set; } = false;

        public bool Activo { get; set; } = true;

        public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;

        public virtual ICollection<Promocion> Promociones { get; set; } = new List<Promocion>();
    }
}
