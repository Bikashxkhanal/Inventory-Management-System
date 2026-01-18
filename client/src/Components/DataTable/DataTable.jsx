import { data } from 'react-router-dom';
import {TableBody, TableHead} from './../index'

const DataTable = ({
    tableData = [] // expected value in tableData :: {headers : [], bodyData : []}


}) => {
  const keys =  tableData.length ? Object.keys(tableData[0]) : []
  console.table(tableData)

  return (
    <table className='w-full'>
      <TableHead headers={keys} />
      <TableBody bodyData={tableData} />
      
    </table>
  );
};

export default DataTable;
