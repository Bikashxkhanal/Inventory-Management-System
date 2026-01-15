import SearchBar from "../SearchBox/SearchBar";

const Stock = () => {
    return <div className="flex-1 ml-8 mt-8 mr-20 ">
        <div className="flex flex-row justify-between">
            <p className="text-3xl font-semibold">Inventory Stock</p>
            <div className="flex flex-row justify-start gap-10">
           <SearchBar text="Search list..." />
            </div>
        </div>

    </div>
}

export default Stock;