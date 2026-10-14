using Microsoft.EntityFrameworkCore;
using CentralizadorDescuentos.Data;
using CentralizadorDescuentos.Repositories.Interfaces;
using CentralizadorDescuentos.Repositories.Promociones;
using CentralizadorDescuentos.Services.Interfaces;
using CentralizadorDescuentos.Services.Promociones;

var builder = WebApplication.CreateBuilder(args);

// 1. Configuración de Base de Datos MySQL con Pomelo Entity Framework Core
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
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
builder.Services.AddScoped<IPromocionRepository, PromocionRepository>();
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

// 4. CORS
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

// 5. Configurar Swagger en /swagger
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Centralizador API v1");
    c.RoutePrefix = "swagger";
});

// 6. Servir el Frontend React (Archivos estáticos desde wwwroot)
app.UseDefaultFiles();
app.UseStaticFiles();

app.UseCors("AllowAll");
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

// Si se navega a cualquier ruta que no sea un endpoint de API (/api/*), sirve el frontend React index.html
app.MapFallbackToFile("index.html");

app.Run();
