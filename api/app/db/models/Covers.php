<?php

namespace App\Db\Models;

require_once dirname(__DIR__, 3) . '/config/database.php';

class Covers {
    private $id;
    private $title;
    private $imageUrl;
    private $state;
    private $pinned;
    private $created_at;

    public function __construct($id = null, $title = null, $imageUrl = null, $state = null, $pinned = null, $created_at = null) {
        $this->id = $id;
        $this->title = $title;
        $this->imageUrl = $imageUrl;
        $this->state = $state ?: 'Publicado';
        $this->pinned = $pinned ?: false;
        $this->created_at = $created_at ?: date('Y-m-d H:i:s');
    }

    public function getId() {
        return $this->id;
    }

    public function getTitle() {
        return $this->title;
    }


    public function getImageUrl() {
        return $this->imageUrl;
    }

    public function getState() {
        return $this->state;
    }

    public function getPinned() {
        return $this->pinned;
    }

    public function setTitle($title) {
        $this->title = $title;
    }


    public function setImageUrl($imageUrl) {
        $this->imageUrl = $imageUrl;
    }

    public function setState($state) {
        $this->state = $state;
    }

    public function setPinned($pinned) {
        $this->pinned = $pinned;
    }

    public function getCreatedAt() {
        return $this->created_at;
    }

    public static function findAll() {
        $pdo = getPDO();
        $stmt = $pdo->query("SELECT * FROM Covers");
        $results = $stmt->fetchAll();
        $covers = [];
        foreach ($results as $row) {
            $covers[] = new self($row['id'], $row['title'], $row['imageUrl'], $row['state'], $row['pinned'], $row['created_at'] ?? null);
        }
        return $covers;
    }

    public static function findById($id) {
        $pdo = getPDO();
        $stmt = $pdo->prepare("SELECT * FROM Covers WHERE id = ?");
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        if ($row) {
            return new self($row['id'], $row['title'], $row['imageUrl'], $row['state'], $row['pinned'], $row['created_at'] ?? null);
        }
        return null;
    }

    public static function create($data) {
        $pdo = getPDO();
        $id = self::generateUuid();
        $createdAt = isset($data['created_at']) ? $data['created_at'] : date('Y-m-d H:i:s');
        $stmt = $pdo->prepare("INSERT INTO Covers (id, title, imageUrl, state, pinned, created_at) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([$id, $data['title'], $data['imageUrl'], $data['state'], $data['pinned'], $createdAt]);
        return new self($id, $data['title'], $data['imageUrl'], $data['state'], $data['pinned'], $createdAt);
    }

    public static function update($id, $data) {
        $pdo = getPDO();
        $stmt = $pdo->prepare("UPDATE Covers SET title = ?, imageUrl = ?, state = ?, pinned = ? WHERE id = ?");
        return $stmt->execute([$data['title'], $data['imageUrl'], $data['state'], $data['pinned'], $id]);
    }

    public static function delete($id) {
        $pdo = getPDO();
        $stmt = $pdo->prepare("DELETE FROM Covers WHERE id = ?");
        return $stmt->execute([$id]);
    }

    private static function generateUuid() {
        return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
            mt_rand(0, 0xffff), mt_rand(0, 0xffff),
            mt_rand(0, 0xffff),
            mt_rand(0, 0x0fff) | 0x4000,
            mt_rand(0, 0x3fff) | 0x8000,
            mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
        );
    }
}
