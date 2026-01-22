import {FilterComponent, SearchBar} from './../index'

const VendorFilterBar = () => {
    return <div className='max-w-full flex flex-col md:flex-row gap-2 md:gap-0 mt-2 flex-1 grow my-4 '>
        <SearchBar />
        <FilterComponent type='date-range' label="Added Date" options="" />
        <FilterComponent type='category' label='Role' options="" />
    </div>
}

export default VendorFilterBar;