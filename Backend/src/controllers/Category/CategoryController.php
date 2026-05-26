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

    private function currentUser(): array
    {
        $session = new SessionService(new SessionManager());
        $user = $session->get('user');
        if (!$user) {
            throw new Exception('Unauthorized');
        }
        return $user;
    }

    public function fetchAll(): void
    {
        $user = $this->currentUser();
        $categories = $this->categoryModel->fetchAll($user['company']['companyId']);
        echo json_encode(['success' => true, 'data' => $categories]);
    }

    public function create(): void
    {
        try {
            $user = $this->currentUser();
            $role = strtolower((string) ($user['user']['role'] ?? ''));
            $companyId = $user['company']['companyId'];
            if(!$companyId){
                throw new Exception("Please select a company first!");
            }
            if ($role !== 'superadmin') {
                throw new Exception('Only superadmin can create categories');
            }

            $input = json_decode(file_get_contents('php://input'), true) ?? [];
            $name = trim((string) ($input['name'] ?? ''));
            if ($name === '') {
                throw new Exception('Category name is required');
            }

            $id = $this->categoryModel->create($name, $companyId);
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
