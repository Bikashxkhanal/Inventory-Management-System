<?php 
    namespace App\Models;

    use App\Domain\Vendor\Vendor;
    use DomainException;
    class VendorModel{
        public function isVendorExist(Vendor $vendor){
            global $pdo;
           $stmt = $pdo->prepare("SELECT 1 FROM vendor WHERE vendor_id = :id OR vendor_email = :email");
           $stmt->execute(['id' => $vendor->getId(), 'email' => $vendor->getEmail()]);
           return $stmt->fetchColumn() !== false; 
        }
        public function findById(int $id){
            global $pdo;
           $stmt = $pdo->prepare("SELECT * FROM vendor WHERE vendor_id = :id");
           $stmt->execute(['id'=> $id]);
          return $stmt->fetch(\PDO::FETCH_ASSOC);
        }
        public function create(Vendor $vendor){
            
            global $pdo;
            $pdo->beginTransaction();
            $stmt = $pdo->prepare("INSERT INTO vendor( vendor_name, vendor_address,vendor_email, vendor_contact , vendor_postal_code ) VALUES (vname, vaddress,vemail, vcontact, vpostal )");
            $stmt->execute(['vname' => $vendor->getName(), 'vaddress' => $vendor->getAddress(),'vemail' => $vendor->getEmail(),'vcontact' => $vendor->getPhoneNumber(), 'vpostal' => $vendor->getPostalCode() ]);

            $productId = $pdo->lastInsertId();

            if(!$productId ){
                $pdo->rollBack();
                throw new DomainException('couldnot create vendor');
            }

            $pdo->commit();
            return $productId;     
        }
        public function update(Vendor $vendor){
            global $pdo;
            $queries = [];
            $params = [];
             $name = $vendor->getName();
             $email = $vendor->getEmail();
             $postal = $vendor->getPostalCode();
             $contact = $vendor->getPhoneNumber();

             if($name){
                $queries[] = "vendor_name = ?";
                $params[]= $name;
             }
             if($email){
                $queries = "vendor_email = ?";
                $params = $email;
             }

             if($postal){
                $queries = "vendor_postal_code = ?";
                $params = $postal;
             }

             if($contact){
                $queries = "vendor_contact = ?";
                $params = $contact;
             }
            $params[] =  $vendor->getId();

      
            $pdo->beginTransaction();
           $stmt=  $pdo->prepare("UPDATE vendor SET " . implode(', ', $queries) . "WHERE vendor_id = ?" );
           $stmt->execute($params);

           if($stmt->rowCount() === 0){
            $pdo->rollBack();
            throw new DomainException('couldnot able to update vendor details');
           }

           $pdo->commit();

        }
        public function delete(int $id){
            global $pdo;
            $pdo->beginTransaction();
            $stmt = $pdo->prepare("DELETE FROM vendor WHERE vendor_id = :id");
            $stmt->execute(['id' => $id]);
            
            if($stmt->rowCount()=== 0){
                $pdo->rollBack();
                throw new DomainException('couldnot able to delete');
            }

            $pdo->commit();
            
        }

    }