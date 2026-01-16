import {Container, StockFilterBar, StockInformationTable, StockGeneralInfoBar, StockTitle} from './../index'

const StockLayout = () =>{
    return <div className='flex-1 mx-4 mt-8 ' >
            <StockTitle />
            <StockGeneralInfoBar />
            <StockFilterBar />
            <StockInformationTable />
             </div>
}

export default StockLayout;