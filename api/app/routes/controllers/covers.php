<?php
// app/routes/controllers/covers.php

namespace App\Routes\Controllers\Covers;

use App\Db\Models\Covers;
use Slim\Psr7\Request;
use Slim\Psr7\Response;

class CoversController
{
  private function getBaseUrl()
  {
    // Cargar configuración de la aplicación (que ya maneja las variables de entorno)
    $config = require __DIR__ . '/../../../config/app.php';
    $baseUrl = rtrim($config['app_url'], '/');
    return $baseUrl;
  }

  public function index(Request $request, Response $response, array $args): Response
  {
    try {
      $covers = Covers::findAll();
      $data = array_map(function ($cover) {
        $baseUrl = $this->getBaseUrl();
        $imageUrl = $cover->getImageUrl();
        // Si la URL no comienza con http, agregar la base URL con /api
        if (!str_starts_with($imageUrl, 'http')) {
          $imageUrl = $baseUrl . '/api' . $imageUrl;
        }

        return [
          'id' => $cover->getId(),
          'title' => $cover->getTitle(),
          'imageUrl' => $imageUrl,
          'state' => $cover->getState(),
          'pinned' => $cover->getPinned(),
          'created_at' => $cover->getCreatedAt()
        ];
      }, $covers);
      $response->getBody()->write(json_encode($data));
      return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
    } catch (\Exception $e) {
      error_log('Error fetching covers: ' . $e->getMessage());
      error_log('Stack trace: ' . $e->getTraceAsString());
      $response->getBody()->write(json_encode(['error' => $e->getMessage()]));
      return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
    }
  }

  public function getPinnedCover(Request $request, Response $response, array $args): Response
  {
    try {
      $covers = Covers::findAll();
      $pinnedCover = null;

      // Buscar la portada fijada más reciente
      foreach ($covers as $cover) {
        if ($cover->getPinned()) {
          if (!$pinnedCover || strtotime($cover->getCreatedAt()) > strtotime($pinnedCover->getCreatedAt())) {
            $pinnedCover = $cover;
          }
        }
      }

      if ($pinnedCover) {
        $baseUrl = $this->getBaseUrl();
        $imageUrl = $pinnedCover->getImageUrl();
        // Si la URL no comienza con http, agregar la base URL con /api
        if (!str_starts_with($imageUrl, 'http')) {
          $imageUrl = $baseUrl . '/api' . $imageUrl;
        }

        $data = [
          'id' => $pinnedCover->getId(),
          'title' => $pinnedCover->getTitle(),
          'imageUrl' => $imageUrl,
          'state' => $pinnedCover->getState(),
          'pinned' => $pinnedCover->getPinned(),
          'created_at' => $pinnedCover->getCreatedAt()
        ];
      } else {
        $data = null;
      }

      $response->getBody()->write(json_encode($data));
      return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
    } catch (\Exception $e) {
      error_log('Error fetching pinned cover: ' . $e->getMessage());
      error_log('Stack trace: ' . $e->getTraceAsString());
      $response->getBody()->write(json_encode(['error' => $e->getMessage()]));
      return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
    }
  }

  public function store(Request $request, Response $response, array $args): Response
  {
    $data = $request->getParsedBody();
    $uploadedFiles = $request->getUploadedFiles();


    if (empty($data['title'])) {
      $response->getBody()->write(json_encode(['error' => 'Title is required']));
      return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
    }
    if (isset($uploadedFiles['image'])) {
      $file = $uploadedFiles['image'];

      if ($file->getError() === UPLOAD_ERR_OK) {
        $filename = uniqid() . '.' . pathinfo($file->getClientFilename(), PATHINFO_EXTENSION);
        $uploadDir = __DIR__ . '/../../../public/uploads/covers/';
        if (!is_dir($uploadDir)) {
          mkdir($uploadDir, 0755, true);
        }
        $file->moveTo($uploadDir . $filename);

        // Generar URL completa con base URL
        $baseUrl = $this->getBaseUrl();
        $data['imageUrl'] = $baseUrl . '/api/uploads/covers/' . $filename;
      } else {
        // Manejar errores de upload
        $uploadErrors = [
          UPLOAD_ERR_INI_SIZE => 'El archivo excede el tamaño máximo permitido por PHP',
          UPLOAD_ERR_FORM_SIZE => 'El archivo excede el tamaño máximo permitido por el formulario',
          UPLOAD_ERR_PARTIAL => 'El archivo fue subido parcialmente',
          UPLOAD_ERR_NO_FILE => 'No se subió ningún archivo',
          UPLOAD_ERR_NO_TMP_DIR => 'Falta el directorio temporal',
          UPLOAD_ERR_CANT_WRITE => 'No se pudo escribir el archivo al disco',
          UPLOAD_ERR_EXTENSION => 'Una extensión de PHP detuvo la subida del archivo'
        ];
        $errorMessage = $uploadErrors[$file->getError()] ?? 'Error desconocido al subir el archivo';
        $response->getBody()->write(json_encode(['error' => $errorMessage]));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
      }
    } else {
      $response->getBody()->write(json_encode(['error' => 'No se proporcionó ninguna imagen']));
      return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
    }

    // Agregar valores por defecto para campos requeridos
    $data['state'] = $data['state'] ?? 'Publicado';
    $data['pinned'] = $data['pinned'] ?? false;
    try {
      $cover = Covers::create($data);
      $baseUrl = $this->getBaseUrl();
      $imageUrl = $cover->getImageUrl();
      // Si la URL no comienza con http, agregar la base URL
      if (!str_starts_with($imageUrl, 'http')) {
        $imageUrl = $baseUrl . $imageUrl;
      }

      $result = [
        'id' => $cover->getId(),
        'title' => $cover->getTitle(),
        'imageUrl' => $imageUrl,
        'state' => $cover->getState(),
        'pinned' => $cover->getPinned(),
        'created_at' => $cover->getCreatedAt()
      ];
      $response->getBody()->write(json_encode($result));
      return $response->withHeader('Content-Type', 'application/json')->withStatus(201);
    } catch (\Exception $e) {
      error_log('Error creating cover: ' . $e->getMessage());
      error_log('Stack trace: ' . $e->getTraceAsString());
      $response->getBody()->write(json_encode(['error' => $e->getMessage()]));
      return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
    }
  }

  public function update(Request $request, Response $response, array $args): Response
  {
    $id = $args['id'];
    $data = $request->getParsedBody();
    try {
      $success = Covers::update($id, $data);
      if ($success) {
        $response->getBody()->write(json_encode(['message' => 'Cover updated successfully']));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
      } else {
        $response->getBody()->write(json_encode(['error' => 'Failed to update cover']));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
      }
    } catch (\Exception $e) {
      error_log('Error updating cover: ' . $e->getMessage());
      error_log('Stack trace: ' . $e->getTraceAsString());
      $response->getBody()->write(json_encode(['error' => $e->getMessage()]));
      return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
    }
  }

  public function delete(Request $request, Response $response, array $args): Response
  {
    $id = $args['id'];
    try {
      $success = Covers::delete($id);
      if ($success) {
        $response->getBody()->write(json_encode(['message' => 'Cover deleted successfully']));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
      } else {
        $response->getBody()->write(json_encode(['error' => 'Failed to delete cover']));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
      }
    } catch (\Exception $e) {
      error_log('Error deleting cover: ' . $e->getMessage());
      error_log('Stack trace: ' . $e->getTraceAsString());
      $response->getBody()->write(json_encode(['error' => $e->getMessage()]));
      return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
    }
  }
}
