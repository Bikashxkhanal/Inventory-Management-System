

const TableHeaderCell = ({
    header
}) => {
    const  words =   header?.split(/(?=[A-Z])/).map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    return <th className=" py-2 text-md font-medium border bg-gray-300 border-gray-300">
        {
      words.join(" ")

    }</th>
}

export default TableHeaderCell;