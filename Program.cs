using Microsoft.EntityFrameworkCore;
using CentralizadorDescuentos.Data;
using CentralizadorDescuentos.Repositories.Interfaces;
using CentralizadorDescuentos.Repositories.Promociones;
using CentralizadorDescuentos.Services.Interfaces;
using CentralizadorDescuentos.Services.Promociones;

var builder = WebApplication.CreateBuilder(args);

// 1. Configuración de Base de Datos MySQL con Pomelo Entity Framework Core
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Usamos versión fija para evitar que falle al iniciar si MySQL local aún no fue encendido
var serverVersion = new MySqlServerVersion(new Version(8, 0, 36));

builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
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
        Description = "Backend en C# .NET y MySQL para agregación y recomendación de cupones de comida rápida (McDonald's, Burger King, Mostaza)."
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
// Habilitar Swagger siempre en Development y como página de inicio
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Centralizador API v1");
    c.RoutePrefix = "swagger";
});

// Redirigir la raíz "/" a "/swagger" para que al abrir https://localhost:7069 o http://localhost:5273 se vea la API de inmediato
app.MapGet("/", () => Results.Redirect("/swagger"));

app.UseCors("AllowAll");
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
