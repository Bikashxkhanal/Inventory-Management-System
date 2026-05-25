import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { updatePurchase, fetchVendors, fetchPurchaseById } from '../../api/purchase.api';
import { InputBox, NewButton } from '../index';

const EditPurchase = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vendorId, setVendorId] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [vendorOptions, setVendorOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [vendors, purchase] = await Promise.all([
          fetchVendors(),
          fetchPurchaseById(id),
        ]);
        const list = Array.isArray(vendors) ? vendors : [];
        setVendorOptions(list);
        if (purchase) {
          setVendorId(String(purchase.vendor_id ?? ''));
          const raw = purchase.purchase_date ?? '';
          setPurchaseDate(String(raw).split(' ')[0].split('T')[0]);
        }
      } catch (err) {
        setError(err.message || 'Failed to load purchase');
      }
    };
    load();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await updatePurchase({
        id: Number(id),
        vendor: Number(vendorId),
        date: purchaseDate,
      });
      navigate('/web/purchase');
    } catch (err) {
      setError(err.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-8 flex w-full max-w-md flex-col gap-4">
      <p className="text-2xl font-bold">Edit Purchase #{id}</p>
      {error && <p className="text-red-600">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          <span className="font-medium">Vendor</span>
          <select
            className="rounded border border-gray-300 px-3 py-2"
            value={vendorId}
            onChange={(e) => setVendorId(e.target.value)}
            required
          >
            <option value="">Select vendor</option>
            {vendorOptions.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-medium">Purchase date</span>
          <InputBox
            type="date"
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)}
            required
          />
        </label>
        <NewButton type="submit" children="Save" loading={loading} className="bg-green-600" />
      </form>
    </div>
  );
};

export default EditPurchase;
