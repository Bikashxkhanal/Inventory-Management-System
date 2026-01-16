import {Button, FilterComponent, SearchBar} from './../index'
import { useState } from 'react';

const StockFilterBar = () => {

         const Categories = ['Fashion', 'Mens wear', 'Shoes']
         const products  = ['T-shirt', 'SweetShirt', 'Jeans paint', 'Nike Shoes', 'Air Jorden']
            const [dateRange, setDateRange] = useState([null, null]);
            const [category, setCategory] = useState('');
            const [product, setProduct] = useState('');
    return <div className='max-w-full flex flex-col md:flex-row gap-2 md:gap-0 mt-2 flex-1 grow my-4 '>
         <SearchBar text="Search Stock by product " />
        <div className='flex flex-row justify-start items-center gap-2'>
            <p className='text-[16px] font-medium text-center '>Filter By</p>
         <FilterComponent type= 'date-range' dateValue={dateRange} onChange={setDateRange} label = "date range" className=' '  />
        <FilterComponent type= 'category'  options={Categories} label="category" catValue={category} onChange={setCategory}  className=''  />
        <FilterComponent type= 'category'  options={products} label="product" catValue={product} onChange={setProduct}  className=''  />
        {/* <Button btnName="Filter" className=''  /> */}
        </div>
       
    </div>
}


export default StockFilterBar;