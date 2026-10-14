using Microsoft.EntityFrameworkCore;
using CentralizadorDescuentos.Data;
using CentralizadorDescuentos.Repositories.Interfaces;
using CentralizadorDescuentos.Repositories.Promociones;
using CentralizadorDescuentos.Services.Interfaces;
using CentralizadorDescuentos.Services.Promociones;

var builder = WebApplication.CreateBuilder(args);

// 1. Configuración de Base de Datos MySQL con Pomelo Entity Framework Core
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    var serverVersion = ServerVersion.AutoDetect(connectionString);
    options.UseMySql(connectionString, serverVersion, mySqlOptions =>
    {
        mySqlOptions.EnableRetryOnFailure(
            maxRetryCount: 3,
            maxRetryDelay: TimeSpan.FromSeconds(5),
            errorNumbersToAdd: null);
    });
});

// 2. Inyección de Dependencias por Capas y Funcionalidad
// Repositorios
builder.Services.AddScoped<IPromocionRepository, PromocionRepository>();

// Servicios
builder.Services.AddScoped<IPromocionService, PromocionService>();

// 3. Controladores y Swagger / OpenAPI
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new()
    {
        Title = "API Centralizador Inteligente de Descuentos",
        Version = "v1",
        Description = "Backend en C# .NET y MySQL para agregación y recomendación de cupones de comida rápida."
    });
});

// 4. CORS para permitir conexión fluida con el frontend React
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Pipeline de ejecución HTTP
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
