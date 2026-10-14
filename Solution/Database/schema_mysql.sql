-- ====================================================================
-- SISTEMA: Centralizador Inteligente de Descuentos (Comida Rápida)
-- BASE DE DATOS: MySQL 8.0+
-- ARQUITECTURA: C# .NET + MySQL + React
-- ====================================================================

CREATE DATABASE IF NOT EXISTS centralizador_descuentos_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE centralizador_descuentos_db;

-- 1. Tabla de Marcas (McDonald's, Burger King, Mostaza)
CREATE TABLE IF NOT EXISTS Marcas (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Slug VARCHAR(50) NOT NULL UNIQUE,
    UrlBase VARCHAR(255) NOT NULL,
    LogoUrl VARCHAR(500) NULL,
    RequiereAppDefault BOOLEAN DEFAULT FALSE,
    Activo BOOLEAN DEFAULT TRUE,
    FechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Categorías (Hamburguesas, Postres, Combos, Desayuno)
CREATE TABLE IF NOT EXISTS Categorias (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(50) NOT NULL,
    Slug VARCHAR(50) NOT NULL UNIQUE,
    Icono VARCHAR(50) NULL
) ENGINE=InnoDB;

-- 3. Tabla Principal de Promociones y Cupones
CREATE TABLE IF NOT EXISTS Promociones (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    MarcaId INT NOT NULL,
    CategoriaId INT NULL,
    Titulo VARCHAR(200) NOT NULL,
    Descripcion TEXT NULL,
    TipoBeneficio VARCHAR(50) NOT NULL COMMENT 'Porcentaje, PrecioFinal, 2x1, ProductoGratis, CuponApp',
    PrecioOriginal DECIMAL(10,2) NULL,
    PrecioPromocional DECIMAL(10,2) NULL,
    PorcentajeDescuento INT NULL,
    CodigoCupon VARCHAR(100) NULL,
    UrlOrigen VARCHAR(1000) NOT NULL,
    RequiereApp BOOLEAN DEFAULT FALSE,
    RequiereLogin BOOLEAN DEFAULT FALSE,
    VigenciaHasta DATE NULL,
    ClaveUnicaHash VARCHAR(64) NOT NULL UNIQUE COMMENT 'Hash SHA256 de Marca+Titulo+Codigo para Upsert',
    Estado VARCHAR(30) DEFAULT 'Activo' COMMENT 'Activo, Expirado, EnRevision, Inactivo',
    ReportesPositivos INT DEFAULT 0,
    ReportesNegativos INT DEFAULT 0,
    FechaUltimaVerificacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_Promociones_Marcas FOREIGN KEY (MarcaId) REFERENCES Marcas(Id) ON DELETE RESTRICT,
    CONSTRAINT FK_Promociones_Categorias FOREIGN KEY (CategoriaId) REFERENCES Categorias(Id) ON DELETE SET NULL,
    INDEX IDX_Promociones_Vigencia (VigenciaHasta, Estado),
    INDEX IDX_Promociones_Marca (MarcaId),
    INDEX IDX_Promociones_Hash (ClaveUnicaHash)
) ENGINE=InnoDB;

-- 4. Tabla de Restricciones y "Letra Chica"
CREATE TABLE IF NOT EXISTS Restricciones (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    PromocionId INT NOT NULL,
    Tipo VARCHAR(50) NOT NULL COMMENT 'MedioDePago, DiaSemana, Horario, Local, ExcluyeDelivery',
    Descripcion VARCHAR(255) NOT NULL,
    CONSTRAINT FK_Restricciones_Promociones FOREIGN KEY (PromocionId) REFERENCES Promociones(Id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. Bucle de Retroalimentación y Reportes de Usuario
CREATE TABLE IF NOT EXISTS ReportesFeedback (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    PromocionId INT NOT NULL,
    TipoReporte VARCHAR(30) NOT NULL COMMENT 'Funciono, NoFunciono, Vencida, DatoIncorrecto',
    Comentario VARCHAR(500) NULL,
    IpHash VARCHAR(64) NULL,
    FechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_Feedback_Promociones FOREIGN KEY (PromocionId) REFERENCES Promociones(Id) ON DELETE CASCADE,
    INDEX IDX_Feedback_Promocion (PromocionId)
) ENGINE=InnoDB;

-- 6. Auditoría de Ingesta y Scraping
CREATE TABLE IF NOT EXISTS RegistrosIngesta (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    MarcaId INT NOT NULL,
    TotalDetectadas INT DEFAULT 0,
    NuevasInsertadas INT DEFAULT 0,
    Actualizadas INT DEFAULT 0,
    Errores INT DEFAULT 0,
    LogDetalle TEXT NULL,
    FechaEjecucion DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_Ingesta_Marcas FOREIGN KEY (MarcaId) REFERENCES Marcas(Id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ====================================================================
-- DATOS SEMILLA (Seed Data inicial para McDonald's, Burger King, Mostaza)
-- ====================================================================

INSERT INTO Marcas (Id, Nombre, Slug, UrlBase, LogoUrl, RequiereAppDefault, Activo) VALUES
(1, "McDonald's", 'mcdonalds', 'https://www.mcdonalds.com.ar', 'https://upload.wikimedia.org/wikipedia/commons/3/36/McDonald%27s_Golden_Arches.svg', TRUE, TRUE),
(2, 'Burger King', 'burger-king', 'https://www.burgerking.com.ar', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Burger_King_2020.svg/800px-Burger_King_2020.svg.png', TRUE, TRUE),
(3, 'Mostaza', 'mostaza', 'https://www.mostazaweb.com.ar', 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Logo_Mostaza.png', FALSE, TRUE)
ON DUPLICATE KEY UPDATE Nombre=VALUES(Nombre);

INSERT INTO Categorias (Id, Nombre, Slug, Icono) VALUES
(1, 'Hamburguesas', 'hamburguesas', 'sandwich'),
(2, 'Combos Dobles', 'combos', 'utensils'),
(3, 'Postres y Helados', 'postres', 'ice-cream'),
(4, 'Café y Desayuno', 'desayuno', 'coffee')
ON DUPLICATE KEY UPDATE Nombre=VALUES(Nombre);

-- Promociones de ejemplo para arrancar el catálogo
INSERT INTO Promociones 
(MarcaId, CategoriaId, Titulo, Descripcion, TipoBeneficio, PrecioOriginal, PrecioPromocional, PorcentajeDescuento, CodigoCupon, UrlOrigen, RequiereApp, RequiereLogin, VigenciaHasta, ClaveUnicaHash, Estado, ReportesPositivos, ReportesNegativos)
VALUES
(1, 1, 'Cuarto de Libra Doble + Papas Medianas', 'Descuento exclusivo en Combo Cuarto de Libra Doble con papas.', 'PrecioFinal', 12500.00, 7900.00, 37, 'MCD-CUARTO37', 'https://www.mcdonalds.com.ar/cupones', TRUE, TRUE, DATE_ADD(CURDATE(), INTERVAL 14 DAY), SHA2('1-Cuarto de Libra Doble + Papas Medianas-MCD-CUARTO37', 256), 'Activo', 14, 1),
(2, 2, '2x1 en Whopper Clásico', 'Llevá 2 Whopper Clásicos al precio de uno.', '2x1', 14000.00, 7000.00, 50, 'BK-WHOPP2X1', 'https://www.burgerking.com.ar/cupones', TRUE, FALSE, DATE_ADD(CURDATE(), INTERVAL 7 DAY), SHA2('2-2x1 en Whopper Clásico-BK-WHOPP2X1', 256), 'Activo', 28, 2),
(3, 1, 'Combo Mega Cuarto XL con 30% OFF', 'Descuento especial en Mostaza pagando con Mercado Pago o efectivo.', 'Porcentaje', 11000.00, 7700.00, 30, 'MOST-MEGA30', 'https://www.mostazaweb.com.ar/promociones', FALSE, FALSE, DATE_ADD(CURDATE(), INTERVAL 20 DAY), SHA2('3-Combo Mega Cuarto XL con 30% OFF-MOST-MEGA30', 256), 'Activo', 9, 0)
ON DUPLICATE KEY UPDATE Titulo=VALUES(Titulo);
