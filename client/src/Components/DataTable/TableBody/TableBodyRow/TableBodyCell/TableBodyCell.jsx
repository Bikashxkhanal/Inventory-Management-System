
const TableBodyCell = ({
    data
}) => {
    console.log(data);
    
    return <td className="py-2 text-center text-sm bg-white"> {data}</td>
}

export default TableBodyCell;