import TableHeaderCell from "./TableHeaderCell/TableHeaderCell";

const TableHead = ({
    headers = []
}) => {
    return <thead >
        <tr className="w-full ">
        {
            headers?.map((header, idx) => {
                console.log(header);
            return <TableHeaderCell key={idx} header={header} />

}) }
        </tr>
        </thead>
}


export default TableHead;