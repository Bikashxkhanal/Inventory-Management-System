
const TableBodyCell = ({
    data
}) => {
    
    return <td className="py-2 text-center text-sm "> {data ?? 'N/A'}</td>
}

export default TableBodyCell;