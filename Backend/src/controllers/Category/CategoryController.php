<?php
namespace App\Controllers\Category;

use App\Models\CategoryModel;
use App\Services\SessionService;
use App\Domain\Session\SessionManager;
use Exception;

class CategoryController
{
    private CategoryModel $categoryModel;

    public function __construct()
    {
        $this->categoryModel = new CategoryModel();
    }

    public function fetchAll(): void
    {
        $categories = $this->categoryModel->fetchAll();
        echo json_encode(['success' => true, 'data' => $categories]);
    }

    public function create(): void
    {
        try {
            $session = new SessionService(new SessionManager());
            $user = $session->get('user');
            $role = strtolower((string) ($user['user']['role'] ?? ''));
            if ($role !== 'superadmin') {
                throw new Exception('Only superadmin can create categories');
            }

            $input = json_decode(file_get_contents('php://input'), true) ?? [];
            $name = trim((string) ($input['name'] ?? ''));
            if ($name === '') {
                throw new Exception('Category name is required');
            }

            $id = $this->categoryModel->create($name);
            http_response_code(201);
            echo json_encode([
                'success' => true,
                'message' => 'Category created',
                'data' => ['id' => $id, 'name' => $name],
            ]);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }
}
