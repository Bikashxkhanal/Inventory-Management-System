import { DynamicForm, SearchBar, AddCustomer } from '../../Components/index';
import { createSale } from '../../api/sales.api';
import useMutate from '../../hooks/useMutate';
import { useMemo, useState, useCallback } from 'react';
import { searchProducts, fetchAProductDetails } from '../../api/product.api';
import useFetch from '../../hooks/useFetch';
import OrderLineBar from './OrderLineBar';
import { addSalesItemsToCart, clearAllSalesItems } from '../../Stores/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import ConfirmSalesOverLayUI from './ConfirmSales';
import { CheckCircle2, PackageSearch, ReceiptText, UserRound } from 'lucide-react';
import { formatRs } from '../../helpers/formatMoney';

const saleSteps = [
  { label: 'Items', description: 'Add products', icon: PackageSearch },
  { label: 'Customer', description: 'Customer phone', icon: UserRound },
  { label: 'Review', description: 'Confirm sale', icon: ReceiptText },
];

const SaleProgress = ({ currentStep }) => (
  <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
    <div className="grid grid-cols-3 gap-2">
      {saleSteps.map((step, index) => {
        const Icon = step.icon;
        const isDone = index < currentStep;
        const isActive = index === currentStep;

        return (
          <div key={step.label} className="relative flex min-w-0 items-center gap-3">
            {index !== 0 && (
              <span
                className={`absolute right-[calc(100%-0.5rem)] top-5 hidden h-0.5 w-full md:block ${
                  isDone || isActive ? 'bg-emerald-500' : 'bg-slate-200'
                }`}
              />
            )}
            <div
              className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${
                isDone
                  ? 'border-emerald-500 bg-emerald-500 text-white'
                  : isActive
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-slate-200 bg-slate-50 text-slate-400'
              }`}
            >
              {isDone ? <CheckCircle2 size={18} /> : <Icon size={18} />}
            </div>
            <div className="min-w-0">
              <p
                className={`truncate text-sm font-semibold ${
                  isActive ? 'text-emerald-700' : isDone ? 'text-slate-900' : 'text-slate-500'
                }`}
              >
                {step.label}
              </p>
              <p className="hidden truncate text-xs text-slate-500 sm:block">{step.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

const CreateSale = () => {
  const dispatch = useDispatch();

 
 
  const { user } = useSelector((state) => state.auth);
  const userRole = user?.role ?? 'guest';
  const userId = user?.id;
  

  const salesItemsList = useSelector(
    (state) => state.salesItemsCart.cartSalesItems
  );

  const [selectedProduct, setSelectedProduct] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [sellPage, setSellPage] = useState(0); // 0 = main page, 1 = add customer

  //data that is neeed to be send to backend for forr creating sells 

  const [custumerNumber, setCustomerNumber] = useState(null);

  const [salesData, setSalesData] = useState({
    customer : {}, 
    sales : {}, 
    salesItems : []
  });

  const itemCount = salesItemsList?.length ?? 0;
  const grandTotal = salesItemsList?.reduce(
    (acc, salesItem) => acc + Number(salesItem?.subTotal || 0),
    0
  );


  //  Fetch product details
  const { data: productDetailById } = useFetch(
    ['productsDetails', selectedProduct?.value],
    () => fetchAProductDetails(selectedProduct?.value),
    {
      enabled: !!selectedProduct?.value,
      staleTime: 5 * 60 * 1000,
    }
  );

  const productDetails = useMemo(() => {
    if (productDetailById) {
      return {
        product: selectedProduct?.label,
        unitPrice: productDetailById?.sellingPrice,
        stock: productDetailById?.stock,
      };
    }
    return {};
  }, [productDetailById, selectedProduct]);

 

  //  Add item to cart
  const handleSubmit = (data) => {
    dispatch(addSalesItemsToCart(data));
  };

  //  Search logic
  const { data: searchResults, isFetching } = useFetch(
    ['productSearch', searchQuery],
    () => searchProducts(searchQuery),
    {
      enabled: searchQuery.length >= 2,
      staleTime: 30 * 1000,
      select: (res) =>
        res.map((p) => ({ label: p.name, value: p.id })),
    }
  );

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  const handleSelect = useCallback((item) => {
    if (!item) return setSelectedProduct(null);
    setSelectedProduct(item);
  }, []);

  //  Page change
  const handlePageChange = () => {
    setSellPage((prev) => prev + 1);
  };

  //handle confirmSales page ui closing and confirm actions 
    const onClose = () => {  
        setSellPage((prev) => prev-1);
    }
    
    
    const onConfirm = () => {
      const updatedSalesData = {
          ...salesData, 
          customer : {
            ...salesData.customer,
             phoneNumber : custumerNumber
          }, 
          sales : {
          ...salesData.sales,
            createdBy : userId
          },

        salesItems : { 
            ...salesItemsList
        }
        
      }

      setSalesData(updatedSalesData)
      
      //calling the sales API
      mutation.mutate(updatedSalesData);
    
    }

    //method to create the sales 
     const mutation = useMutate(createSale, {
          onSuccess: () => {
            dispatch(clearAllSalesItems())
            setSellPage((prev) => prev-2)
          },
      });
  

  //  Page renderer
  const renderSellsPages = () => {
    switch (sellPage) {
      case 1:
        return <AddCustomer onClick={(phone) => 
        {
        setCustomerNumber(phone)
          handlePageChange()
        }} onBack={onClose} />;
      case 2 : return <ConfirmSalesOverLayUI customerNumber={custumerNumber} 
                    apiRequest={mutation.isPending}
                  show onClose={onClose} onConfirm={onConfirm} />
      default:
        return null;
    }
  };

  // Role protection
  if (userRole !== 'salesperson') {
    return <h2>You do not have permission to create sales.</h2>;
  }
   
    
  return (
    <div className="flex w-full flex-col gap-5">
      <div className="rounded-lg border border-slate-200 bg-white px-4 py-4 shadow-sm sm:px-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-emerald-600">Sales counter</p>
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Create Sale</h2>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm sm:flex">
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2">
              <p className="text-xs text-slate-500">Items</p>
              <p className="font-semibold text-slate-900">{itemCount}</p>
            </div>
            <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-2">
              <p className="text-xs text-emerald-700">Total</p>
              <p className="font-semibold text-emerald-800">{formatRs(grandTotal)}</p>
            </div>
          </div>
        </div>
      </div>

      <SaleProgress currentStep={Math.min(sellPage, 2)} />

      
      {sellPage === 0 && (
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-4 flex flex-col gap-1">
              <h3 className="text-lg font-semibold text-slate-900">Add sale items</h3>
              <p className="text-sm text-slate-500">Search a product, review its stock and price, then add the quantity.</p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <label className="mb-2 block text-sm font-medium text-slate-700">Product</label>
              <SearchBar
                className="w-full"
                placeholder="Search by product name"
                onSearch={handleSearch}
                onSelect={handleSelect}
                debounceMs={400}
                minChars={1}
                suggestions={searchResults || []}
                isLoading={isFetching}
              />
            </div>

            <DynamicForm
              title="Item details"
              submitLabel="Add item"
              useCase="addSellsItems"
              dynamicValues={productDetails}
              onSubmit={handleSubmit}
            />
          </div>

          <div>
            <OrderLineBar
              salesItemsList={salesItemsList}
              handlePageNavigation={handlePageChange}
            />
          </div>
        </div>
      )}

     
      {renderSellsPages()}
    
    </div>
  );
};

export default CreateSale;
