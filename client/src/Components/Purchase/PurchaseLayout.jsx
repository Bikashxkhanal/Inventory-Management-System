
import {NewButton, PurchaseFilterBar, PurchaseInfoTable, PurchaseTitle} from './../index'

const PurchaseLayout  = () => {
    return <div className='flex-1 mx-4 mt-8 ' >
        <div className='w-full flex flex-row justify-between mt-15 md:mt-5 mb-4'>
            <PurchaseTitle />
            <NewButton />
        </div>
        <PurchaseFilterBar />
        <PurchaseInfoTable />
         </div> 
}

export default PurchaseLayout;