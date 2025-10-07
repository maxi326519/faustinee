<?php
// app/routes/controllers/posts.php

namespace App\Routes\Controllers\Posts;

use App\Db\Models\Posts;
use Slim\Psr7\Request;
use Slim\Psr7\Response;

class PostsController
{
  private function getBaseUrl()
  {
    // Cargar configuración de la aplicación (que ya maneja las variables de entorno)
    $config = require __DIR__ . '/../../../config/app.php';
    $baseUrl = rtrim($config['app_url'], '/');
    return $baseUrl;
  }

  private function generateSlug($title)
  {
    // Convertir a minúsculas y reemplazar caracteres especiales
    $slug = strtolower($title);
    $slug = preg_replace('/[^a-z0-9\s-]/', '', $slug);
    $slug = preg_replace('/[\s-]+/', '-', $slug);
    $slug = trim($slug, '-');

    // Si el slug está vacío, usar un valor por defecto
    if (empty($slug)) {
      $slug = 'post-' . uniqid();
    }

    // Verificar si el slug ya existe y agregar un número si es necesario
    $originalSlug = $slug;
    $counter = 1;

    while ($this->slugExists($slug)) {
      $slug = $originalSlug . '-' . $counter;
      $counter++;
    }

    return $slug;
  }

  private function slugExists($slug)
  {
    try {
      $pdo = getPDO();
      $stmt = $pdo->prepare("SELECT COUNT(*) FROM Posts WHERE slug = ?");
      $stmt->execute([$slug]);
      return $stmt->fetchColumn() > 0;
    } catch (\Exception $e) {
      error_log('Error checking slug existence: ' . $e->getMessage());
      return false;
    }
  }

  private function handleCoverUpload($uploadedFile)
  {
    try {
      $folder = __DIR__ . '/../../../public/uploads/covers';
      if (!is_dir($folder)) {
        mkdir($folder, 0755, true);
      }

      $filename = uniqid() . '.' . pathinfo($uploadedFile->getClientFilename(), PATHINFO_EXTENSION);
      $filePath = $folder . '/' . $filename;

      // Usar moveTo() de Slim como en covers
      $uploadedFile->moveTo($filePath);

      // Retornar URL completa con base URL
      $baseUrl = $this->getBaseUrl();
      return $baseUrl . '/api/uploads/posts/' . $filename;
    } catch (\Exception $e) {
      error_log('Error uploading cover: ' . $e->getMessage());
      return '';
    }
  }

  public function index(Request $request, Response $response, array $args): Response
  {
    try {
      $queryParams = $request->getQueryParams();
      $filters = [
        'page' => isset($queryParams['page']) ? (int)$queryParams['page'] : 1,
        'items' => isset($queryParams['items']) ? (int)$queryParams['items'] : 10,
        'latest' => isset($queryParams['latest']) && $queryParams['latest'] === 'true',
        'mustRead' => isset($queryParams['mustRead']) && $queryParams['mustRead'] === 'true',
        'category' => $queryParams['category'] ?? null,
        'published' => isset($queryParams['published']) ? $queryParams['published'] === 'true' : null,
        'state' => $queryParams['state'] ?? null,
      ];

      $result = Posts::findWithFilters($filters);
      $result['items'] = array_map(function ($post) {
        return [
          'id' => $post->getId(),
          'title' => $post->getTitle(),
          'slug' => $post->getSlug(),
          'category' => $post->getCategory(),
          'contentHtml' => $post->getContentHtml(),
          'coverUrl' => $post->getCoverUrl(),
          'tags' => $post->getTags(),
          'state' => $post->getState(),
          'reads' => $post->getReads(),
          'author' => $post->getAuthor(),
          'date' => $post->getDate(),
          'fixedHome' => (bool)$post->getFixedHome(),
          'fixedCategory' => (bool)$post->getFixedCategory(),
        ];
      }, $result['items']);
      $response->getBody()->write(json_encode($result));
      return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
    } catch (\Exception $e) {
      error_log('Error fetching posts: ' . $e->getMessage());
      error_log('Stack trace: ' . $e->getTraceAsString());
      $response->getBody()->write(json_encode(['error' => 'Failed to fetch posts']));
      return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
    }
  }

  public function show(Request $request, Response $response, array $args): Response
  {
    $slug = $args['slug'] ?? null;
    if (!$slug) {
      $response->getBody()->write(json_encode(['error' => 'Slug is required']));
      return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
    }
    try {
      $post = Posts::findBySlug($slug);
      if (!$post) {
        $response->getBody()->write(json_encode(['error' => 'Post not found']));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(404);
      }
      $data = [
        'id' => $post->getId(),
        'title' => $post->getTitle(),
        'slug' => $post->getSlug(),
        'category' => $post->getCategory(),
        'contentHtml' => $post->getContentHtml(),
        'coverUrl' => $post->getCoverUrl(),
        'tags' => $post->getTags(),
        'state' => $post->getState(),
        'reads' => $post->getReads(),
        'author' => $post->getAuthor(),
        'date' => $post->getDate(),
        'fixedHome' => (bool)$post->getFixedHome(),
        'fixedCategory' => (bool)$post->getFixedCategory(),
      ];
      $response->getBody()->write(json_encode($data));
      return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
    } catch (\Exception $e) {
      error_log('Error fetching post by slug: ' . $e->getMessage());
      error_log('Stack trace: ' . $e->getTraceAsString());
      $response->getBody()->write(json_encode(['error' => $e->getMessage()]));
      return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
    }
  }

  public function store(Request $request, Response $response, array $args): Response
  {
    // Usar la misma lógica que covers - getParsedBody() y getUploadedFiles()
    $data = $request->getParsedBody();
    $uploadedFiles = $request->getUploadedFiles();


    // Validar campos requeridos
    $title = $data['title'] ?? '';
    $contentHtml = $data['contentHtml'] ?? '';
    $category = $data['category'] ?? '';
    $state = $data['state'] ?? 'Borrador';
    $author = $data['author'] ?? '';
    $tags = $data['tags'] ?? '';

    if (empty($title) || empty($contentHtml)) {
      $response->getBody()->write(json_encode(['error' => 'Title and contentHtml are required']));
      return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
    }

    try {
      // Procesar archivo de cover si existe - usando la lógica de Slim como en covers
      $coverUrl = '';
      if (isset($uploadedFiles['file']) && $uploadedFiles['file']->getError() === UPLOAD_ERR_OK) {
        $coverUrl = $this->handleCoverUpload($uploadedFiles['file']);
      }

      // Preparar datos para crear el post
      $postData = [
        'title' => $title,
        'contentHtml' => $contentHtml,
        'category' => $category,
        'state' => $state,
        'author' => $author,
        'tags' => $tags,
        'coverUrl' => $coverUrl,
        'fixedHome' => isset($data['fixedHome']) && ($data['fixedHome'] === 'true' || $data['fixedHome'] === true) ? 1 : 0,
        'fixedCategory' => isset($data['fixedCategory']) && ($data['fixedCategory'] === 'true' || $data['fixedCategory'] === true) ? 1 : 0,
        'slug' => $data['slug'] ?? ''
      ];

      // Generar slug automáticamente si está vacío
      if (empty($postData['slug'])) {
        $postData['slug'] = $this->generateSlug($postData['title']);
      }


      $post = Posts::create($postData);
      $result = [
        'id' => $post->getId(),
        'title' => $post->getTitle(),
        'slug' => $post->getSlug(),
        'category' => $post->getCategory(),
        'contentHtml' => $post->getContentHtml(),
        'coverUrl' => $post->getCoverUrl(),
        'tags' => $post->getTags(),
        'state' => $post->getState(),
        'reads' => $post->getReads(),
        'author' => $post->getAuthor(),
        'date' => $post->getDate(),
        'fixedHome' => (bool)$post->getFixedHome(),
        'fixedCategory' => (bool)$post->getFixedCategory(),
      ];
      $response->getBody()->write(json_encode($result));
      return $response->withHeader('Content-Type', 'application/json')->withStatus(201);
    } catch (\Exception $e) {
      error_log('Error creating post: ' . $e->getMessage());
      error_log('Stack trace: ' . $e->getTraceAsString());
      $response->getBody()->write(json_encode(['error' => 'Failed to create post: ' . $e->getMessage()]));
      return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
    }
  }

  public function update(Request $request, Response $response, array $args): Response
  {
    $id = $args['id'] ?? null;
    if (!$id) {
      $response->getBody()->write(json_encode(['error' => 'ID is required']));
      return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
    }

    // Obtener datos del JSON body
    $data = $request->getParsedBody();


    $title = $data['title'] ?? '';
    $contentHtml = $data['contentHtml'] ?? '';

    if (empty($title) || empty($contentHtml)) {
      $response->getBody()->write(json_encode(['error' => 'Title and contentHtml are required']));
      return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
    }

    try {
      // Preparar datos para actualizar el post (ya incluye coverUrl del frontend)
      $updateData = [
        'title' => $title,
        'contentHtml' => $contentHtml,
        'category' => $data['category'] ?? '',
        'state' => $data['state'] ?? 'Borrador',
        'author' => $data['author'] ?? '',
        'tags' => $data['tags'] ?? '',
        'fixedHome' => $data['fixedHome'] === true || $data['fixedHome'] === 'true' ? 1 : 0,
        'fixedCategory' => $data['fixedCategory'] === true || $data['fixedCategory'] === 'true' ? 1 : 0,
        'slug' => $data['slug'] ?? '',
        'coverUrl' => $data['coverUrl'] ?? ''
      ];

      // Generar slug automáticamente si está vacío
      if (empty($updateData['slug'])) {
        $updateData['slug'] = $this->generateSlug($updateData['title']);
      }


      $success = Posts::update($id, $updateData);
      if (!$success) {
        $response->getBody()->write(json_encode(['error' => 'Failed to update post']));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
      }

      // Obtener el post actualizado para devolverlo
      $updatedPost = Posts::findById($id);
      $result = [
        'id' => $updatedPost->getId(),
        'title' => $updatedPost->getTitle(),
        'slug' => $updatedPost->getSlug(),
        'category' => $updatedPost->getCategory(),
        'contentHtml' => $updatedPost->getContentHtml(),
        'coverUrl' => $updatedPost->getCoverUrl(),
        'tags' => $updatedPost->getTags(),
        'state' => $updatedPost->getState(),
        'reads' => $updatedPost->getReads(),
        'author' => $updatedPost->getAuthor(),
        'date' => $updatedPost->getDate(),
        'fixedHome' => (bool)$updatedPost->getFixedHome(),
        'fixedCategory' => (bool)$updatedPost->getFixedCategory(),
      ];

      $response->getBody()->write(json_encode($result));
      return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
    } catch (\Exception $e) {
      error_log('Error updating post: ' . $e->getMessage());
      error_log('Stack trace: ' . $e->getTraceAsString());
      $response->getBody()->write(json_encode(['error' => 'Failed to update post: ' . $e->getMessage()]));
      return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
    }
  }

  public function delete(Request $request, Response $response, array $args): Response
  {
    $id = $args['id'] ?? null;
    if (!$id) {
      $response->getBody()->write(json_encode(['error' => 'ID is required']));
      return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
    }
    try {
      $success = Posts::delete($id);
      if (!$success) {
        $response->getBody()->write(json_encode(['error' => 'Failed to delete post']));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
      }
      $response->getBody()->write(json_encode(['message' => 'Post deleted successfully']));
      return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
    } catch (\Exception $e) {
      error_log('Error deleting post: ' . $e->getMessage());
      error_log('Stack trace: ' . $e->getTraceAsString());
      $response->getBody()->write(json_encode(['error' => 'Failed to delete post']));
      return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
    }
  }

  public function uploadImage(Request $request, Response $response, array $args): Response
  {
    // Get base URL
    $baseUrl = $this->getBaseUrl();
    if (empty($baseUrl)) {
      $response->getBody()->write(json_encode(['error' => 'Base URL is required']));
      return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
    }

    $id = $args['id'] ?? null;
    if (!$id) {
      $response->getBody()->write(json_encode(['error' => 'ID is required']));
      return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
    }
    $uploadedFiles = $request->getUploadedFiles();
    if (!isset($uploadedFiles['file'])) {
      $response->getBody()->write(json_encode(['error' => 'File is required']));
      return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
    }
    $file = $uploadedFiles['file'];

    // Verificar errores de upload con mensajes específicos
    if ($file->getError() !== UPLOAD_ERR_OK) {
      $uploadErrors = [
        UPLOAD_ERR_INI_SIZE => 'El archivo excede el tamaño máximo permitido por PHP (upload_max_filesize)',
        UPLOAD_ERR_FORM_SIZE => 'El archivo excede el tamaño máximo permitido por el formulario (post_max_size)',
        UPLOAD_ERR_PARTIAL => 'El archivo fue subido parcialmente',
        UPLOAD_ERR_NO_FILE => 'No se subió ningún archivo',
        UPLOAD_ERR_NO_TMP_DIR => 'Falta el directorio temporal',
        UPLOAD_ERR_CANT_WRITE => 'No se pudo escribir el archivo al disco',
        UPLOAD_ERR_EXTENSION => 'Una extensión de PHP detuvo la subida del archivo'
      ];
      $errorMessage = $uploadErrors[$file->getError()] ?? 'Error desconocido al subir el archivo';
      error_log('Error de upload: ' . $errorMessage . ' (Error code: ' . $file->getError() . ')');
      $response->getBody()->write(json_encode(['error' => $errorMessage]));
      return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
    }


    // Verificar tamaño del archivo (50MB máximo)
    $maxSize = 50 * 1024 * 1024; // 50MB en bytes
    if ($file->getSize() > $maxSize) {
      $response->getBody()->write(json_encode(['error' => 'El archivo es demasiado grande. Tamaño máximo permitido: 50MB']));
      return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
    }
    try {
      $folder = __DIR__ . '/../../../public/uploads/posts/' . $id;

      if (!is_dir($folder)) {
        mkdir($folder, 0755, true);
      }
      $filename = uniqid() . '.' . pathinfo($file->getClientFilename(), PATHINFO_EXTENSION);
      $filePath = $folder . '/' . $filename;

      $file->moveTo($filePath);

      $url = $baseUrl . '/api/uploads/posts/' . $id . '/' . $filename;

      $response->getBody()->write(json_encode(['url' => $url]));
      return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
    } catch (\Exception $e) {
      error_log('Error uploading image: ' . $e->getMessage());
      error_log('Stack trace: ' . $e->getTraceAsString());
      $response->getBody()->write(json_encode(['error' => 'Failed to upload image']));
      return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
    }
  }

  public function deleteImage(Request $request, Response $response, array $args): Response
  {
    $data = $request->getParsedBody();
    $src = $data['src'] ?? null;
    if (!$src || !is_string($src)) {
      $response->getBody()->write(json_encode(['error' => 'Invalid src parameter']));
      return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
    }
    $filePath = __DIR__ . '/../../../public' . $src;
    try {
      if (file_exists($filePath)) {
        unlink($filePath);
        $response->getBody()->write(json_encode(['message' => 'Image deleted successfully']));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
      } else {
        $response->getBody()->write(json_encode(['error' => 'File not found']));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(404);
      }
    } catch (\Exception $e) {
      error_log('Error deleting image: ' . $e->getMessage());
      error_log('Stack trace: ' . $e->getTraceAsString());
      $response->getBody()->write(json_encode(['error' => 'Failed to delete image']));
      return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
    }
  }
}
