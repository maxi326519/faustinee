<?php
// config/database.php - Configuración de conexión PDO a la base de datos

/**
 * Carga las variables de entorno desde el archivo .env
 */
function loadEnv($path)
{
  if (!file_exists($path)) {
    // No lanzar excepción si el archivo .env no existe, solo si es crítico
    return;
  }

  $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
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

/**
 * Obtiene la instancia PDO configurada para MySQL con utf8mb4
 *
 * @return PDO
 * @throws PDOException
 */
function getPDO()
{
  // Cargar variables desde .env
  $envPath = __DIR__ . '/../.env';
  if (file_exists($envPath)) {
    loadEnv($envPath);
  }

  // Usar variables de entorno con valores por defecto
  $host = getenv('DB_HOST') ?: 'localhost';
  $port = getenv('DB_PORT') ?: '3306';
  $database = getenv('DB_NAME') ?: 'faustinee';
  $username = getenv('DB_USER') ?: 'root';
  $password = getenv('DB_PASS') ?: '';

  try {
    $dsn = "mysql:host={$host};port={$port};dbname={$database};charset=utf8mb4";
    $options = [
      PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
      PDO::ATTR_EMULATE_PREPARES   => false,
    ];

    $pdo = new PDO($dsn, $username, $password, $options);
    return $pdo;
  } catch (PDOException $e) {
    throw new PDOException('Error de conexión a la base de datos: ' . $e->getMessage(), (int)$e->getCode());
  }
}
