import TableBodyRow from "./TableBodyRow/TableBodyRow";

const TableBody = ({
   bodyData = [] //bodyData is an ARRAY of array i.e. bodyData = [[], [], []]
}) => {
  return (
    <tbody className="w-full">
        {
           bodyData?.map((item, idx ) => <TableBodyRow key={idx} RowData={item} />) 

        }
     
    </tbody>
  );
};

export default TableBody;
