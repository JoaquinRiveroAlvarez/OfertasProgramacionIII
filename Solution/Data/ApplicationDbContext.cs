using Microsoft.EntityFrameworkCore;
using CentralizadorDescuentos.Entities.Promociones;
using CentralizadorDescuentos.Entities.Marcas;
using CentralizadorDescuentos.Entities.Feedback;

namespace CentralizadorDescuentos.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Marca> Marcas => Set<Marca>();
        public DbSet<Promocion> Promociones => Set<Promocion>();
        public DbSet<Restriccion> Restricciones => Set<Restriccion>();
        public DbSet<ReporteFeedback> ReportesFeedback => Set<ReporteFeedback>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Índice único para ClaveUnicaHash (Upsert y deduplicación)
            modelBuilder.Entity<Promocion>()
                .HasIndex(p => p.ClaveUnicaHash)
                .IsUnique();

            // Relación Marca -> Promociones
            modelBuilder.Entity<Promocion>()
                .HasOne(p => p.Marca)
                .WithMany(m => m.Promociones)
                .HasForeignKey(p => p.MarcaId)
                .OnDelete(DeleteBehavior.Restrict);

            // Relación Promocion -> Restricciones
            modelBuilder.Entity<Restriccion>()
                .HasOne(r => r.Promocion)
                .WithMany(p => p.Restricciones)
                .HasForeignKey(r => r.PromocionId)
                .OnDelete(DeleteBehavior.Cascade);

            // Relación Promocion -> ReportesFeedback
            modelBuilder.Entity<ReporteFeedback>()
                .HasOne(rf => rf.Promocion)
                .WithMany(p => p.Reportes)
                .HasForeignKey(rf => rf.PromocionId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
