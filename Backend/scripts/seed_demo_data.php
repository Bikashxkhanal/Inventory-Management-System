<?php
/**
 * Demo seed: two extra companies with users, catalog, purchases, and sales.
 *
 * Run from project root:
 *   php Backend/scripts/seed_demo_data.php
 *
 * Demo password for all seeded users: Password@1
 */

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../src/config/envConfig.php';
require_once __DIR__ . '/../src/config/dbConfig.php';

use App\Helpers\EntitySchema;
use App\Helpers\PurchaseSchema;

const DEMO_PASSWORD = 'Password@1';

$companies = [
    [
        'name' => 'Himalayan Traders Pvt Ltd',
        'email' => 'contact@himalayantraders.demo',
        'phone' => '9811000001',
        'users' => [
            ['firstName' => 'Suman', 'lastName' => 'Gurung', 'email' => 'suman@himalayantraders.demo', 'phone' => '9811000010', 'role' => 'superadmin'],
            ['firstName' => 'Anita', 'lastName' => 'Rai', 'email' => 'anita@himalayantraders.demo', 'phone' => '9811000011', 'role' => 'admin'],
            ['firstName' => 'Bikash', 'lastName' => 'Karki', 'email' => 'bikash@himalayantraders.demo', 'phone' => '9811000012', 'role' => 'manager'],
            ['firstName' => 'Rita', 'lastName' => 'Tamang', 'email' => 'rita@himalayantraders.demo', 'phone' => '9811000013', 'role' => 'salesperson'],
        ],
    ],
    [
        'name' => 'Valley Retail Co',
        'email' => 'hello@valleyretail.demo',
        'phone' => '9812000001',
        'users' => [
            ['firstName' => 'Nabin', 'lastName' => 'Shrestha', 'email' => 'nabin@valleyretail.demo', 'phone' => '9812000010', 'role' => 'superadmin'],
            ['firstName' => 'Priya', 'lastName' => 'Maharjan', 'email' => 'priya@valleyretail.demo', 'phone' => '9812000011', 'role' => 'admin'],
            ['firstName' => 'Kiran', 'lastName' => 'Bhandari', 'email' => 'kiran@valleyretail.demo', 'phone' => '9812000012', 'role' => 'manager'],
            ['firstName' => 'Sita', 'lastName' => 'Poudel', 'email' => 'sita@valleyretail.demo', 'phone' => '9812000013', 'role' => 'salesperson'],
        ],
    ],
];

$categories = ['Electronics', 'Grocery', 'Stationery', 'Beverages'];
$products = [
    ['Wireless Mouse', 'Electronics', 850],
    ['USB Keyboard', 'Electronics', 1200],
    ['Rice 5kg', 'Grocery', 650],
    ['Cooking Oil 1L', 'Grocery', 280],
    ['Notebook A4', 'Stationery', 120],
    ['Ballpoint Pen Pack', 'Stationery', 95],
    ['Mineral Water 1L', 'Beverages', 25],
    ['Instant Noodles', 'Grocery', 45],
];
$vendors = ['Kathmandu Supplies', 'Pokhara Wholesale', 'Biratnagar Distributors'];

function out(string $msg): void
{
    echo $msg . PHP_EOL;
}

function userExists(PDO $pdo, string $email): bool
{
    $stmt = $pdo->prepare('SELECT 1 FROM sys_user WHERE email = ? LIMIT 1');
    $stmt->execute([$email]);
    return (bool) $stmt->fetchColumn();
}

function ensureCategory(PDO $pdo, string $name): int
{
    $stmt = $pdo->prepare('SELECT id FROM category WHERE LOWER(name) = LOWER(?) LIMIT 1');
    $stmt->execute([$name]);
    $id = $stmt->fetchColumn();
    if ($id) {
        return (int) $id;
    }
    $ins = $pdo->prepare('INSERT INTO category (name) VALUES (?)');
    $ins->execute([$name]);
    return (int) $pdo->lastInsertId();
}

function ensureProduct(PDO $pdo, string $name, int $categoryId, float $sellPrice): int
{
    $stmt = $pdo->prepare('SELECT id FROM product WHERE LOWER(name) = LOWER(?) LIMIT 1');
    $stmt->execute([$name]);
    $id = $stmt->fetchColumn();
    if ($id) {
        return (int) $id;
    }

    $buyPrice = round($sellPrice * 0.7, 2);
    $cols = ['name'];
    $vals = [$name];
    if (EntitySchema::hasColumn('product', 'category_id')) {
        $cols[] = 'category_id';
        $vals[] = $categoryId;
    }
    if (EntitySchema::hasColumn('product', 'buy_price')) {
        $cols[] = 'buy_price';
        $vals[] = $buyPrice;
    }
    if (EntitySchema::hasColumn('product', 'sell_price')) {
        $cols[] = 'sell_price';
        $vals[] = $sellPrice;
    }
    if (EntitySchema::hasColumn('product', 'stock')) {
        $cols[] = 'stock';
        $vals[] = 100;
    }
    if (EntitySchema::hasColumn('product', 'approval_status')) {
        $cols[] = 'approval_status';
        $vals[] = 'active';
    }
    $ph = implode(', ', array_fill(0, count($cols), '?'));
    $pdo->prepare('INSERT INTO product (' . implode(', ', $cols) . ") VALUES ({$ph})")->execute($vals);
    $productId = (int) $pdo->lastInsertId();

    $check = $pdo->prepare('SELECT 1 FROM stock WHERE product_id = ?');
    $check->execute([$productId]);
    if (!$check->fetchColumn()) {
        $pdo->prepare('INSERT INTO stock (product_id, quantity, selling_price) VALUES (?, ?, ?)')
            ->execute([$productId, 100, $sellPrice]);
    }

    return $productId;
}

function ensureVendor(PDO $pdo, string $name): int
{
    $stmt = $pdo->prepare('SELECT id FROM vendor WHERE LOWER(name) = LOWER(?) LIMIT 1');
    $stmt->execute([$name]);
    $id = $stmt->fetchColumn();
    if ($id) {
        return (int) $id;
    }
    $cols = ['name'];
    $vals = [$name];
    if (EntitySchema::hasColumn('vendor', 'approval_status')) {
        $cols[] = 'approval_status';
        $vals[] = 'active';
    }
    $ph = implode(', ', array_fill(0, count($cols), '?'));
    $pdo->prepare('INSERT INTO vendor (' . implode(', ', $cols) . ") VALUES ({$ph})")->execute($vals);
    return (int) $pdo->lastInsertId();
}

try {
    global $pdo;
    $hash = password_hash(DEMO_PASSWORD, PASSWORD_BCRYPT);
    $productIds = [];

    out('=== Seeding shared catalog ===');
    foreach ($categories as $catName) {
        ensureCategory($pdo, $catName);
    }
    foreach ($products as [$pName, $catName, $price]) {
        $catId = ensureCategory($pdo, $catName);
        $productIds[] = ensureProduct($pdo, $pName, $catId, $price);
    }
    $vendorIds = [];
    foreach ($vendors as $vName) {
        $vendorIds[] = ensureVendor($pdo, $vName);
    }

    out('');
    out('=== Seeding companies & users (password: ' . DEMO_PASSWORD . ') ===');

    foreach ($companies as $co) {
        $checkCo = $pdo->prepare('SELECT company_id FROM company_info WHERE company_email = ? LIMIT 1');
        $checkCo->execute([$co['email']]);
        $companyId = $checkCo->fetchColumn();

        if (!$companyId) {
            $pdo->prepare('INSERT INTO company_info (company_name, company_email, company_phnNo) VALUES (?, ?, ?)')
                ->execute([$co['name'], $co['email'], $co['phone']]);
            $companyId = (int) $pdo->lastInsertId();
            out("Created company: {$co['name']} (id {$companyId})");
        } else {
            $companyId = (int) $companyId;
            out("Company exists: {$co['name']} (id {$companyId})");
        }

        $managerId = null;
        foreach ($co['users'] as $u) {
            if (userExists($pdo, $u['email'])) {
                out("  Skip user (exists): {$u['email']}");
                $stmt = $pdo->prepare('SELECT id FROM sys_user WHERE email = ?');
                $stmt->execute([$u['email']]);
                if ($u['role'] === 'manager') {
                    $managerId = (int) $stmt->fetchColumn();
                }
                continue;
            }

            $verifiedCol = EntitySchema::hasColumn('sys_user', 'isVerified') ? 'isVerified' : 'isverified';
            $cols = ['firstName', 'lastName', 'role', $verifiedCol, 'email', 'phoneNumber', 'companyId', 'password_hash'];
            $vals = [
                $u['firstName'], $u['lastName'], $u['role'], 1,
                $u['email'], $u['phone'], $companyId, $hash,
            ];
            if (EntitySchema::hasColumn('sys_user', 'status')) {
                $cols[] = 'status';
                $vals[] = 'active';
            }
            $ph = implode(', ', array_fill(0, count($cols), '?'));
            $pdo->prepare('INSERT INTO sys_user (' . implode(', ', $cols) . ") VALUES ({$ph})")->execute($vals);
            $uid = (int) $pdo->lastInsertId();
            if ($u['role'] === 'manager') {
                $managerId = $uid;
            }
            out("  User: {$u['email']} / {$u['phone']} ({$u['role']})");
        }

        if ($managerId && !empty($vendorIds) && !empty($productIds)) {
            $itemTable = PurchaseSchema::purchaseItemsTable();
            $priceCol = PurchaseSchema::itemPriceColumn();
            $subtotalCol = PurchaseSchema::itemSubtotalColumn();

            for ($i = 0; $i < 2; $i++) {
                $vendorId = $vendorIds[$i % count($vendorIds)];
                $pCols = ['vendor_id'];
                $pVals = [$vendorId];
                if (PurchaseSchema::hasPurchaseColumn('purchase_date')) {
                    $pCols[] = 'purchase_date';
                    $pVals[] = date('Y-m-d', strtotime("-{$i} days"));
                }
                if (PurchaseSchema::hasPurchaseColumn('status')) {
                    $pCols[] = 'status';
                    $pVals[] = 'completed';
                }
                if (PurchaseSchema::hasPurchaseColumn('created_by')) {
                    $pCols[] = 'created_by';
                    $pVals[] = $managerId;
                }
                if (PurchaseSchema::hasPurchaseColumn('total_amount')) {
                    $pCols[] = 'total_amount';
                    $pVals[] = 0;
                }
                $ph = implode(', ', array_fill(0, count($pCols), '?'));
                $pdo->prepare('INSERT INTO purchase (' . implode(', ', $pCols) . ") VALUES ({$ph})")->execute($pVals);
                $purchaseId = (int) $pdo->lastInsertId();
                $total = 0;

                for ($j = 0; $j < 2; $j++) {
                    $pid = $productIds[($i + $j) % count($productIds)];
                    $qty = 10 + $j;
                    $unit = 100 + ($j * 50);
                    $line = $qty * $unit;
                    $total += $line;
                    $iCols = ['purchase_id', 'product_id', 'quantity', $priceCol];
                    $iVals = [$purchaseId, $pid, $qty, $unit];
                    if ($subtotalCol) {
                        $iCols[] = $subtotalCol;
                        $iVals[] = $line;
                    }
                    $iph = implode(', ', array_fill(0, count($iCols), '?'));
                    $pdo->prepare("INSERT INTO `{$itemTable}` (" . implode(', ', $iCols) . ") VALUES ({$iph})")
                        ->execute($iVals);
                }
                if (PurchaseSchema::hasPurchaseColumn('total_amount')) {
                    $pdo->prepare('UPDATE purchase SET total_amount = ? WHERE id = ?')->execute([$total, $purchaseId]);
                }
            }
            out('  Added sample completed purchases');
        }

        $salesUser = null;
        $stmt = $pdo->prepare("SELECT id FROM sys_user WHERE companyId = ? AND role = 'salesperson' LIMIT 1");
        $stmt->execute([$companyId]);
        $salesUser = $stmt->fetchColumn();
        if ($salesUser && !empty($productIds)) {
            $custPhone = '980' . str_pad((string) $companyId, 7, '0', STR_PAD_LEFT);
            $cust = $pdo->prepare('SELECT id FROM customer WHERE phone_number = ?');
            $cust->execute([$custPhone]);
            $customerId = $cust->fetchColumn();
            if (!$customerId) {
                $pdo->prepare('INSERT INTO customer (phone_number) VALUES (?)')->execute([$custPhone]);
                $customerId = (int) $pdo->lastInsertId();
            } else {
                $customerId = (int) $customerId;
            }

            $sCols = ['customer_id', 'created_by'];
            $sVals = [$customerId, (int) $salesUser];
            if (EntitySchema::hasColumn('sales', 'status')) {
                $sCols[] = 'status';
                $sVals[] = 'completed';
            }
            $sph = implode(', ', array_fill(0, count($sCols), '?'));
            $pdo->prepare('INSERT INTO sales (' . implode(', ', $sCols) . ") VALUES ({$sph})")->execute($sVals);
            $saleId = (int) $pdo->lastInsertId();
            $pid = $productIds[0];
            $qty = 2;
            $priceStmt = $pdo->prepare('SELECT selling_price FROM stock WHERE product_id = ?');
            $priceStmt->execute([$pid]);
            $price = (float) ($priceStmt->fetchColumn() ?: 100);
            $sub = $qty * $price;
            $pdo->prepare('INSERT INTO sales_items (sale_id, product_id, quantity, price, subtotal) VALUES (?, ?, ?, ?, ?)')
                ->execute([$saleId, $pid, $qty, $price, $sub]);
            out('  Added sample sale');
        }
    }

    out('');
    out('=== Done ===');
    out('Login with any seeded email or 98xxxxxxxx phone and password: ' . DEMO_PASSWORD);
} catch (Throwable $e) {
    out('Seed failed: ' . $e->getMessage());
    exit(1);
}
