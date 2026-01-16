
import {DataTable, FilterComponent, SearchBar, SegmentedProgressBar} from '../../Components/index'
import { useState } from "react";

const Stock = () => {
    const products = ['apple', 'mango', 'orange']
    const [dateRange, setDateRange] = useState([null, null]);
    const [category, setCategory] = useState('');

    const datas = [{
        name : 'In stock', 
        'color' : 'green',
        'value' : 900,
        'total' : 3000,
    },
{
        name : 'High stock', 
        'color' : 'yellow',
        'value' : 1600,
        'total' : 3000,
    },
{
        name : 'out of stock', 
        'color' : 'red',
        'value' : 500,
        'total' : 3000,
    }]

    const tableData = {
        'headers' : ['product Id', 'product name', 'category', 'Quantity', 'status'],
        'bodyData' : [
            [1001, 'Shoes', 'Fashion', 2000, 'in stock'],
            [1002, 'T-shirt', 'Fashion', 10, 'low stock'],
        ]
    }
    return <div className="flex-1 ml-8 mt-8 mr-20 ">
        <div className="flex flex-row justify-between">
            <p className="text-3xl font-semibold">Inventory Stock</p>
            <div className="flex flex-row justify-start gap-10">
           <SearchBar text="Search list..." />
            </div>
          
        </div>
          <FilterComponent type= 'date-range' dateValue={dateRange} onChange={setDateRange} label = "select date range" />
     
           <FilterComponent type= 'category'  options={products} label="Fruits" catValue={category} onChange={setCategory}   />


           <SegmentedProgressBar type='Stock' datas={datas}  />
           <DataTable tableData={tableData} />

    </div>
}

export default Stock;