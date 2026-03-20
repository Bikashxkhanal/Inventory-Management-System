import { DynamicForm, FilterComponent, SearchBar } from '../../Components/index'
import { useNavigate } from 'react-router-dom'
import { createSale } from '../../api/sales.api'
import useMutate from '../../hooks/useMutate'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { fetchCategories } from '../../api/category.api'
import { fetchProductsByCategory, searchProducts } from '../../api/product.api'
import { useSelector } from 'react-redux'
import useFetch from '../../hooks/useFetch'
import { useCallback } from 'react'

const CreateSale = () => {

  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const userRole = user?.role ?? 'guest';

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProductForCat, setSelectedProductForCat] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');


  // 1 Fetch Categories
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000
  });

  
  const categoryOptions =
    categories?.data?.map(cat => ({
      label: cat.name,
      value: cat.id
    })) || [];

 
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['products', selectedCategory],
    queryFn: () => fetchProductsByCategory(selectedCategory),
    enabled: !!selectedCategory,
    staleTime: 5 * 60 * 1000
  });

  

  const productOptions =
    products?.map(prod => ({
      label: prod.name,
      value: prod.id
    })) || [];

  
  const mutation = useMutate(createSale, {
    onSuccess: () => navigate('/web/sales')
  });

  const handleSubmit = (data) => {
    mutation.mutate(data);
  };

  //searching logic
 
  const { data: searchResults, isFetching } = useFetch(
    ['productSearch', searchQuery],          
    () => searchProducts(searchQuery),
    {
      enabled: searchQuery.length >= 2,    
      staleTime: 30 * 1000,                 
      select: (res) =>                      
        res.map(p => ({ label: p.name, value: p.id })),
    }
  );

   const handleSearch = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  const handleSelect = useCallback((item) => {
    if (!item) {
      setSelectedProduct(null);
      return;
    }
    setSelectedProduct(item);
  }, []);



  //  Role Protection
  if (userRole !== 'salesperson') {
    return <h2>You do not have permission to create sales.</h2>;
  }

  return (
    <div className='flex flex-col justify-start gap-5'>
      <h2 className='pt-8 pb-2 px-5 text-3xl font-bold text-green-600 border-b border-white bg-white shadow-sm '>Create Sale</h2>
      <div className='flex flex-row justify-center gap-5'>

         < SearchBar
          placeholder='Search by product name' 
           onSearch={handleSearch}     
          onSelect={handleSelect}
          debounceMs={400}
          minChars={2}
          suggestions={searchResults || []}   
          isLoading={isFetching} 
          

          />

         <FilterComponent type='category' 
         options={categoryOptions} 
         label="Select a category"
         catValue={selectedCategory}
         onChange={(value) => setSelectedCategory(value)}
         
         />
         <FilterComponent type='category' 
         options={productOptions}
         onChange={(value) => setSelectedProductForCat(value)}
         catValue={selectedProductForCat}
          label="Select a product" />
      </div>
   
    <DynamicForm
      useCase="addSellsItems"
      status={mutation.isPending}

      // loadingStates={{
      //   productsLoading
      // }}
      // onFieldChange={(fieldName, value) => {
      //   if (fieldName === 'category') {
      //     setSelectedCategory(value);
      //   }
      // }}
      onSubmit={handleSubmit}
    />
    </div>
  );
};

export default CreateSale;
