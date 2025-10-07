# Documentación del Backend - Faustinee

## Descripción General

El backend de Faustinee es una API REST desarrollada en PHP que utiliza el framework Slim 4 para gestionar un sistema de blog/CMS. Proporciona endpoints para la gestión de usuarios, posts, covers (portadas) y autenticación JWT.

## Tecnologías Utilizadas

- **PHP 8.4+** - Lenguaje de programación
- **Slim Framework 4.15** - Framework web minimalista
- **PDO MySQL** - Acceso a base de datos
- **JWT** - Autenticación basada en tokens
- **Composer** - Gestión de dependencias

## Estructura del Proyecto

```
api/
├── index.php                    # Punto de entrada principal
├── composer.json                # Dependencias del proyecto
├── .env                        # Variables de entorno (crear desde .env.example)
├── .htaccess                   # Configuración Apache
├── php.ini                     # Configuración PHP personalizada
├── config/
│   ├── app.php                 # Configuración de la aplicación
│   └── database.php            # Configuración de base de datos
├── app/
│   ├── db/
│   │   └── models/             # Modelos de datos
│   │       ├── Users.php       # Modelo de usuarios
│   │       ├── Posts.php       # Modelo de posts
│   │       └── Covers.php      # Modelo de covers
│   ├── middleware/
│   │   └── auth.php            # Middleware de autenticación
│   └── routes/
│       └── controllers/        # Controladores de rutas
│           ├── users.php       # Controlador de usuarios
│           ├── posts.php       # Controlador de posts
│           ├── covers.php      # Controlador de covers
│           └── login.php       # Controlador de autenticación
└── public/
    └── uploads/                # Archivos subidos
        ├── covers/             # Imágenes de portadas
        └── posts/              # Imágenes de posts
```

## Configuración

### 1. Variables de Entorno

Crear archivo `.env` basado en `.env.example`:

```env
# Base de datos
DB_HOST=localhost
DB_PORT=3306
DB_NAME=faustinee
DB_USER=tu_usuario
DB_PASS=tu_contraseña

# Aplicación
APP_URL=http://localhost:8001
APP_NAME=Faustinee
APP_ENV=local
APP_DEBUG=true

# Autenticación
SECRET_KEY=tu_clave_secreta_para_jwt
```

### 2. Base de Datos

El sistema utiliza MySQL con las siguientes tablas principales:

- **Users**: Gestión de usuarios del sistema
- **Posts**: Artículos del blog con contenido HTML
- **Covers**: Portadas/imágenes destacadas

### Users
```sql
CREATE TABLE Users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Posts
```sql
CREATE TABLE Posts (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    contentHtml TEXT NOT NULL,
    category VARCHAR(100),
    state ENUM('Borrador', 'Publicado') DEFAULT 'Borrador',
    author VARCHAR(255),
    tags TEXT,
    coverUrl VARCHAR(500),
    fixedHome BOOLEAN DEFAULT FALSE,
    fixedCategory BOOLEAN DEFAULT FALSE,
    reads INT DEFAULT 0,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Covers
```sql
CREATE TABLE Covers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    imageUrl VARCHAR(500) NOT NULL,
    state ENUM('Borrador', 'Publicado') DEFAULT 'Publicado',
    pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Configuración PHP

El archivo `php.ini` incluye configuraciones optimizadas para uploads:

```ini
upload_max_filesize = 50M
post_max_size = 50M
max_execution_time = 300
max_input_time = 300
memory_limit = 512M
max_file_uploads = 20
```

## API Endpoints

### Rutas Públicas (Sin Autenticación)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/` | Estado de la API |
| GET | `/posts` | Lista pública de posts |
| GET | `/posts/{slug}` | Ver post individual por slug |
| GET | `/covers` | Lista pública de covers |
| POST | `/login` | Iniciar sesión |
| POST | `/login/token` | Verificar token JWT |

### Rutas Protegidas (Requieren Autenticación)

#### Usuarios
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/users` | Listar todos los usuarios |
| GET | `/users/{id}` | Obtener usuario por ID |
| POST | `/users` | Crear nuevo usuario |
| PUT | `/users/{id}` | Actualizar usuario |
| DELETE | `/users/{id}` | Eliminar usuario |

#### Posts
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/posts` | Crear nuevo post |
| PUT | `/posts/{id}` | Actualizar post |
| DELETE | `/posts/{id}` | Eliminar post |
| POST | `/posts/{id}/img` | Subir imagen a post |
| DELETE | `/posts/image` | Eliminar imagen de post |

#### Covers
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/covers` | Crear nuevo cover |
| PUT | `/covers/{id}` | Actualizar cover |
| DELETE | `/covers/{id}` | Eliminar cover |

## Autenticación JWT

### Obtener Token

```bash
curl -X POST http://localhost:8001/login \
  -H "Content-Type: application/json" \
  -d '{"email": "usuario@ejemplo.com", "password": "contraseña"}'
```

**Respuesta:**
```json
{
  "usuario": {
    "id": 1,
    "name": "Nombre Usuario",
    "email": "usuario@ejemplo.com"
  },
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

### Usar Token en Peticiones

```bash
curl -X GET http://localhost:8001/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

### Configuración JWT

- **Algoritmo**: HS256
- **Duración**: 12 días
- **Secret Key**: Variable de entorno `SECRET_KEY`

## Gestión de Archivos

### Upload de Imágenes

El sistema maneja dos tipos de uploads:

1. **Covers**: Imágenes de portada (máximo 50MB)
2. **Posts**: Imágenes de contenido (máximo 50MB)

### Compresión Automática

El frontend incluye compresión automática de imágenes:
- Imágenes > 5MB se comprimen automáticamente
- Mantiene proporción original
- Convierte a JPEG con 80% de calidad

### Estructura de Archivos

```
public/uploads/
├── covers/
│   └── {unique_id}.{ext}
└── posts/
    └── {post_id}/
        └── {unique_id}.{ext}
```

## Instalación y Despliegue

### Desarrollo Local

1. **Clonar repositorio**
2. **Instalar dependencias**:
   ```bash
   composer install
   ```
3. **Configurar base de datos**:
   - Crear base de datos `faustinee`
   - Configurar archivo `.env`
4. **Ejecutar servidor**:
   ```bash
   php -S localhost:8001 -t . index.php
   ```

### Producción

1. **Subir archivos** a `/public_html/api/`
2. **Configurar base de datos** en el servidor
3. **Crear archivo `.env`** con credenciales de producción
4. **Configurar Apache/Nginx** para servir archivos estáticos
5. **Verificar permisos** en carpeta `public/uploads/`

## Seguridad

### Medidas Implementadas

1. **Autenticación JWT** para rutas protegidas
2. **Validación de datos** en todos los endpoints
3. **Sanitización** de archivos subidos
4. **Límites de tamaño** para uploads
5. **Headers de seguridad** en respuestas

### Recomendaciones

1. **Usar HTTPS** en producción
2. **Configurar CORS** apropiadamente
3. **Implementar rate limiting**
4. **Validar tokens** en cada petición
5. **Mantener dependencias** actualizadas

## Dependencias

### Principales
- `slim/slim: ^4.15` - Framework web
- `illuminate/database: ^10.0` - ORM para base de datos
- `slim/psr7: ^1.7` - Implementación PSR-7
- `nyholm/psr7: ^1.8` - Factory PSR-7

### Desarrollo
- `composer` - Gestión de dependencias
- `php` - Intérprete PHP 8.4+

Este proyecto es privado y pertenece a Faustinee.
