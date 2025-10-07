# Backend de Prueba - Faustinee

Este es un backend de prueba que incluye el controlador Users del proyecto original.

## Estructura

```
back-test/
├── index.php                    # API principal
├── .htaccess                    # Configuración Apache
├── composer.json                # Dependencias
├── vendor/                      # Dependencias instaladas
├── env.example                  # Archivo de ejemplo para variables de entorno
├── config/
│   └── database.php             # Configuración de base de datos
└── app/
    ├── db/
    │   └── models/
    │       └── Users.php        # Modelo Users
    └── routes/
        └── controllers/
            └── users.php        # Controlador Users
```

## Configuración

1. **Copiar archivo de entorno:**
   ```bash
   cp env.example .env
   ```

2. **Configurar variables de entorno en `.env`:**
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=faustinee
   DB_USER=tu_usuario
   DB_PASS=tu_contraseña
   SECRET_KEY=tu_clave_secreta_para_jwt
   ```

## Rutas disponibles

**Ruta principal:**
- `GET /` - Estado de la API

**Rutas de Users (con base de datos):**
- `GET /users` - Lista todos los usuarios
- `GET /users/{id}` - Obtiene un usuario por ID
- `POST /users` - Crea un nuevo usuario
- `PUT /users/{id}` - Actualiza un usuario
- `DELETE /users/{id}` - Elimina un usuario

**Rutas de Posts (con base de datos):**
- `GET /posts` - Lista todos los posts (con filtros)
- `GET /posts/{slug}` - Obtiene un post por slug
- `POST /posts` - Crea un nuevo post
- `PUT /posts/{id}` - Actualiza un post
- `DELETE /posts/{id}` - Elimina un post
- `POST /posts/{id}/img` - Sube imagen para un post
- `DELETE /posts/image` - Elimina imagen de un post

**Rutas de Covers (con base de datos):**
- `GET /covers` - Lista todos los covers
- `POST /covers` - Crea un nuevo cover
- `PUT /covers/{id}` - Actualiza un cover
- `DELETE /covers/{id}` - Elimina un cover

**Rutas de Login (autenticación):**
- `POST /login` - Inicia sesión con email y contraseña
- `POST /login/token` - Verifica token y obtiene datos del usuario

## Instalación en producción

1. Subir toda la carpeta a `/public_html/api-test/`
2. Crear archivo `.env` con las credenciales de la base de datos
3. Asegurar que la base de datos `faustinee` exista
4. Probar las rutas

## Dependencias

- Slim Framework 4.15
- PDO MySQL