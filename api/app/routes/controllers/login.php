<?php
// app/routes/controllers/login.php

namespace App\Routes\Controllers\Login;

use App\Db\Models\Users;
use Slim\Psr7\Request;
use Slim\Psr7\Response;

class LoginController {
    public function login(Request $request, Response $response, array $args): Response {
        try {
            // Obtener el contenido raw del body
            $rawBody = $request->getBody()->getContents();
            $data = json_decode($rawBody, true);
            
            // Si no se puede decodificar JSON, intentar con getParsedBody
            if (json_last_error() !== JSON_ERROR_NONE) {
                $data = $request->getParsedBody();
            }
            
            $email = $data['email'] ?? '';
            $password = $data['password'] ?? '';

            // Validación básica de entrada
            if (empty($email) || empty($password)) {
                $response->getBody()->write(json_encode([
                    'error' => 'Email y contraseña son obligatorios',
                    'debug' => [
                        'email_received' => $email,
                        'password_received' => !empty($password) ? '[PROVIDED]' : '[EMPTY]',
                        'raw_data' => $data
                    ]
                ]));
                return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
            }

            $user = Users::findByEmail($email);
            
            if (!$user) {
                $response->getBody()->write(json_encode([
                    'error' => 'Usuario no encontrado',
                    'debug' => [
                        'email_buscado' => $email,
                        'todos_los_usuarios' => $this->getAllUsersForDebug()
                    ]
                ]));
                return $response->withHeader('Content-Type', 'application/json')->withStatus(404);
            }

            // Verificar la contraseña
            if (!password_verify($password, $user->getPassword())) {
                $response->getBody()->write(json_encode([
                    'error' => 'Contraseña incorrecta'
                ]));
                return $response->withHeader('Content-Type', 'application/json')->withStatus(401);
            }

            // Generar token JWT
            $secretKey = getenv('SECRET_KEY') ?: 'default_secret_key';
            $payload = [
                'userId' => $user->getId(),
                'email' => $user->getEmail(),
                'name' => $user->getName(),
                'iat' => time(),
                'exp' => time() + (12 * 24 * 60 * 60) // 12 días
            ];

            $token = $this->generateJWT($payload, $secretKey);

            // Respuesta con los datos del usuario y token
            $result = [
                'usuario' => [
                    'id' => $user->getId(),
                    'name' => $user->getName(),
                    'email' => $user->getEmail()
                ],
                'token' => $token
            ];

            $response->getBody()->write(json_encode($result));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(200);

        } catch (\Exception $e) {
            error_log('Error en login: ' . $e->getMessage());
            $response->getBody()->write(json_encode([
                'error' => 'Error interno del servidor'
            ]));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
        }
    }

    public function verifyToken(Request $request, Response $response, array $args): Response {
        try {
            $data = $request->getParsedBody();
            $user = $data['user'] ?? null;

            // Validación del usuario en el body
            if (!$user || !isset($user['userId'])) {
                $response->getBody()->write(json_encode([
                    'error' => 'Parámetro user o userId faltante en la solicitud'
                ]));
                return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
            }

            // Buscar usuario en la base de datos
            $userData = Users::findById($user['userId']);
            if (!$userData) {
                $response->getBody()->write(json_encode([
                    'error' => 'Usuario no encontrado'
                ]));
                return $response->withHeader('Content-Type', 'application/json')->withStatus(404);
            }

            // Respuesta con los datos del usuario (sin contraseña)
            $result = [
                'id' => $userData->getId(),
                'name' => $userData->getName(),
                'email' => $userData->getEmail()
            ];

            $response->getBody()->write(json_encode($result));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(200);

        } catch (\Exception $e) {
            error_log('Error al verificar token: ' . $e->getMessage());
            $response->getBody()->write(json_encode([
                'error' => 'Error interno del servidor'
            ]));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
        }
    }

    private function generateJWT($payload, $secretKey) {
        $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
        $payload = json_encode($payload);
        
        $base64Header = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
        $base64Payload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));
        
        $signature = hash_hmac('sha256', $base64Header . "." . $base64Payload, $secretKey, true);
        $base64Signature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
        
        return $base64Header . "." . $base64Payload . "." . $base64Signature;
    }
    
    private function getAllUsersForDebug() {
        try {
            $users = Users::findAll();
            $debugUsers = [];
            foreach ($users as $user) {
                $debugUsers[] = [
                    'id' => $user->getId(),
                    'name' => $user->getName(),
                    'email' => $user->getEmail()
                ];
            }
            return $debugUsers;
        } catch (\Exception $e) {
            return ['error' => 'No se pudieron obtener los usuarios: ' . $e->getMessage()];
        }
    }
}
