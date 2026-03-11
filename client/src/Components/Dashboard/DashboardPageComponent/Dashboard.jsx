import { InfoContainer} from './../../index';
import CustomChart from "../../Chart/CustomChart";
import getChartFor from "../../Chart/CreateOptions";
import { Arrow, purchaseImg, revenueImg, salesImg, userImg } from '../../../assets/Imagesender';
import {getSellsAmountByDateRange} from '../../../api/sales.api'
import useFetch from '../../../hooks/useFetch';

export const data = {
    labels : ["01-20" , "01-22", "01-24"],
    datasets : [
        {
            label : "title 1",
            data : [44, 99, 80],
            backgroundColor : "rgba(244, 90, 150)"
        }, 
        {
            label : "title 2",
            data : [88, 98, 70]
        }
    ],
    
}





export const data2 = {
    labels : ["Sun", "Mon", "Tues", "Wed", "Thus", "Fri", "Sat"],
    datasets : [
        {
            label : "week 1 of January ",
            data : [44, 99, 80, 100, 59, 150, 200],
            backgroundColor : "rgba(244, 90, 150)"
        }, 
        {
            label : "week 1 of Febuary",
            data : [88, 98, 70, 180, 198, 100, 250]
        }
    ],
    
}


const DashboardComp = ( ) => {
    //call the api to get the sells details 
    const {datas, isLoading, error}= useFetch(
    "sales", 
    getSellsAmountByDateRange
);
    return <div className='inline-block h-screen overflow-hidden '>
        <p className='ml-8 mt-4 text-3xl font-semi-bold font-mono'>Dashboard</p>
        <div className='flex flex-row flex-start flex-wrap mx-2  md:mx-5 '>
        <InfoContainer color="text-green-700" img={revenueImg}  amount="12000" title="Total Sales" percent="+12%"  />
        <InfoContainer color="text-green-700" img={purchaseImg}  amount="12000" title="Total Purchases" percent="+12%"  />
        <InfoContainer color="text-red-700" img={userImg}  count="12" title="Total Staff" percent="-8%"  />
        <InfoContainer color="text-green-700" img={revenueImg}  amount="12000" title="Total Revenue" percent="+12%"  />
        </div>
        <div className='flex flex-row flex-start gap-20 flex-wrap'>
        <div className="w-90 md:w-110 ml-8 mt-10">
        <CustomChart  type="bar" data={data} options={getChartFor("bar", "Sales and Purchases")} />
        </div>
        <div className="w-90  md:w-110 ml-8 mt-10">
        <CustomChart  type="line" data={data2} options={getChartFor("line", "Sales")} />
        </div>
        </div>
    </div>
}


export default DashboardComp;