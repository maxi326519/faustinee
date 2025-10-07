# Logs de Errores - Backend PHP

## Cómo ver los logs de errores

### 1. En desarrollo local (PHP built-in server)

Los logs aparecerán directamente en la consola donde ejecutas el servidor:

```bash
php -S localhost:8001 -t . index.php
```

**Ejemplo de salida en consola:**
```
[Tue Oct  7 00:35:45 2025] PHP 8.4.13 Development Server (http://localhost:8001) started
[Tue Oct  7 00:36:12 2025] Error fetching users: SQLSTATE[HY000] [2002] No connection could be made because the target machine actively refused it
[Tue Oct  7 00:36:12 2025] Stack trace: #0 /path/to/Users.php(49): PDO->__construct()
[Tue Oct  7 00:36:12 2025] [::1]:12345 [500]: GET /users
```

### 2. En producción (Apache/Nginx)

Los logs se guardan en el archivo de error log de PHP. Para verlos:

**Ubuntu/Debian:**
```bash
tail -f /var/log/apache2/error.log
# o
tail -f /var/log/nginx/error.log
```

**CentOS/RHEL:**
```bash
tail -f /var/log/httpd/error_log
```

**Hosting compartido:**
- Revisa el panel de control de tu hosting
- Busca la sección "Error Logs" o "Logs"
- O contacta al soporte para obtener acceso

### 3. Configurar logs personalizados

Para guardar logs en un archivo específico, agrega esto al inicio de `index.php`:

```php
// Configurar archivo de log personalizado
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/logs/app.log');
```

### 4. Ejemplos de logs que verás

**Error de conexión a base de datos:**
```
Error fetching users: SQLSTATE[HY000] [2002] No connection could be made because the target machine actively refused it
Stack trace: #0 /path/to/Users.php(49): PDO->__construct()
```

**Error de validación:**
```
Error creating user: Name, email, and password are required
Stack trace: #0 /path/to/users.php(73): App\Routes\Controllers\Users\UsersController->store()
```

**Error de archivo no encontrado:**
```
Error uploading image: Failed to open stream: No such file or directory
Stack trace: #0 /path/to/posts.php(193): move_uploaded_file()
```

### 5. Niveles de log disponibles

Los controladores ahora registran:
- **Mensaje de error**: Descripción clara del problema
- **Stack trace**: Ruta completa de la ejecución que causó el error
- **Contexto**: Información sobre qué operación falló (fetch, create, update, delete)

### 6. Debugging en producción

Para debugging en producción, puedes agregar logs adicionales:

```php
// En cualquier controlador
error_log('Debug: Datos recibidos: ' . json_encode($data));
error_log('Debug: Usuario ID: ' . $userId);
error_log('Debug: Query ejecutada: ' . $sql);
```
