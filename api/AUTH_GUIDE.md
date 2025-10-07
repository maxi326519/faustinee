# Guía de Autenticación - API Faustinee

## Rutas Públicas (Sin Autenticación)

Estas rutas pueden ser accedidas sin token de autorización:

- `GET /` - Información de la API
- `GET /posts` - Lista pública de posts
- `GET /posts/{slug}` - Ver post individual
- `GET /covers` - Lista pública de covers
- `POST /login` - Iniciar sesión
- `POST /login/token` - Verificar token

## Rutas Protegidas (Requieren Autenticación)

Estas rutas requieren un token JWT válido en el header `Authorization`:

### Usuarios
- `GET /users` - Listar usuarios
- `GET /users/{id}` - Ver usuario específico
- `POST /users` - Crear usuario
- `PUT /users/{id}` - Actualizar usuario
- `DELETE /users/{id}` - Eliminar usuario

### Posts (Operaciones de administración)
- `POST /posts` - Crear post
- `PUT /posts/{id}` - Actualizar post
- `DELETE /posts/{id}` - Eliminar post
- `DELETE /posts/image` - Eliminar imagen de post
- `POST /posts/{id}/img` - Subir imagen a post

### Covers (Operaciones de administración)
- `POST /covers` - Crear cover
- `PUT /covers/{id}` - Actualizar cover
- `DELETE /covers/{id}` - Eliminar cover

## Cómo usar la Autenticación

### 1. Obtener Token

```bash
curl -X POST http://localhost:8001/login \
  -H "Content-Type: application/json" \
  -d '{"email": "usuario@ejemplo.com", "password": "contraseña"}'
```

Respuesta:
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

### 2. Usar Token en Peticiones

```bash
curl -X GET http://localhost:8001/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

### 3. En JavaScript (Frontend)

```javascript
// Obtener token del sessionStorage
const token = sessionStorage.getItem('token');

// Hacer petición con token
fetch('/users', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
})
.then(response => response.json())
.then(data => console.log(data));
```

## Códigos de Error

- `401 Unauthorized` - Token no proporcionado, inválido o expirado
- `404 Not Found` - Usuario no encontrado (en login)
- `400 Bad Request` - Datos de entrada inválidos

## Configuración

El token JWT se genera con:
- **Algoritmo**: HS256
- **Duración**: 12 días
- **Secret Key**: Variable de entorno `SECRET_KEY` o 'default_secret_key'

## Notas de Seguridad

1. **Siempre usar HTTPS en producción**
2. **Almacenar el token de forma segura** (sessionStorage/localStorage)
3. **No exponer el secret key** en el código
4. **Implementar refresh tokens** para mayor seguridad
5. **Validar tokens en cada petición protegida**
