import {Button, FilterComponent, SearchBar, NewButton} from './../index'
import { useState } from 'react';
import { searchImg } from '../../assets/Imagesender';

const StockFilterBar = () => {

         const Categories = ['Fashion', 'Mens wear', 'Shoes']
         const products  = ['T-shirt', 'SweetShirt', 'Jeans paint', 'Nike Shoes', 'Air Jorden']
            const [dateRange, setDateRange] = useState([null, null]);
            const [category, setCategory] = useState('');
            const [product, setProduct] = useState('');
    return <div className='max-w-full flex flex-col md:flex-row gap-2 mt-2 md:mx-10 my-4 md:justify-between md:items-center'>
         <SearchBar text="Search Stock by product " />
         <FilterComponent type= 'date-range' dateValue={dateRange} onChange={setDateRange} label = "date range" className=' '  />
       <NewButton children="Search" size='md'  />
       
    </div>
}


export default StockFilterBar;