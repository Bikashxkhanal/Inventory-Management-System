
import {NewButton, PurchaseFilterBar, IconImage, PurchaseInfoTable, PurchaseTitle} from './../index'
import { Add } from '../../assets/Imagesender';
import PurchaseCountBar from './PurchaseCountBar';

const PurchaseLayout  = () => {
    return <div className='flex-1 mx-4 mt-8 ' >
        <div className='w-full flex flex-row justify-between mt-15 md:mt-5 mb-4'>
            <PurchaseTitle />
            <NewButton as='a' href='/web/purchase/create' children='New' className='bg-green-600 hover:bg-green-800' iconStart={<IconImage src={Add} />} />
        </div>
        <PurchaseCountBar />
        {/* <PurchaseFilterBar /> */}
        <PurchaseInfoTable />
         </div> 
}

export default PurchaseLayout;