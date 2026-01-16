import {DataTable} from './../index';

const StockInformationTable = () => {
      const tableData = {
        'headers' : ['product Id', 'product name', 'category', 'Quantity', 'status'],
        'bodyData' : [
            [1001, 'Shoes', 'Fashion', 2000, 'in stock'],
            [1002, 'T-shirt', 'Fashion', 10, 'low stock'],
        ]
    }
    return  <DataTable tableData={tableData} />

}

export default StockInformationTable;