import TableBodyCell from "./TableBodyCell/TableBodyCell";

const TableBodyRow = (
    {
        RowData = []
    }
) => {
    return (
        <tr className="w-full odd:bg-white even:bg-gray-200">
            {
                RowData?.map((item) => <TableBodyCell key={item} data={item} />)
            }
        </tr>
    )
}

export default TableBodyRow;