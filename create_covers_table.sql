-- Script SQL para crear la tabla Covers desde cero
-- Estructura actualizada según el nuevo modelo

-- 1. Eliminar la tabla si existe (por si acaso)
DROP TABLE IF EXISTS Covers;

-- 2. Crear la tabla Covers con la nueva estructura
CREATE TABLE Covers (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    imageUrl VARCHAR(500) NOT NULL,
    state ENUM('Publicado', 'Oculto') DEFAULT 'Publicado',
    pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Agregar índices para mejorar el rendimiento
CREATE INDEX idx_covers_state ON Covers(state);
CREATE INDEX idx_covers_pinned ON Covers(pinned);
CREATE INDEX idx_covers_created_at ON Covers(created_at);

-- 4. Verificar la estructura creada
DESCRIBE Covers;

-- 5. Insertar algunos datos de ejemplo (opcional)
INSERT INTO Covers (id, title, imageUrl, state, pinned) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Cover de Ejemplo 1', '/uploads/covers/ejemplo1.jpg', 'Publicado', TRUE),
('550e8400-e29b-41d4-a716-446655440001', 'Cover de Ejemplo 2', '/uploads/covers/ejemplo2.jpg', 'Publicado', FALSE);

-- 6. Verificar que los datos se insertaron correctamente
SELECT * FROM Covers;
