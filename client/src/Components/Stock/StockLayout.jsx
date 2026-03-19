import {Container, StockFilterBar, StockInformationTable, StockGeneralInfoBar, StockTitle, NewButton, IconImage} from './../index'
import { Add} from './../../assets/Imagesender'


const StockLayout = () =>{
    return <div className='flex flex-col justify-start mx-4 mt-8  gap-8' >
        <div className='w-full flex flex-row justify-between mt-15 md:mt-5 mb-4'>
            <StockTitle />
            </div>
            <StockFilterBar />
            <StockGeneralInfoBar />
            <StockInformationTable />
             </div>
}

export default StockLayout;