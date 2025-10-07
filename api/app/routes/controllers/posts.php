<?php
// app/routes/controllers/posts.php

namespace App\Routes\Controllers\Posts;

use App\Db\Models\Posts;
use Slim\Psr7\Request;
use Slim\Psr7\Response;

class PostsController
{
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
          'created_at' => $post->getCreatedAt(),
          'updated_at' => $post->getUpdatedAt()
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
        'created_at' => $post->getCreatedAt(),
        'updated_at' => $post->getUpdatedAt()
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
    $data = $request->getParsedBody();
    
    // Si no hay datos en getParsedBody(), intentar obtener de $_POST (FormData)
    if (empty($data)) {
      $data = $_POST;
    }

    $title = $data['title'] ?? '';
    $contentHtml = $data['contentHtml'] ?? '';
    if (empty($title) || empty($contentHtml)) {
      error_log('Validación fallida - Title: ' . $title . ', ContentHtml: ' . (empty($contentHtml) ? 'EMPTY' : 'PRESENT'));
      $response->getBody()->write(json_encode(['error' => 'Title and contentHtml are required']));
      return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
    }
    try {
      // Convertir valores booleanos de string a int
      $data['fixedHome'] = $data['fixedHome'] === 'true' || $data['fixedHome'] === true ? 1 : 0;
      $data['fixedCategory'] = $data['fixedCategory'] === 'true' || $data['fixedCategory'] === true ? 1 : 0;

      // Generar slug automáticamente si está vacío
      if (empty($data['slug'])) {
        $data['slug'] = $this->generateSlug($data['title']);
      }

      $post = Posts::create($data);
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
        'created_at' => $post->getCreatedAt(),
        'updated_at' => $post->getUpdatedAt()
      ];
      $response->getBody()->write(json_encode($result));
      return $response->withHeader('Content-Type', 'application/json')->withStatus(201);
    } catch (\Exception $e) {
      error_log('Error creating post: ' . $e->getMessage());
      error_log('Stack trace: ' . $e->getTraceAsString());
      $response->getBody()->write(json_encode(['error' => 'Failed to create post']));
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
    $data = $request->getParsedBody();
    
    // Si no hay datos en getParsedBody(), usar $_POST (FormData)
    if (empty($data)) {
      $data = $_POST;
    }
    
    $title = $data['title'] ?? '';
    $contentHtml = $data['contentHtml'] ?? '';
    if (empty($title) || empty($contentHtml)) {
      error_log('Validación fallida - Title vacío: ' . (empty($title) ? 'SÍ' : 'NO') . ', ContentHtml vacío: ' . (empty($contentHtml) ? 'SÍ' : 'NO'));
      $response->getBody()->write(json_encode(['error' => 'Title and contentHtml are required']));
      return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
    }
    try {
      // Convertir valores booleanos de string a int
      $data['fixedHome'] = $data['fixedHome'] === 'true' || $data['fixedHome'] === true ? 1 : 0;
      $data['fixedCategory'] = $data['fixedCategory'] === 'true' || $data['fixedCategory'] === true ? 1 : 0;

      // Generar slug automáticamente si está vacío
      if (empty($data['slug'])) {
        $data['slug'] = $this->generateSlug($data['title']);
      }

      $success = Posts::update($id, $data);
      if (!$success) {
        $response->getBody()->write(json_encode(['error' => 'Failed to update post']));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
      }
      $response->getBody()->write(json_encode(['message' => 'Post updated successfully']));
      return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
    } catch (\Exception $e) {
      error_log('Error updating post: ' . $e->getMessage());
      error_log('Stack trace: ' . $e->getTraceAsString());
      $response->getBody()->write(json_encode(['error' => 'Failed to update post']));
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
    if ($file->getError() !== UPLOAD_ERR_OK) {
      $response->getBody()->write(json_encode(['error' => 'File upload error']));
      return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
    }
    try {
      $folder = __DIR__ . '/../../../public/uploads/posts/' . $id;
      error_log('Upload folder: ' . $folder);
      error_log('File error: ' . $file->getError());
      error_log('File size: ' . $file->getSize());
      error_log('File name: ' . $file->getClientFilename());

      if (!is_dir($folder)) {
        mkdir($folder, 0755, true);
        error_log('Created directory: ' . $folder);
      }
      $filename = uniqid() . '.' . pathinfo($file->getClientFilename(), PATHINFO_EXTENSION);
      $filePath = $folder . '/' . $filename;
      error_log('Moving file to: ' . $filePath);

      $file->moveTo($filePath);
      $url = '/uploads/posts/' . $id . '/' . $filename;
      error_log('Generated URL: ' . $url);

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
