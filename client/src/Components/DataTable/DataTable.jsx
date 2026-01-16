import { data } from 'react-router-dom';
import {TableBody, TableHead} from './../index'

const DataTable = ({
    tableData = {} // expected value in tableData :: {headers : [], bodyData : []}
}) => {
  return (
    <table className='w-full'>
        { //converting into entries , to render the datas using map functions
            Object.entries(tableData).map(([key, datas], idx) => {
                console.log(key , datas);
       
          return key=== 'headers' ?  <TableHead className='py-3 bg-gray-300' key={key} headers={datas} />:<TableBody key={key} bodyData={datas} /> 
                
            
        })
    }
      
      
    </table>
  );
};

export default DataTable;
