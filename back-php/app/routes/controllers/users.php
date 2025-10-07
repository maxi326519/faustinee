<?php
// app/routes/controllers/users.php

namespace App\Routes\Controllers\Users;

use App\Db\Models\Users;
use Slim\Psr7\Request;
use Slim\Psr7\Response;

// Define the UsersController class
class UsersController
{
  // Method to get all users
  public function index(Request $request, Response $response, array $args): Response
  {
    try {
      error_log('Getting all users');

      $users = Users::findAll();
      $data = array_map(function ($user) {
        return [
          'id' => $user->getId(),
          'name' => $user->getName(),
          'email' => $user->getEmail()
          // Exclude password for security
        ];
      }, $users);
      $response->getBody()->write(json_encode($data));
      return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
    } catch (\Exception $e) {
      error_log('Error fetching users: ' . $e->getMessage());
      error_log('Stack trace: ' . $e->getTraceAsString());
      $response->getBody()->write(json_encode(['error' => $e->getMessage()]));
      return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
    }
  }

  // Method to get a user by ID
  public function show(Request $request, Response $response, array $args): Response
  {
    $id = $args['id'] ?? null;
    if (!$id) {
      $response->getBody()->write(json_encode(['error' => 'ID is required']));
      return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
    }
    try {
      $user = Users::findById($id);
      if (!$user) {
        $response->getBody()->write(json_encode(['error' => 'User not found']));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(404);
      }
      $data = [
        'id' => $user->getId(),
        'name' => $user->getName(),
        'email' => $user->getEmail()
      ];
      error_log('User fetched successfully: ID ' . $id);
      $response->getBody()->write(json_encode($data));
      return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
    } catch (\Exception $e) {
      error_log('Error fetching user: ' . $e->getMessage());
      error_log('Stack trace: ' . $e->getTraceAsString());
      $response->getBody()->write(json_encode(['error' => $e->getMessage()]));
      return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
    }
  }

  // Method to create a new user
  public function store(Request $request, Response $response, array $args): Response
  {
    $data = $request->getParsedBody();
    $name = $data['name'] ?? '';
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';
    if (empty($name) || empty($email) || empty($password)) {
      $response->getBody()->write(json_encode(['error' => 'Name, email, and password are required']));
      return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
    }
    // Check if email already exists
    if (Users::findByEmail($email)) {
      $response->getBody()->write(json_encode(['error' => 'Email already exists']));
      return $response->withHeader('Content-Type', 'application/json')->withStatus(409);
    }
    $data['password'] = password_hash($password, PASSWORD_DEFAULT);
    try {
      $newUser = Users::create($data);
      $result = [
        'id' => $newUser->getId(),
        'name' => $newUser->getName(),
        'email' => $newUser->getEmail()
      ];
      error_log('User created successfully: ID ' . $newUser->getId());
      $response->getBody()->write(json_encode($result));
      return $response->withHeader('Content-Type', 'application/json')->withStatus(201);
    } catch (\Exception $e) {
      error_log('Error creating user: ' . $e->getMessage());
      error_log('Stack trace: ' . $e->getTraceAsString());
      $response->getBody()->write(json_encode(['error' => 'Failed to create user']));
      return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
    }
  }

  // Method to update a user
  public function update(Request $request, Response $response, array $args): Response
  {
    $id = $args['id'] ?? null;
    if (!$id) {
      $response->getBody()->write(json_encode(['error' => 'ID is required']));
      return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
    }
    $data = $request->getParsedBody();
    $name = $data['name'] ?? '';
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';
    if (empty($name) || empty($email)) {
      $response->getBody()->write(json_encode(['error' => 'Name and email are required']));
      return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
    }
    // Check if user exists
    $user = Users::findById($id);
    if (!$user) {
      $response->getBody()->write(json_encode(['error' => 'User not found']));
      return $response->withHeader('Content-Type', 'application/json')->withStatus(404);
    }
    // Check if email is taken by another user
    $existing = Users::findByEmail($email);
    if ($existing && $existing->getId() != $id) {
      $response->getBody()->write(json_encode(['error' => 'Email already exists']));
      return $response->withHeader('Content-Type', 'application/json')->withStatus(409);
    }
    if (!empty($password)) {
      $data['password'] = password_hash($password, PASSWORD_DEFAULT);
    }
    try {
      $success = Users::update($id, $data);
      if (!$success) {
        $response->getBody()->write(json_encode(['error' => 'Failed to update user']));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
      }
      error_log('User updated successfully: ID ' . $id);
      $response->getBody()->write(json_encode(['message' => 'User updated successfully']));
      return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
    } catch (\Exception $e) {
      error_log('Error updating user: ' . $e->getMessage());
      error_log('Stack trace: ' . $e->getTraceAsString());
      $response->getBody()->write(json_encode(['error' => 'Failed to update user']));
      return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
    }
  }

  // Method to delete a user
  public function delete(Request $request, Response $response, array $args): Response
  {
    $id = $args['id'] ?? null;
    if (!$id) {
      $response->getBody()->write(json_encode(['error' => 'ID is required']));
      return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
    }
    try {
      $success = Users::delete($id);
      if (!$success) {
        $response->getBody()->write(json_encode(['error' => 'Failed to delete user']));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
      }
      error_log('User deleted successfully: ID ' . $id);
      $response->getBody()->write(json_encode(['message' => 'User deleted successfully']));
      return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
    } catch (\Exception $e) {
      error_log('Error deleting user: ' . $e->getMessage());
      error_log('Stack trace: ' . $e->getTraceAsString());
      $response->getBody()->write(json_encode(['error' => 'Failed to delete user']));
      return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
    }
  }
}
