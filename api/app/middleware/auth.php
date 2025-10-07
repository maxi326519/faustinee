<?php
// app/middleware/auth.php

namespace App\Middleware;

use Slim\Psr7\Request;
use Slim\Psr7\Response;
use Psr\Http\Server\RequestHandlerInterface;

class AuthMiddleware {
    public function __invoke(Request $request, RequestHandlerInterface $handler): Response {
        try {
            // Obtener el token del header Authorization
            $authHeader = $request->getHeaderLine('Authorization');
            
            // Debug: Log del header recibido
            error_log('Authorization header recibido: ' . $authHeader);
            
            if (empty($authHeader)) {
                $response = new Response();
                $response->getBody()->write(json_encode([
                    'error' => 'Token de autorización requerido',
                    'message' => 'Debe incluir el header Authorization con el token Bearer'
                ]));
                return $response
                    ->withHeader('Content-Type', 'application/json')
                    ->withHeader('Access-Control-Allow-Origin', '*')
                    ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
                    ->withHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
                    ->withStatus(401);
            }
            
            if (!preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
                $response = new Response();
                $response->getBody()->write(json_encode([
                    'error' => 'Formato de token inválido',
                    'message' => 'El token debe tener el formato: Bearer <token>'
                ]));
                return $response
                    ->withHeader('Content-Type', 'application/json')
                    ->withHeader('Access-Control-Allow-Origin', '*')
                    ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
                    ->withHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
                    ->withStatus(401);
            }

            $token = $matches[1];
            $secretKey = getenv('SECRET_KEY') ?: 'default_secret_key';

            // Verificar el token
            $decoded = $this->verifyJWT($token, $secretKey);
            if (!$decoded) {
                $response = new Response();
                $response->getBody()->write(json_encode([
                    'error' => 'Token inválido o expirado',
                    'message' => 'El token proporcionado no es válido o ha expirado'
                ]));
                return $response
                    ->withHeader('Content-Type', 'application/json')
                    ->withHeader('Access-Control-Allow-Origin', '*')
                    ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
                    ->withHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
                    ->withStatus(401);
            }

            // Agregar la información del usuario al request
            $request = $request->withAttribute('user', $decoded);
            
            // Log de autenticación exitosa
            error_log('Usuario autenticado: ' . $decoded['email']);

            return $handler->handle($request);

        } catch (\Exception $e) {
            error_log('Error en AuthMiddleware: ' . $e->getMessage());
            $response = new Response();
            $response->getBody()->write(json_encode([
                'error' => 'Error de autenticación',
                'message' => 'Error interno del servidor durante la autenticación'
            ]));
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withHeader('Access-Control-Allow-Origin', '*')
                ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
                ->withHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
                ->withStatus(401);
        }
    }

    private function verifyJWT($token, $secretKey) {
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return false;
        }

        list($header, $payload, $signature) = $parts;

        // Verificar la firma
        $expectedSignature = hash_hmac('sha256', $header . "." . $payload, $secretKey, true);
        $expectedSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($expectedSignature));

        if (!hash_equals($expectedSignature, $signature)) {
            return false;
        }

        // Decodificar el payload
        $payload = json_decode(base64_decode(str_replace(['-', '_'], ['+', '/'], $payload)), true);

        // Verificar la expiración
        if (isset($payload['exp']) && $payload['exp'] < time()) {
            return false;
        }

        return $payload;
    }
}
