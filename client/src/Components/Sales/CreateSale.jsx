import { DynamicForm } from '../../Components/index'
import { useNavigate } from 'react-router-dom'
import { createSale } from '../../api/sales.api'
import useMutate from '../../hooks/useMutate'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { fetchCategories } from '../../api/category.api'
import { fetchProductsByCategory } from '../../api/product.api'
import { useSelector } from 'react-redux'

const CreateSale = () => {

  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const userRole = user?.role ?? 'guest';

  const [selectedCategory, setSelectedCategory] = useState(null);

  // 🔒 Role Protection
  if (userRole !== 'salesperson') {
    return <h2>You do not have permission to create sales.</h2>;
  }

  // 1️⃣ Fetch Categories
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

  return (
    <DynamicForm
      useCase="addSellsItems"
      title="Create Sale"
      status={mutation.isPending}
      dynamicOptions={{
        category: categoryOptions,
        product: productOptions
      }}
      loadingStates={{
        productsLoading
      }}
      onFieldChange={(fieldName, value) => {
        if (fieldName === 'category') {
          setSelectedCategory(value);
        }
      }}
      onSubmit={handleSubmit}
    />
  );
};

export default CreateSale;
