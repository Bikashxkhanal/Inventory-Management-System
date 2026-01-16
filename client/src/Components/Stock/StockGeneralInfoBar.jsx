import {SegmentedProgressBar} from './../index'

const StockGeneralInfoBar = () => {
     const datas = [{
         name: 'In stock', 
        color : 'green',
        value : 900,
        total : 3000,
    },
{
        name : 'High stock', 
        color : 'yellow',
        value : 1600,
        total : 3000,
    },
{
        name : 'out of stock', 
        color : 'red',
        value : 500,
        total : 3000,
    }]
    return <SegmentedProgressBar label='Stock' datas={datas}  />
}

export default StockGeneralInfoBar;