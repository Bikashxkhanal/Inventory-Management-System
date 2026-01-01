<?php 
    namespace App\Domain\Vendor;

    use App\Models\VendorModel;
    use DomainException;
    use Throwable;

    class VendorService{
        public function __construct(private VendorModel $model){}
        public function createVendor(Vendor $vendor){
            try{
               if($this->model->findById($vendor->getId())){
                throw new DomainException('Vendor already exists');
               } ;

                 $this->model->create($vendor);
            }catch(DomainException $e){
                throw new DomainException("cannot create vendor");
            }

        }

        public function deleteVendor(Vendor $vendor){
            try{
                if(!$this->model->findById($vendor->getId())){
                throw new DomainException('No such vendor to delete');
               } ;

               $this->model->delete($vendor->getId());
 
            }catch(DomainException $e){
                throw new DomainException("Error deleting vendor");
            }

        }

        public function updateVendor(Vendor $vendor){
            try{
                if(!$this->model->findById($vendor->getId())){
                    throw new DomainException('cannot find user');
                }
                $this->model->update($vendor);
            }catch(DomainException){
                throw new DomainException('Error updating vendor');
            }

        }
    }