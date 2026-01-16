import TableBodyCell from "./TableBodyCell/TableBodyCell";

const TableBodyRow = (
    {
        RowData = []
    }
) => {
    return (
        <tr className="w-full">
            {
                RowData?.map((item) => <TableBodyCell key={item} data={item} />)
            }
        </tr>
    )
}

export default TableBodyRow;