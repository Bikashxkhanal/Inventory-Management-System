import TableBodyRow from "./TableBodyRow/TableBodyRow";

const TableBody = ({
  bodyData = [], //bodyData is an array of object of the details
}) => {
  const keys = bodyData.length ? Object.keys(bodyData[0]) : [];
  const rowData = bodyData?.map(obj => keys.map(k => obj[k]));
  console.table(rowData);
  
  return (
    <tbody className="w-full">
      {rowData?.map((item, idx) => (
        <TableBodyRow key={idx} RowData={item} />
      ))}
    </tbody>
  );
};

export default TableBody;
