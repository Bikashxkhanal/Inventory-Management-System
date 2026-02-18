
import {DynamicForm} from '../../Components/index'
import { useParams, useNavigate } from 'react-router-dom'
import { addPurchaseItems, fetchProducts } from '../../api/purchase.api'
import useMutate from '../../hooks/useMutate'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import  {fetchCategories} from '../../api/category.api'
import { fetchProductsByCategory } from '../../api/product.api'

const AddPurchaseItems = () => {

  const { purchaseId } = useParams();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState(null);

  // 1️⃣ Fetch categories on load
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });
  console.log(categories?.data);
  

  const categoryOptions = categories?.data?.map(cat => ({
    label: cat.name,
    value: cat.id
  })) || [];

  // 2️⃣ Fetch products when category changes
  const { data: products } = useQuery({
    queryKey: ['products', selectedCategory],
    queryFn: () => fetchProductsByCategory(selectedCategory),
    enabled: !!selectedCategory // only run if category selected
  });

  const productOptions = products?.map(prod => ({
    label: prod.name,
    value: prod.id
  })) || [];

  const mutation = useMutate(addPurchaseItems, {
    onSuccess: () => navigate('/web/purchase')
  });

  const handleSubmit = (data) => {
    mutation.mutate({
      ...data,
      purchase_id: purchaseId
    });
  };

  return (
    <DynamicForm
      useCase="addPurchaseItems"
      title="Add Purchase Items"
      status={mutation.isPending}
      dynamicOptions={{
        category: categoryOptions,
        product: productOptions
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

export default AddPurchaseItems;
