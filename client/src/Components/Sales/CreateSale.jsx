import { DynamicForm, SearchBar, AddCustomer } from '../../Components/index';
import { useNavigate } from 'react-router-dom';
import { createSale } from '../../api/sales.api';
import useMutate from '../../hooks/useMutate';
import { useEffect, useState, useCallback } from 'react';
import { searchProducts, fetchAProductDetails } from '../../api/product.api';
import useFetch from '../../hooks/useFetch';
import OrderLineBar from './OrderLineBar';
import { addSalesItemsToCart, clearAllSalesItems } from '../../Stores/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import ConfirmSalesOverLayUI from './ConfirmSales';

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

  const [productDetails, setProductDetails] = useState({});

  //data that is neeed to be send to backend for forr creating sells 

  const [custumerNumber, setCustomerNumber] = useState(null);

  const [salesData, setSalesData] = useState({
    customer : {}, 
    sales : {}, 
    salesItems : []
  });

  const [message, setMessage] = useState("");


  //  Fetch product details
  const { data: productDetailById } = useFetch(
    ['productsDetails', selectedProduct?.value],
    () => fetchAProductDetails(selectedProduct?.value),
    {
      enabled: !!selectedProduct?.value,
      staleTime: 5 * 60 * 1000,
    }
  );

  useEffect(() => {
    if (productDetailById) {
      setProductDetails({
        product: selectedProduct?.label,
        unitPrice: productDetailById?.sellingPrice,
        stock: productDetailById?.stock,
      });
    }
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
        }} />;
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
      <h2 className="rounded-xl border border-slate-200 bg-white px-4 py-4 text-2xl font-bold text-green-600 shadow-sm sm:px-5 sm:text-3xl">
        Create Sale
      </h2>

      
      {sellPage === 0 && (
        <>
          <div className="flex justify-center">
            <SearchBar
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
            useCase="addSellsItems"
            dynamicValues={productDetails}
            onSubmit={handleSubmit}
          />

          {salesItemsList?.length > 0 && (
            <OrderLineBar
              salesItemsList={salesItemsList}
              handlePageNavigation={handlePageChange}
            />
          )}
        </>
      )}

     
      {renderSellsPages()}
    
    </div>
  );
};

export default CreateSale;