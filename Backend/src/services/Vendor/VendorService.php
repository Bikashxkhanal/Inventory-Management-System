<?php 
    namespace App\Services\Vendor;
    use App\Domain\Session\SessionManager;
    use App\Domain\Vendor\Vendor;
    use App\Models\VendorModel;
    use App\Services\SanitizationService;
    use App\Services\SessionService;
    use App\Services\ValidationService;
    use App\Domain\Vendor\VendorPolicy;
    use App\Domain\Vendor\VendorService;
    use DomainException;
    use Exception;


    class VendorService{
        private $sanitizer;
        private $validator;
        private $vendorPolicy;
        private $session;
        private $vendorService;
        public function __construct(){
            $this->sanitizer = new SanitizationService();
            $this->validator = new ValidationService();
            $this->vendorPolicy = new VendorPolicy();
            $this->session = new SessionService(new SessionManager());
            $model =  new VendorModel();
            $this->vendorService  = new VendorService($model);
        }
        public function createVendor(array $vendor){
        try {
            //sanitize
            $vendorSanitizer = new VendorCreationSanitization(); 
            $sanitizedData = $this->sanitizer->handleSanitization($vendor, $sanitizer);


            //validation of the input
            $validationService = new VendorCreationValidation();
            $validatedData = $this->validator->handleValidation($sanitizedData, $validationService);

            //checking policies
            $currentUser=  $this->session->get('USER');
            $currentUserRole =  $currentUser['identity']['role'];
            $this->vendorPolicy->canCreateVendor($currentUserRole);

            //vendor creation
            $vendor = new Vendor(($validatedData));
            //store vendor detail in db
            $this->vendorService->createVendor($vendor);
        //create log
    }catch(DomainException $e){
        throw new DomainException($e);
    }catch(Exception $e){
        throw new Exception($e);
    }
    
    
            
        }
        public function deleteVendor(int $vendorId){
            //sanitize


            //validate
            //policy
            //call db
            //create log


        }//deactivating vendor
        public function updateVendorEmail(int $vendorId, string $email ){}
        public function activateVendor(int $vendorId){}
    }