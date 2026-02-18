<?php
    namespace App\Services\User;
    use App\Domain\Users\Entities\User;
    use App\Infrastructures\Sanitization\UserAccountCreationSanitization;
    use App\Domain\Session\SessionManager;
    use App\Models\UserModel;
    use App\Services\SanitizationService;
    use App\Services\SessionService;
    use App\Services\ValidationService;
    use App\Domain\Users\Policies\UserCreationPolicy;
    use Exception;
    use App\Infrastructures\Validation\UserAccountCreationValidation;

    class UserService{
        private $sanitizationService;
        private $validationService;
        

        public function __construct(){
            $this->sanitizationService = new SanitizationService();
            $this->validationService = new ValidationService();
              
        }

        public function userAccountCreationService($input){
            //TODO add error handling here
            //sanitization 
            $userAccountsanitization = new UserAccountCreationSanitization();
             $sanitizedInput =  $this->sanitizationService->handleSanitization($input, $userAccountsanitization);

            //validation
            $userAccountValidation = new UserAccountCreationValidation();
            $validatedInput = $this->validationService->handleValidation($sanitizedInput, $userAccountValidation); 
            //must return either user values or false condition

            //check can user be created
            $userCreationPolicy = new UserCreationPolicy();
            //get role of the current user role from session(creator) and role to be created from the validated input

            //current user role
            $sessionService = new SessionService(new SessionManager());
           if(!$sessionService->hasThisKey('user')) {
            throw new Exception('invalid action');
           };


            //same company Id

        $validatedInput['password_hash'] =   password_hash($validatedInput['password'], PASSWORD_BCRYPT);

        //firstName, lastName, email , phoneNumber, isVerified, role, companyId, password_hash
        //hashing password 

            $currentUser = $sessionService->get('user');
            // $currentDetails = [
            //         'id' => 1000,
            //         'firstName' => "Bikash",
            //         'lastName' => "khanal",
            //         'role' => 'superadmin',
            //         'companyId' => 8010
                
            // ];

            if(!$currentUser){
                throw new Exception("No logged in user found");
            }

             $validatedInput['companyId'] = $currentUser['company']['companyId'];
             $validatedInput['isVerified'] = 1;
             $validatedInput['status'] = 'active';


            // $creator = new User();
            // $creator->addUserDetails($currentUser);

            $staff = new User();
            $staff->addUserDetails($validatedInput);

            
           //actual checking of user creation 
            if(!$userCreationPolicy->canCreateUser($currentUser['user'], $staff)){
                throw new Exception('Cannot be created');
            };  
            
            //add user to db
            $db = new UserModel();
            $db->create($staff->getUserDetails());
            return true;
        }
    }

?>