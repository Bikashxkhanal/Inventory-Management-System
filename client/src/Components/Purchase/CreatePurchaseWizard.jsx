import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  createPurchase,
  addPurchaseItems,
  finalizePurchase,
  fetchVendors,
} from '../../api/purchase.api';
import { fetchCategories } from '../../api/category.api';
import { fetchProductsByCategory } from '../../api/product.api';

const STEP_LABELS = ['Vendor & date', 'Line items'];

const selectClass =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-slate-900 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20';

const inputClass =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-slate-900 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20';

function StepIndicator({ step }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {STEP_LABELS.map((label, index) => {
          const num = index + 1;
          const active = step === num;
          const done = step > num;
          return (
            <div key={label} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all duration-500 ${
                    done
                      ? 'bg-emerald-600 text-white'
                      : active
                        ? 'bg-slate-800 text-white ring-4 ring-emerald-100'
                        : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {done ? '✓' : num}
                </div>
                <span
                  className={`hidden text-xs font-medium sm:block ${
                    active ? 'text-slate-900' : 'text-slate-500'
                  }`}
                >
                  {label}
                </span>
              </div>
              {index < STEP_LABELS.length - 1 && (
                <div
                  className={`mx-2 h-1 flex-1 rounded-full transition-all duration-500 ${
                    done ? 'bg-emerald-500' : 'bg-slate-200'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-center text-sm text-slate-500 sm:hidden">
        Step {step} of 2 — {STEP_LABELS[step - 1]}
      </p>
    </div>
  );
}

function OutcomePanel({ type, title, message, onClose, onViewList }) {
  const isSuccess = type === 'success';

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center sm:p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
        role="presentation"
      />
      <div
        className={`purchase-slide-in-up relative w-full max-w-md rounded-t-2xl p-6 shadow-2xl sm:rounded-2xl ${
          isSuccess ? 'bg-emerald-50' : 'bg-red-50'
        }`}
        role="alertdialog"
      >
        <div
          className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full text-2xl ${
            isSuccess ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
          }`}
        >
          {isSuccess ? '✓' : '✕'}
        </div>
        <h3
          className={`text-center text-xl font-bold ${
            isSuccess ? 'text-emerald-900' : 'text-red-900'
          }`}
        >
          {title}
        </h3>
        <p
          className={`mt-2 text-center text-sm leading-relaxed ${
            isSuccess ? 'text-emerald-800' : 'text-red-800'
          }`}
        >
          {message}
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          {isSuccess && (
            <button
              type="button"
              onClick={onViewList}
              className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              View purchases
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold ${
              isSuccess
                ? 'border border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            {isSuccess ? 'Close' : 'Try again'}
          </button>
        </div>
      </div>
    </div>
  );
}

function SlideAlert({ type, message, onDismiss }) {
  if (!message) return null;
  const isError = type === 'error';

  return (
    <div
      className={`purchase-slide-in-right mb-4 flex items-start justify-between gap-3 rounded-xl border px-4 py-3 ${
        isError
          ? 'border-red-200 bg-red-50 text-red-800'
          : 'border-emerald-200 bg-emerald-50 text-emerald-800'
      }`}
      role="alert"
    >
      <p className="text-sm font-medium">{message}</p>
      <button
        type="button"
        onClick={onDismiss}
        className="shrink-0 text-lg leading-none opacity-60 hover:opacity-100"
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
}

const CreatePurchaseWizard = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [slideReady, setSlideReady] = useState(true);
  const [purchaseId, setPurchaseId] = useState(null);
  const [vendorId, setVendorId] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });
  const [vendorOptions, setVendorOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [lineItems, setLineItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [outcome, setOutcome] = useState(null);

  useEffect(() => {
    const loadVendors = async () => {
      try {
        const vendors = await fetchVendors();
        const list = Array.isArray(vendors) ? vendors : [];
        setVendorOptions(list);
      } catch {
        setAlert({ type: 'error', message: 'Failed to load vendors' });
      }
    };
    loadVendors();
  }, []);

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const categoryOptions = Array.isArray(categories)
    ? categories
    : categories?.data ?? [];

  const { data: products, isFetching: productsLoading } = useQuery({
    queryKey: ['products', selectedCategory],
    queryFn: () => fetchProductsByCategory(selectedCategory),
    enabled: !!selectedCategory,
  });

  const productList = Array.isArray(products) ? products : products?.data ?? [];

  const lineSubtotal = useMemo(() => {
    const qty = parseFloat(quantity) || 0;
    const price = parseFloat(unitPrice) || 0;
    return qty > 0 && price > 0 ? qty * price : 0;
  }, [quantity, unitPrice]);

  const grandTotal = useMemo(
    () => lineItems.reduce((sum, item) => sum + item.subtotal, 0),
    [lineItems]
  );

  const goToStep = (target) => {
    setSlideReady(false);
    setTimeout(() => {
      setStep(target);
      setSlideReady(true);
    }, 50);
  };

  const handleStep1Next = async (e) => {
    e.preventDefault();
    setAlert(null);
    if (!vendorId || !purchaseDate) {
      setAlert({ type: 'error', message: 'Please select a vendor and purchase date.' });
      return;
    }
    setLoading(true);
    try {
      const result = await createPurchase({
        vendor: Number(vendorId),
        date: purchaseDate,
      });
      const id = result?.id;
      if (!id) {
        throw new Error('Purchase could not be created');
      }
      const vendor = vendorOptions.find((v) => String(v.id) === String(vendorId));
      setVendorName(vendor?.name ?? 'Vendor');
      setPurchaseId(id);
      goToStep(2);
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.message || 'Failed to create purchase header',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddLine = async (e) => {
    e.preventDefault();
    setAlert(null);
    const qty = parseInt(quantity, 10);
    const price = parseFloat(unitPrice);
    if (!selectedProduct || !qty || qty < 1 || !price || price <= 0) {
      setAlert({
        type: 'error',
        message: 'Select a product and enter valid quantity and unit price.',
      });
      return;
    }
    const product = productList.find((p) => String(p.id) === String(selectedProduct));
    setLoading(true);
    try {
      await addPurchaseItems({
        purchase_id: purchaseId,
        product: Number(selectedProduct),
        quantity: qty,
        price,
      });
      setLineItems((prev) => [
        ...prev,
        {
          id: `${selectedProduct}-${Date.now()}`,
          product: product?.name ?? selectedProduct,
          quantity: qty,
          unitPrice: price,
          subtotal: qty * price,
        },
      ]);
      setQuantity('');
      setUnitPrice('');
      setSelectedProduct('');
      setAlert({ type: 'success', message: 'Line item added.' });
      setTimeout(() => setAlert(null), 2500);
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Failed to add line item' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setAlert(null);
    if (lineItems.length === 0) {
      setAlert({ type: 'error', message: 'Add at least one line item before submitting.' });
      return;
    }
    setLoading(true);
    try {
      const result = await finalizePurchase(purchaseId);
      const status = result?.status ?? 'draft';
      setOutcome({
        type: 'success',
        title: status === 'completed' ? 'Purchase completed' : 'Submitted for review',
        message:
          status === 'completed'
            ? `Purchase #${purchaseId} for ${vendorName} was approved and stock has been updated. Total: ${grandTotal.toFixed(2)}`
            : `Purchase #${purchaseId} was saved as a draft. An admin will verify it before stock is updated. Total: ${grandTotal.toFixed(2)}`,
      });
    } catch (err) {
      setOutcome({
        type: 'error',
        title: 'Submission failed',
        message: err.message || 'Could not finalize the purchase. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOutcomeClose = () => {
    if (outcome?.type === 'error') {
      setOutcome(null);
      return;
    }
    setOutcome(null);
  };

  const slideOffset = step === 1 ? '0%' : '-50%';

  return (
    <div className="mx-auto max-w-4xl py-8 pb-16">
      <div className="mb-2">
        <button
          type="button"
          onClick={() => navigate('/web/purchase')}
          className="text-sm font-medium text-slate-500 hover:text-slate-800"
        >
          ← Back to purchases
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <h1 className="text-2xl font-bold text-slate-900">Create purchase</h1>
        <p className="mt-1 text-sm text-slate-500">
          Add vendor details, then line items. Total is calculated automatically.
        </p>

        <StepIndicator step={step} />

        <SlideAlert
          type={alert?.type}
          message={alert?.message}
          onDismiss={() => setAlert(null)}
        />

        <div className="relative overflow-hidden">
          <div
            className={`flex w-[200%] transition-transform duration-500 ease-in-out ${
              slideReady ? '' : 'opacity-90'
            }`}
            style={{ transform: `translateX(${slideOffset})` }}
          >
            {/* Step 1 */}
            <div className="w-1/2 shrink-0 pr-0 md:pr-6">
              <form onSubmit={handleStep1Next} className="space-y-5">
                <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-5">
                  <h2 className="mb-4 text-lg font-semibold text-slate-800">
                    Purchase details
                  </h2>
                  <div className="space-y-4">
                    <label className="block">
                      <span className="mb-1.5 block text-sm font-medium text-slate-700">
                        Vendor <span className="text-red-500">*</span>
                      </span>
                      <select
                        className={selectClass}
                        value={vendorId}
                        onChange={(e) => setVendorId(e.target.value)}
                        required
                      >
                        <option value="">Choose a vendor</option>
                        {vendorOptions.map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-sm font-medium text-slate-700">
                        Purchase date <span className="text-red-500">*</span>
                      </span>
                      <input
                        type="date"
                        className={inputClass}
                        value={purchaseDate}
                        onChange={(e) => setPurchaseDate(e.target.value)}
                        required
                      />
                    </label>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-slate-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-900 disabled:opacity-60 sm:w-auto sm:min-w-[160px]"
                >
                  {loading ? 'Creating…' : 'Continue to line items →'}
                </button>
              </form>
            </div>

            {/* Step 2 */}
            <div className="w-1/2 shrink-0 pl-0 md:pl-6">
              <div className="mb-4 rounded-lg border border-emerald-100 bg-emerald-50/60 px-4 py-3 text-sm text-emerald-900">
                <span className="font-semibold">#{purchaseId}</span>
                {' · '}
                {vendorName}
                {' · '}
                {purchaseDate}
              </div>

              <form onSubmit={handleAddLine} className="space-y-4">
                <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-5">
                  <h2 className="mb-4 text-lg font-semibold text-slate-800">Add line item</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block sm:col-span-2">
                      <span className="mb-1.5 block text-sm font-medium text-slate-700">
                        Category
                      </span>
                      <select
                        className={selectClass}
                        value={selectedCategory}
                        onChange={(e) => {
                          setSelectedCategory(e.target.value);
                          setSelectedProduct('');
                        }}
                      >
                        <option value="">Select category</option>
                        {categoryOptions.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block sm:col-span-2">
                      <span className="mb-1.5 block text-sm font-medium text-slate-700">
                        Product
                      </span>
                      <select
                        className={selectClass}
                        value={selectedProduct}
                        onChange={(e) => setSelectedProduct(e.target.value)}
                        disabled={!selectedCategory || productsLoading}
                      >
                        <option value="">
                          {productsLoading ? 'Loading…' : 'Select product'}
                        </option>
                        {productList.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-sm font-medium text-slate-700">
                        Quantity
                      </span>
                      <input
                        type="number"
                        min={1}
                        className={inputClass}
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-sm font-medium text-slate-700">
                        Unit price
                      </span>
                      <input
                        type="number"
                        min={0}
                        step="0.01"
                        className={inputClass}
                        value={unitPrice}
                        onChange={(e) => setUnitPrice(e.target.value)}
                      />
                    </label>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 rounded-lg bg-white p-3 ring-1 ring-slate-200">
                    <div>
                      <p className="text-xs text-slate-500">Line subtotal</p>
                      <p className="text-lg font-bold text-slate-900">
                        {lineSubtotal.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Grand total</p>
                      <p className="text-lg font-bold text-emerald-700">
                        {grandTotal.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-4 w-full rounded-lg border-2 border-dashed border-emerald-300 bg-emerald-50 py-2.5 text-sm font-semibold text-emerald-800 transition hover:border-emerald-400 hover:bg-emerald-100 disabled:opacity-50"
                  >
                    {loading ? 'Adding…' : '+ Add to purchase'}
                  </button>
                </div>
              </form>

              {lineItems.length > 0 && (
                <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-800 text-left text-white">
                      <tr>
                        <th className="px-3 py-2 font-medium">Product</th>
                        <th className="px-3 py-2 font-medium">Qty</th>
                        <th className="px-3 py-2 font-medium text-right">Price</th>
                        <th className="px-3 py-2 font-medium text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {lineItems.map((item) => (
                        <tr key={item.id} className="bg-white">
                          <td className="px-3 py-2 font-medium text-slate-800">
                            {item.product}
                          </td>
                          <td className="px-3 py-2 text-slate-600">{item.quantity}</td>
                          <td className="px-3 py-2 text-right text-slate-600">
                            {item.unitPrice.toFixed(2)}
                          </td>
                          <td className="px-3 py-2 text-right font-medium text-slate-900">
                            {item.subtotal.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => goToStep(1)}
                  disabled={loading}
                  className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading || lineItems.length === 0}
                  className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 sm:flex-none sm:min-w-[200px]"
                >
                  {loading ? 'Submitting…' : 'Submit purchase'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {outcome && (
        <OutcomePanel
          type={outcome.type}
          title={outcome.title}
          message={outcome.message}
          onClose={handleOutcomeClose}
          onViewList={() => navigate('/web/purchase')}
        />
      )}
    </div>
  );
};

export default CreatePurchaseWizard;
