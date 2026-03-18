<?php 

namespace App\Models;

use PDO;

class SalesItemsModel{

    //add sales items to the db
    public function addSalesItems(array $salesItems){
        global $pdo;
        foreach ($salesItems as $saleItems) {
            $placeholders[] = "(?, ?, ?, ?, ?)";
            $values[] = $saleItems['saleId'];
            $values[] = $saleItems['productId'];
            $values[] = $saleItems['quantity'];
            $values[] = $saleItems['unitPrice'];
            $values[] = $saleItems['subTotal'];

        }
       $stmt =  $pdo->prepare("
            INSERT INTO sales_items (sale_id, product_id, quantity, price, subtotal) VALUES" 
            . implode(',', $placeholders)
            );

        $stmt->execute($values);
        return ['success' => true];
    }

}


