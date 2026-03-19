
const TableBodyCell = ({
    data
}) => {
    
    return <td className="py-2 text-center text-sm bg-white"> {data ?? 'N/A'}</td>
}

export default TableBodyCell;