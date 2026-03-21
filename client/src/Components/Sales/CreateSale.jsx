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
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const userRole = user?.role ?? 'guest';
  

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
    sales : {
    }, 
    salesItems : []
  });




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
    console.log(user);
    
    const onConfirm = () => {
      setSalesData((prev) => ({
          ...prev, 
          customer : {
            ...prev.customer,
             phoneNumber : custumerNumber
          }, 
          sales : {
            createdBy : user?.id
          },

        salesItems : { 
            ...salesItemsList
        }
        
      }))

      console.log(salesData);
      
      //calling the sales API
      mutation.mutate(salesData);
    
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
      case 2 : return <ConfirmSalesOverLayUI customerNumber={custumerNumber} show onClose={onClose} onConfirm={onConfirm} />
      default:
        return null;
    }
  };

  // Role protection
  if (userRole !== 'salesperson') {
    return <h2>You do not have permission to create sales.</h2>;
  }
    console.log(salesData);
    
  return (
    <div className="flex flex-col gap-5">
      <h2 className="pt-8 pb-2 px-5 text-3xl font-bold text-green-600 border-b bg-white shadow-sm">
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