import {Container, StockFilterBar, StockInformationTable, StockGeneralInfoBar, StockTitle, NewButton, IconImage} from './../index'
import { Add} from './../../assets/Imagesender'

const StockLayout = () =>{
    return <div className='flex-1 mx-4 mt-8 ' >
        <div className='w-full flex flex-row justify-between mt-15 md:mt-5 mb-4'>
            <StockTitle />
            <NewButton children="New" as='a' href='/web/stock/add-stock' size='md' variant='secondary' className='bg-green-600 sm:w-12 md:w-24 cursor-pointer hover:bg-green-800' iconStart={<IconImage src={Add}  size='18'  />}/>
            </div>
            <StockGeneralInfoBar />
            <StockFilterBar />
            <StockInformationTable />
             </div>
}

export default StockLayout;