import {SearchBar, FilterComponent} from './../index'

const PurchaseFilterBar = () => {
    return <div className='max-w-full flex flex-col md:flex-row gap-4 md:gap-0 mt-2 flex-1 grow '>
        <SearchBar text="Seach Purchases" />
        <FilterComponent type='date-range' />
        <FilterComponent type='category' />

    </div>
}

export default PurchaseFilterBar;