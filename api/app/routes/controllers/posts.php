<?php
// app/routes/controllers/posts.php

namespace App\Routes\Controllers\Posts;

use App\Db\Models\Posts;
use Slim\Psr7\Request;
use Slim\Psr7\Response;

class PostsController {
    public function index(Request $request, Response $response, array $args): Response {
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
            $result['items'] = array_map(function($post) {
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
                    'fixedHome' => $post->getFixedHome(),
                    'fixedCategory' => $post->getFixedCategory(),
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

    public function show(Request $request, Response $response, array $args): Response {
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
                'fixedHome' => $post->getFixedHome(),
                'fixedCategory' => $post->getFixedCategory(),
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

    public function store(Request $request, Response $response, array $args): Response {
        $data = $request->getParsedBody();
        $title = $data['title'] ?? '';
        $content = $data['content'] ?? '';
        if (empty($title) || empty($content)) {
            $response->getBody()->write(json_encode(['error' => 'Title and content are required']));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
        }
        try {
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
                'fixedHome' => $post->getFixedHome(),
                'fixedCategory' => $post->getFixedCategory(),
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

    public function update(Request $request, Response $response, array $args): Response {
        $id = $args['id'] ?? null;
        if (!$id) {
            $response->getBody()->write(json_encode(['error' => 'ID is required']));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
        }
        $data = $request->getParsedBody();
        $title = $data['title'] ?? '';
        $content = $data['content'] ?? '';
        if (empty($title) || empty($content)) {
            $response->getBody()->write(json_encode(['error' => 'Title and content are required']));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
        }
        try {
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

    public function delete(Request $request, Response $response, array $args): Response {
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

    public function uploadImage(Request $request, Response $response, array $args): Response {
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
            $folder = __DIR__ . '/../../../uploads/posts/' . $id;
            if (!is_dir($folder)) {
                mkdir($folder, 0755, true);
            }
            $filename = uniqid() . '.' . pathinfo($file->getClientFilename(), PATHINFO_EXTENSION);
            $file->moveTo($folder . '/' . $filename);
            $url = '/uploads/posts/' . $id . '/' . $filename;
            $response->getBody()->write(json_encode(['url' => $url]));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
        } catch (\Exception $e) {
            error_log('Error uploading image: ' . $e->getMessage());
            error_log('Stack trace: ' . $e->getTraceAsString());
            $response->getBody()->write(json_encode(['error' => 'Failed to upload image']));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
        }
    }

    public function deleteImage(Request $request, Response $response, array $args): Response {
        $data = $request->getParsedBody();
        $src = $data['src'] ?? null;
        if (!$src || !is_string($src)) {
            $response->getBody()->write(json_encode(['error' => 'Invalid src parameter']));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
        }
        $filePath = __DIR__ . '/../public' . $src;
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
