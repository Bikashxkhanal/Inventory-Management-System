// CreateSale.jsx
import { DynamicForm } from './../index';
import { useNavigate } from 'react-router-dom';
import { createSale } from '../../api/sales.api';
import useMutate from '../../hooks/useMutate';
import { useSelector } from 'react-redux';

const CreateSale = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const userRole = user?.role ?? 'guest';

  // Only salesperson can access
  if (userRole !== 'salesperson') {
    return <h2>You do not have permission to create sales.</h2>;
  }

  const mutation = useMutate(createSale, {
    onSuccess: () => navigate('/web/sales'),
  });

  const handleSubmission = (data) => {
    mutation.mutate(data);
  };

  return (
    <DynamicForm
      useCase="createSale"
      status={mutation.isPending}
      title="Create Sale"
      onSubmit={handleSubmission}
    />
  );
};

export default CreateSale;
