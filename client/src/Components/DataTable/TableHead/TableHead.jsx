import TableHeaderCell from "./TableHeaderCell/TableHeaderCell";

const TableHead = ({
    headers = []
}) => {
    return <thead >
        <tr className="w-full text-white bg-blue-600 border-blue-600 rounded-xl">
        {
            headers?.map((header, idx) => {
                console.log(header);
            return <TableHeaderCell key={idx} header={header} />

}) }
        </tr>
        </thead>
}


export default TableHead;