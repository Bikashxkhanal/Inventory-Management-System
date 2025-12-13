<?php   
    namespace App\Models;
    class CompanyModel{
        public function createCompanyAccount($companyInfo){
            global $pdo;
            $stmt = $pdo->prepare("INSERT INTO company_info (company_name, company_email, company_phnNo) VALUES (?, ?, ?)");
            $stmt->execute([$companyInfo['name'], $companyInfo['email'], $companyInfo['phnNbr']]);
        }
    }


 ?>