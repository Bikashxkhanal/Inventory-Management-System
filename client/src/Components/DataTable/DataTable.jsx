import { data } from 'react-router-dom';
import {TableBody, TableHead} from './../index'

const DataTable = ({
    tableData = [],
    columnKeys = null,
}) => {
  const keys =
    columnKeys ??
    (tableData.length ? Object.keys(tableData[0]) : []);
 

  return (
    <table className='w-full'>
      <TableHead headers={keys} />
      <TableBody bodyData={tableData} />
      
    </table>
  );
};

export default DataTable;
