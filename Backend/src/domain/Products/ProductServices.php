<?php 
namespace App\Domain\Products;
use App\Domain\Users\Entities\User;
use App\Models\ProductModel;
use DomainException;


class ProductServices{
    public function __construct(private ProductsPolicy $policy, private User $user, private ProductModel $model){}
    public function activateProduct(Product $product){
        if(!$this->model->getById($product->getId())){
            throw new DomainException('cannot find product');
        }
       
           $this->model->updateProduct($product);
        
    }
    public function deleteProduct(Product $product){
         if(!$this->model->getById($product->getId())){
            throw new DomainException('cannot find product');
        }
        
        $this->model->updateProduct($product);
    }
    public function createProduct(Product $product){
         if(!$this->model->getById($product->getId())){
            throw new DomainException('cannot find product');
        }
        
        $this->model->addProduct($product);
    }
    public function updateProduct(Product $product){
         if(!$this->model->getById($product->getId())){
            throw new DomainException('cannot find product');
        }
       
        $this->model->updateProduct($product);

    }

}