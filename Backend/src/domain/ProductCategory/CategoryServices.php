<?php 
    namespace App\Domain\Category;

    use DomainException;
    use DOMException;
    use RuntimeException;
    class CategoryServices{
        public function __construct(private CategoryModel $model){}
        public function createCategory(array $catDetails){
            try{
                if($this->model->isCategoryExistByName($catDetails['category_name'])){
                    throw new DomainException('category already exist');
                }
                $this->model->create($catDetails);
            }catch(DomainException $e){
                throw $e;
            }catch(RuntimeException $e){
                throw $e;
            }

        }
        public function findCategoryById(int $id){
            try{
                if(!$this->model->isCategoryExistById($id)){
                    throw new DomainException('category doesnot exist');
                }
               $category =  $this->model->findById($id);
            }catch(DomainException $e){
                throw $e;
            }catch(RuntimeException $e){
                throw $e;
            }
            return $category;
        }

    }