import SearchBar from "../SearchBox/SearchBar";
import {FilterComponent} from '../../Components/index'
import { useState } from "react";
import { setDate } from "date-fns";

const Stock = () => {
    const products = ['apple', 'mango', 'orange']
    const [dateRange, setDateRange] = useState([null, null]);
    const [category, setCategory] = useState('');
    return <div className="flex-1 ml-8 mt-8 mr-20 ">
        <div className="flex flex-row justify-between">
            <p className="text-3xl font-semibold">Inventory Stock</p>
            <div className="flex flex-row justify-start gap-10">
           <SearchBar text="Search list..." />
            </div>
          
        </div>
          <FilterComponent type= 'date-range' dateValue={dateRange} onChange={setDateRange} label = "select date range" />
     
           <FilterComponent type= 'category'  options={products} label="Fruits" catValue={category} onChange={setCategory}   />

    </div>
}

export default Stock;