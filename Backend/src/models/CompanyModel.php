<?php   
    namespace App\Models;
    class CompanyModel{
        public function createCompanyAccount($companyInfo){
            global $pdo;
            $stmt = $pdo->prepare("INSERT INTO company_info (company_name, company_email, company_phnNo) VALUES (?, ?, ?)");
            $stmt->execute([$companyInfo['name'], $companyInfo['email'], $companyInfo['phoneNumber']]);
        }

        public function isCompanyAccountExist($email, $phoneNumber){
            global $pdo;
            $stmt = $pdo->prepare("SELECT 1 FROM company_info WHERE company_email = :email OR company_phnNo = :phoneNumber LIMIT 1");
            $stmt->execute(['email'=> $email, 'phoneNumber' => $phoneNumber]);
          return  $stmt->fetchColumn() !== false;

        }

        public function isAccountExist($id){
            global $pdo;
            $stmt = $pdo->prepare("SELECT 1 FROM company_info WHERE company_id = ?");
            $stmt->execute([$id]);
            return $stmt->fetchColumn() !== false;
        }
    }


 ?>