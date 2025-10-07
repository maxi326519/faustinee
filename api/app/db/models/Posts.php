<?php

namespace App\Db\Models;

require_once dirname(__DIR__, 3) . '/config/database.php';

class Posts
{
  private $id;
  private $title;
  private $slug;
  private $category;
  private $contentHtml;
  private $coverUrl;
  private $tags;
  private $state;
  private $reads;
  private $author;
  private $date;
  private $fixedHome;
  private $fixedCategory;
  private $created_at;
  private $updated_at;

  public function __construct($id = null, $title = null, $slug = null, $category = null, $contentHtml = null, $coverUrl = null, $tags = null, $state = null, $reads = null, $author = null, $date = null, $fixedHome = null, $fixedCategory = null, $created_at = null, $updated_at = null)
  {
    $this->id = $id;
    $this->title = $title;
    $this->slug = $slug;
    $this->category = $category;
    $this->contentHtml = $contentHtml;
    $this->coverUrl = $coverUrl;
    $this->tags = $tags;
    $this->state = $state ?: 'Borrador';
    $this->reads = $reads ?: 0;
    $this->author = $author;
    $this->date = $date;
    $this->fixedHome = $fixedHome;
    $this->fixedCategory = $fixedCategory;
    $this->created_at = $created_at ?: date('Y-m-d H:i:s');
    $this->updated_at = $updated_at ?: date('Y-m-d H:i:s');
  }

  public function getId()
  {
    return $this->id;
  }

  public function getTitle()
  {
    return $this->title;
  }

  public function getSlug()
  {
    return $this->slug;
  }

  public function getCategory()
  {
    return $this->category;
  }

  public function getContentHtml()
  {
    return $this->contentHtml;
  }

  public function getCoverUrl()
  {
    return $this->coverUrl;
  }

  public function getTags()
  {
    return $this->tags;
  }

  public function getState()
  {
    return $this->state;
  }

  public function getReads()
  {
    return $this->reads;
  }

  public function getAuthor()
  {
    return $this->author;
  }

  public function getDate()
  {
    return $this->date;
  }

  public function getFixedHome()
  {
    return $this->fixedHome;
  }

  public function getFixedCategory()
  {
    return $this->fixedCategory;
  }

  public function getCreatedAt()
  {
    return $this->created_at;
  }

  public function getUpdatedAt()
  {
    return $this->updated_at;
  }

  public function setTitle($title)
  {
    $this->title = $title;
    $this->updated_at = date('Y-m-d H:i:s');
  }

  public function setSlug($slug)
  {
    $this->slug = $slug;
  }

  public function setCategory($category)
  {
    $this->category = $category;
  }

  public function setContentHtml($contentHtml)
  {
    $this->contentHtml = $contentHtml;
    $this->updated_at = date('Y-m-d H:i:s');
  }

  public function setCoverUrl($coverUrl)
  {
    $this->coverUrl = $coverUrl;
  }

  public function setTags($tags)
  {
    $this->tags = $tags;
  }

  public function setState($state)
  {
    $this->state = $state;
  }

  public function setReads($reads)
  {
    $this->reads = $reads;
  }

  public function setAuthor($author)
  {
    $this->author = $author;
  }

  public function setDate($date)
  {
    $this->date = $date;
  }

  public function setFixedHome($fixedHome)
  {
    $this->fixedHome = $fixedHome;
  }

  public function setFixedCategory($fixedCategory)
  {
    $this->fixedCategory = $fixedCategory;
  }

  public static function findAll()
  {
    $pdo = getPDO();
    $stmt = $pdo->query("SELECT * FROM Posts");
    $results = $stmt->fetchAll();
    $posts = [];
    foreach ($results as $row) {
      $posts[] = new self($row['id'], $row['title'], $row['slug'] ?? null, $row['category'] ?? null, $row['contentHtml'] ?? null, $row['coverUrl'] ?? null, $row['tags'] ?? null, $row['state'] ?? 'Borrador', $row['reads'] ?? 0, $row['author'] ?? null, $row['date'] ?? null, $row['fixedHome'] ?? null, $row['fixedCategory'] ?? null, $row['created_at'] ?? null, $row['updated_at'] ?? null);
    }
    return $posts;
  }

  public static function findWithFilters($filters = [])
  {
    $pdo = getPDO();

    $page = $filters['page'] ?? 1;
    $items = $filters['items'] ?? 10;
    $latest = $filters['latest'] ?? false;
    $mustRead = $filters['mustRead'] ?? false;
    $category = $filters['category'] ?? null;
    $published = $filters['published'] ?? null;
    $state = $filters['state'] ?? null;

    $offset = ($page - 1) * $items;
    $limit = $items;

    $where = [];
    $params = [];
    $order = [];

    // Primero por fijado (true primero, false después)
    $order[] = "fixedHome DESC";

    if ($state) {
      $where[] = "state = ?";
      $params[] = $state;
    }

    if ($category) {
      $where[] = "category = ?";
      $params[] = $category;
      $order[] = "fixedCategory DESC";
    }

    // Filtrar por publicaciones publicadas si el parámetro está presente
    if ($published !== null) {
      $where[] = "state = ?";
      $params[] = $published ? "Publicado" : "Pendiente";
    }

    // Después según filtros
    if ($latest) {
      $order[] = "date DESC";
    } elseif ($mustRead) {
      $order[] = "`reads` DESC";
    } else {
      $order[] = "date DESC";
    }

    $whereClause = $where ? "WHERE " . implode(" AND ", $where) : "";
    $orderClause = "ORDER BY " . implode(", ", $order);

    // Query para contar total
    $countQuery = "SELECT COUNT(*) as total FROM Posts $whereClause";
    $countStmt = $pdo->prepare($countQuery);
    $countStmt->execute($params);
    $total = $countStmt->fetch()['total'];

    // Query para obtener posts
    $query = "SELECT * FROM Posts $whereClause $orderClause LIMIT ? OFFSET ?";
    $params[] = $limit;
    $params[] = $offset;
    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    $results = $stmt->fetchAll();

    $posts = [];
    foreach ($results as $row) {
      $posts[] = new self($row['id'], $row['title'], $row['slug'] ?? null, $row['category'] ?? null, $row['contentHtml'] ?? null, $row['coverUrl'] ?? null, $row['tags'] ?? null, $row['state'] ?? 'Borrador', $row['reads'] ?? 0, $row['author'] ?? null, $row['date'] ?? null, $row['fixedHome'] ?? null, $row['fixedCategory'] ?? null, $row['created_at'] ?? null, $row['updated_at'] ?? null);
    }

    return [
      'items' => $posts,
      'page' => [
        'current' => $page,
        'items' => $items,
        'totalPages' => ceil($total / $items),
      ],
    ];
  }

  public static function findById($id)
  {
    $pdo = getPDO();
    $stmt = $pdo->prepare("SELECT * FROM Posts WHERE id = ?");
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    if ($row) {
      return new self($row['id'], $row['title'], $row['slug'], $row['category'], $row['contentHtml'], $row['coverUrl'], $row['tags'], $row['state'], $row['reads'], $row['author'], $row['date'], $row['fixedHome'], $row['fixedCategory'], $row['created_at'], $row['updated_at']);
    }
    return null;
  }

  public static function findBySlug($slug)
  {
    $pdo = getPDO();
    $stmt = $pdo->prepare("SELECT * FROM Posts WHERE slug = ?");
    $stmt->execute([$slug]);
    $row = $stmt->fetch();
    if ($row) {
      // Increment reads
      $stmt = $pdo->prepare("UPDATE Posts SET `reads` = `reads` + 1 WHERE id = ?");
      $stmt->execute([$row['id']]);
      $row['reads'] += 1;
      return new self($row['id'], $row['title'], $row['slug'], $row['category'], $row['contentHtml'], $row['coverUrl'], $row['tags'], $row['state'], $row['reads'], $row['author'], $row['date'], $row['fixedHome'], $row['fixedCategory'], $row['created_at'], $row['updated_at']);
    }
    return null;
  }

  public static function create($data)
  {
    $pdo = getPDO();
    $id = self::generateUuid();
    $now = date('Y-m-d H:i:s');
    $stmt = $pdo->prepare("INSERT INTO Posts (id, title, slug, category, contentHtml, coverUrl, tags, state, `reads`, author, date, fixedHome, fixedCategory) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        $id, 
        $data['title'], 
        $data['slug'], 
        $data['category'] ?? '', 
        $data['contentHtml'], 
        $data['coverUrl'] ?? '', 
        $data['tags'] ?? '', 
        $data['state'] ?? 'Borrador', 
        $data['reads'] ?? 0, 
        $data['author'] ?? '', 
        $data['date'] ?? date('Y-m-d'), 
        $data['fixedHome'] ?? 0, 
        $data['fixedCategory'] ?? 0
    ]);
    return new self(
        $id, 
        $data['title'], 
        $data['slug'], 
        $data['category'] ?? '', 
        $data['contentHtml'], 
        $data['coverUrl'] ?? '', 
        $data['tags'] ?? '', 
        $data['state'] ?? 'Borrador', 
        $data['reads'] ?? 0, 
        $data['author'] ?? '', 
        $data['date'] ?? date('Y-m-d'), 
        $data['fixedHome'] ?? 0, 
        $data['fixedCategory'] ?? 0, 
        $now, 
        $now
    );
  }

  public static function update($id, $data)
  {
    $pdo = getPDO();
    $now = date('Y-m-d H:i:s');
    $stmt = $pdo->prepare("UPDATE Posts SET title = ?, slug = ?, category = ?, contentHtml = ?, coverUrl = ?, tags = ?, state = ?, `reads` = ?, author = ?, date = ?, fixedHome = ?, fixedCategory = ? WHERE id = ?");
    return $stmt->execute([
        $data['title'], 
        $data['slug'], 
        $data['category'] ?? '', 
        $data['contentHtml'], 
        $data['coverUrl'] ?? '', 
        $data['tags'] ?? '', 
        $data['state'] ?? 'Borrador', 
        $data['reads'] ?? 0, 
        $data['author'] ?? '', 
        $data['date'] ?? date('Y-m-d'), 
        $data['fixedHome'] ?? 0, 
        $data['fixedCategory'] ?? 0, 
        $id
    ]);
  }

  public static function delete($id)
  {
    $pdo = getPDO();
    $stmt = $pdo->prepare("DELETE FROM Posts WHERE id = ?");
    return $stmt->execute([$id]);
  }

  private static function generateUuid()
  {
    return sprintf(
      '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
      mt_rand(0, 0xffff),
      mt_rand(0, 0xffff),
      mt_rand(0, 0xffff),
      mt_rand(0, 0x0fff) | 0x4000,
      mt_rand(0, 0x3fff) | 0x8000,
      mt_rand(0, 0xffff),
      mt_rand(0, 0xffff),
      mt_rand(0, 0xffff)
    );
  }
}
