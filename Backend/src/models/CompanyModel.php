<?php   
    namespace App\Models;
    class CompanyModel{
        public function createCompanyAccount($companyInfo){
            global $pdo;
            $stmt = $pdo->prepare("INSERT INTO company_info (company_name, company_email, company_phnNo) VALUES (?, ?, ?)");
            $stmt->execute([$companyInfo['name'], $companyInfo['email'], $companyInfo['phnNbr']]);
        }

        public function isCompanyAccountExist($email){
            global $pdo;
            $stmt = $pdo->prepare("SELECT 1 FROM company_info WHERE company_email = :email LIMIT 1");
            $stmt->execute(['email'=> $email]);
          return  $stmt->fetchColumn() !== false;

        }
    }


 ?>