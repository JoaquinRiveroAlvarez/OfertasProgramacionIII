using System.ComponentModel.DataAnnotations;

namespace CentralizadorDescuentos.DTOs.Feedback
{
    public class CrearFeedbackDto
    {
        [Required]
        public int PromocionId { get; set; }

        [Required]
        public string TipoReporte { get; set; } = "Funciono"; // Funciono, NoFunciono, Vencida, DatoIncorrecto

        public string? Comentario { get; set; }
    }

    public class ResultadoFeedbackDto
    {
        public bool Exito { get; set; }
        public string Mensaje { get; set; } = string.Empty;
        public string NuevoSemaforo { get; set; } = "Verde";
    }
}
