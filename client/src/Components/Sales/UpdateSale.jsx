// UpdateSale.jsx
import { DynamicForm } from './../index';
import useMutate from '../../hooks/useMutate';
import { updateSale } from '../../api/sales.api.js';
import { useSelector } from 'react-redux';

const UpdateSale = ({ sale, onClose }) => {
  const { user } = useSelector((state) => state.auth);
  const userRole = user?.role ?? 'guest';

  if (userRole !== 'storemanager') return null;

  const mutation = useMutate(updateSale, {
    onSuccess: () => onClose(),
  });

  const handleSubmit = (data) => {
    mutation.mutate({ ...data, id: sale.id });
  };

  return (
    <DynamicForm
      useCase="updateSale"
      status={mutation.isPending}
      title={`Update Sale #${sale.id}`}
      onSubmit={handleSubmit}
      initialValues={sale} // prefill form
    />
  );
};

export default UpdateSale;
