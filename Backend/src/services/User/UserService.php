<?php
    namespace App\Services\User;
    use App\Domain\Entities\User;
    use App\Domain\Sanitization\UserAccountCreationSanitization;
    use App\Domain\Session\SessionManager;
    use App\Models\UserModel;
    use App\Services\SanitizationService;
    use App\Services\SessionService;
    use App\Services\ValidationService;
    use App\Domain\Policies\UserCreationPolicy;
    use Exception;

    class UserService{
        private $sanitizationService;
        private $validationService;
        

        public function __construct(){
            $this->sanitizationService = new SanitizationService();
            $this->validationService = new ValidationService();
              
        }

        public function userAccountCreationService($input){
            //sanitization 
            $userAccountsanitization = new UserAccountCreationSanitization();
             $sanitizedInput =  $this->sanitizationService->handleSanitization($input, $userAccountsanitization);

            //validation
            $userAccountValidation = new UserAccountCreationValidation();
            $validatedInput = $this->validationService->handleValidation($sanitizedInput, $userAccountValidation); //must return either user values or false condition

            //check can user be created
            $userCreationPolicy = new UserCreationPolicy();
            //get role of the current user role from session(creator) and role to be created from the validated input

            //current user role
            $sessionService = new SessionService(new SessionManager());
           if(!$sessionService->hasThisKey('user')) {
            throw new Exception('invalid action');
           };

            $currentUser = $sessionService->get('user');
           //actual checking of user creation 
            if(!$userCreationPolicy->canCreateUser($currentUser['identity']['user_role'], $validatedInput['role'])){
                throw new Exception('Cannot be created');
            };
            
            //if so create user 
            $user = new User();
            $user->addUserDetails($validatedInput);

            //add user to db
            $db = new UserModel();
            $db->create($user->getUserDetails());

            //create a log

            $userCreationLogger = new UserCreationLogger();
            $handleLogging = new LoggingService();
            $handleLogging->createNewLog($userCreationLogger);
        }
    }

?>