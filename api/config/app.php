<?php
// config/app.php - Configuración de la aplicación

// Cargar variables de entorno
$envPath = __DIR__ . '/../.env';
if (file_exists($envPath)) {
    $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) {
            continue;
        }
        list($name, $value) = explode('=', $line, 2);
        $name = trim($name);
        $value = trim($value);
        if (!array_key_exists($name, $_SERVER) && !array_key_exists($name, $_ENV)) {
            putenv(sprintf('%s=%s', $name, $value));
            $_ENV[$name] = $value;
            $_SERVER[$name] = $value;
        }
    }
}

// Configuración de la aplicación
return [
    'app_url' => getenv('APP_URL') ?: 'http://localhost:8001',
    'app_name' => getenv('APP_NAME') ?: 'Faustinee',
    'app_env' => getenv('APP_ENV') ?: 'local',
    'app_debug' => getenv('APP_DEBUG') ?: 'true',
];
