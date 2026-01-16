import TableHeaderCell from "./TableHeaderCell/TableHeaderCell";

const TableHead = ({
    headers = []
}) => {
    return <thead >
        <tr className="w-full ">
        {
            headers?.map((header) => {
                console.log(header);
            return <TableHeaderCell header={header} />

}) }
        </tr>
        </thead>
}


export default TableHead;