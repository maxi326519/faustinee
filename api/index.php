<?php
// index.php - Backend súper simple

// Configurar para mostrar errores
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Servir archivos estáticos antes de procesar rutas de API
$requestUri = $_SERVER['REQUEST_URI'];
$parsedUrl = parse_url($requestUri);
$path = $parsedUrl['path'];

// Si es una petición a archivos estáticos (uploads), servirlos directamente
if (strpos($path, '/uploads/') === 0) {
    $filePath = __DIR__ . '/public' . $path;
    if (file_exists($filePath) && is_file($filePath)) {
        // Determinar el tipo MIME basado en la extensión del archivo
        $extension = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
        $mimeTypes = [
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'gif' => 'image/gif',
            'webp' => 'image/webp',
            'svg' => 'image/svg+xml',
            'pdf' => 'application/pdf',
            'txt' => 'text/plain',
            'html' => 'text/html',
            'css' => 'text/css',
            'js' => 'application/javascript'
        ];
        $mimeType = $mimeTypes[$extension] ?? 'application/octet-stream';
        
        header('Content-Type: ' . $mimeType);
        header('Content-Length: ' . filesize($filePath));
        readfile($filePath);
        exit;
    } else {
        http_response_code(404);
        echo 'File not found: ' . $filePath;
        exit;
    }
}

// Incluir autoloading de Composer
require_once __DIR__ . '/vendor/autoload.php';

// Incluir modelos
require_once __DIR__ . '/app/db/models/Users.php';
require_once __DIR__ . '/app/db/models/Posts.php';
require_once __DIR__ . '/app/db/models/Covers.php';

// Incluir controladores
require_once __DIR__ . '/app/routes/controllers/users.php';
require_once __DIR__ . '/app/routes/controllers/posts.php';
require_once __DIR__ . '/app/routes/controllers/covers.php';
require_once __DIR__ . '/app/routes/controllers/login.php';

// Incluir middleware
require_once __DIR__ . '/app/middleware/auth.php';

// Usar namespaces de Slim
use Slim\Factory\AppFactory;
use Slim\Psr7\Request;
use Slim\Psr7\Response;
use App\Routes\Controllers\Users\UsersController;
use App\Routes\Controllers\Posts\PostsController;
use App\Routes\Controllers\Covers\CoversController;
use App\Routes\Controllers\Login\LoginController;
use App\Middleware\AuthMiddleware;

$app = AppFactory::create();

// Configurar BasePath solo para producción (hosting compartido)
if (isset($_SERVER['HTTP_HOST']) && strpos($_SERVER['HTTP_HOST'], 'localhost') === false) {
    $app->setBasePath('/api');
}

// Configurar el parser de JSON
$app->addBodyParsingMiddleware();

// Middleware CORS
$app->add(function (Request $request, \Psr\Http\Server\RequestHandlerInterface $handler) {
    // Manejar peticiones OPTIONS (preflight)
    if ($request->getMethod() === 'OPTIONS') {
        $response = new Response();
        return $response
            ->withHeader('Access-Control-Allow-Origin', '*')
            ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            ->withHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
            ->withHeader('Access-Control-Max-Age', '86400')
            ->withStatus(200);
    }
    
    $response = $handler->handle($request);
    return $response
        ->withHeader('Access-Control-Allow-Origin', '*')
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        ->withHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
});

// Ruta principal
$app->get('/', function (Request $request, Response $response) {
    $response->getBody()->write(json_encode([
        'message' => 'API funcionando correctamente',
        'status' => 'OK'
    ]));
    return $response->withHeader('Content-Type', 'application/json');
});

// Rutas PÚBLICAS (sin autenticación)
$app->get('/posts', PostsController::class . ':index'); // Lista pública de posts
$app->get('/posts/{slug}', PostsController::class . ':show'); // Ver post individual
$app->get('/covers', CoversController::class . ':index'); // Lista pública de covers
$app->get('/covers/pinned', CoversController::class . ':getPinnedCover'); // Portada fijada más reciente

// Rutas PROTEGIDAS (requieren autenticación)
$app->group('', function ($group) {
    // Rutas de Users (todas protegidas)
    $group->get('/users', UsersController::class . ':index');
    $group->get('/users/{id}', UsersController::class . ':show');
    $group->post('/users', UsersController::class . ':store');
    $group->put('/users/{id}', UsersController::class . ':update');
    $group->delete('/users/{id}', UsersController::class . ':delete');
    
    // Rutas de Posts protegidas
    $group->post('/posts', PostsController::class . ':store');
    $group->delete('/posts/image', PostsController::class . ':deleteImage');
    $group->put('/posts/{id}', PostsController::class . ':update');
    $group->delete('/posts/{id}', PostsController::class . ':delete');
    $group->post('/posts/{id}/img', PostsController::class . ':uploadImage');
    
    // Rutas de Covers protegidas
    $group->post('/covers', CoversController::class . ':store');
    $group->put('/covers/{id}', CoversController::class . ':update');
    $group->delete('/covers/{id}', CoversController::class . ':delete');
})->add(new AuthMiddleware());

// Rutas de Login
$app->post('/login', LoginController::class . ':login');
$app->post('/login/token', LoginController::class . ':verifyToken');

$app->run();
?>