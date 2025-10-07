<?php

namespace App\Db\Models;

require_once dirname(__DIR__, 3) . '/config/database.php';

class Users {
    private $id;
    private $name;
    private $email;
    private $password;

    public function __construct($id = null, $name = null, $email = null, $password = null) {
        $this->id = $id;
        $this->name = $name;
        $this->email = $email;
        $this->password = $password;
    }

    public function getId() {
        return $this->id;
    }

    public function getName() {
        return $this->name;
    }

    public function getEmail() {
        return $this->email;
    }

    public function getPassword() {
        return $this->password;
    }

    public function setName($name) {
        $this->name = $name;
    }

    public function setEmail($email) {
        $this->email = $email;
    }

    public function setPassword($password) {
        $this->password = $password;
    }

    public static function findAll() {
        $pdo = getPDO();
        $stmt = $pdo->query("SELECT * FROM Users");
        $results = $stmt->fetchAll();
        $users = [];
        foreach ($results as $row) {
            $users[] = new self($row['id'], $row['name'], $row['email'], $row['password']);
        }
        return $users;
    }

    public static function findById($id) {
        $pdo = getPDO();
        $stmt = $pdo->prepare("SELECT * FROM Users WHERE id = ?");
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        if ($row) {
            return new self($row['id'], $row['name'], $row['email'], $row['password']);
        }
        return null;
    }

    public static function findByEmail($email) {
        $pdo = getPDO();
        $stmt = $pdo->prepare("SELECT * FROM Users WHERE email = ?");
        $stmt->execute([$email]);
        $row = $stmt->fetch();
        if ($row) {
            return new self($row['id'], $row['name'], $row['email'], $row['password']);
        }
        return null;
    }

    public static function create($data) {
        $pdo = getPDO();
        $stmt = $pdo->prepare("INSERT INTO Users (name, email, password) VALUES (?, ?, ?)");
        $stmt->execute([$data['name'], $data['email'], $data['password']]);
        $id = $pdo->lastInsertId();
        return new self($id, $data['name'], $data['email'], $data['password']);
    }

    public static function update($id, $data) {
        $pdo = getPDO();
        if (isset($data['password'])) {
            $stmt = $pdo->prepare("UPDATE Users SET name = ?, email = ?, password = ? WHERE id = ?");
            return $stmt->execute([$data['name'], $data['email'], $data['password'], $id]);
        } else {
            $stmt = $pdo->prepare("UPDATE Users SET name = ?, email = ? WHERE id = ?");
            return $stmt->execute([$data['name'], $data['email'], $id]);
        }
    }

    public static function delete($id) {
        $pdo = getPDO();
        $stmt = $pdo->prepare("DELETE FROM Users WHERE id = ?");
        return $stmt->execute([$id]);
    }
}
