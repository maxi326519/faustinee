<?php
// app/routes/controllers/covers.php

namespace App\Routes\Controllers\Covers;

use App\Db\Models\Covers;
use Slim\Psr7\Request;
use Slim\Psr7\Response;

class CoversController {
    public function index(Request $request, Response $response, array $args): Response {
        try {
            $covers = Covers::findAll();
            $data = array_map(function ($cover) {
                return [
                    'id' => $cover->getId(),
                    'title' => $cover->getTitle(),
                    'img' => $cover->getImageUrl(),
                    'date' => $cover->getCreatedAt() ?: date('Y-m-d H:i:s')
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

    public function store(Request $request, Response $response, array $args): Response {
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
                $data['image_url'] = '/uploads/covers/' . $filename;
            }
        }
        try {
            $cover = Covers::create($data);
            $result = [
                'id' => $cover->getId(),
                'title' => $cover->getTitle(),
                'img' => $cover->getImageUrl(),
                'date' => $cover->getCreatedAt() ?: date('Y-m-d H:i:s')
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

    public function update(Request $request, Response $response, array $args): Response {
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

    public function delete(Request $request, Response $response, array $args): Response {
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
