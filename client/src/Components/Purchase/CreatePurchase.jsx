import { useEffect, useState } from 'react';
import DynamicForm from '../AdvanceForm/DynamicForm';
import { useNavigate } from 'react-router-dom';
import { createPurchase, fetchVendors } from '../../api/purchase.api';
import useMutate from '../../hooks/useMutate';

const CreatePurchase = () => {
  const navigate = useNavigate();
  const [vendorOptions, setVendorOptions] = useState([]);

  

  // Mutation for creating purchase
  const mutation = useMutate(createPurchase, {
    onSuccess: (response) => {
      console.log(response);
      
      const purchaseId = response.id;
      navigate(`/web/purchase/${purchaseId}/items`);
    }
  });

  // Fetch vendors on page load
  useEffect(() => {
    const loadVendors = async () => {
      try {
        const vendors = await fetchVendors();
        console.log("vedors", vendors);
        
        // Map to format for DynamicForm select: {value, label}
        const options = vendors.map(v => ({ value: v.id, label: v.name }));
        setVendorOptions(options);
      } catch (err) {
        console.error('Failed to fetch vendors', err);
      }
    };

    loadVendors();
  }, []);

  // Submission handler
  const handleSubmission = (data) => {
    console.log(data);
    mutation.mutate(data);
  };

  // Pass the options to DynamicForm via `formConfig` or props
  return (
    <DynamicForm
      useCase="createPurchase"
      status={mutation.isPending}
      title="Create Purchase"
      onSubmit={handleSubmission}
      dynamicOptions={{ vendor: vendorOptions }} // new prop
    />
  );
};

export default CreatePurchase;
