import { InfoContainer} from './../../index';
import CustomChart from "../../Chart/CustomChart";
import getChartFor from "../../Chart/CreateOptions";
import { Arrow, purchaseImg, revenueImg, salesImg, userImg } from '../../../assets/Imagesender';
import useFetch from '../../../hooks/useFetch';
import { getTotalSalesAmountByDateRange, getPurchaseAmountByDateRange } from '../../../services/api.js';
import { fetchStaffStats } from '../../../api/staff.api.js';


export const data1 = {
    labels : ["01-20" , "01-22", "01-24"],
    datasets : [
        {
            label : "Sale",
            //data is amount
            data : [44, 99, 80],
            backgroundColor : "rgba(244, 90, 150)"
        }, 
        {
            label : "Purchase",
            data :[88, 98, 70]
        }
    ],
    
}


//data must be fetched as getSalesAmountByDateRange(startDate, endDate) AND PurchaseAmountByDateRange(startDate, endDate) OR , where both start and 
//end date are included
//data should be in this format :: dataSales = { time : Amount , ... } , purchaseData = {time : Amount} this is
//  the format of data obtained from the backend, then time need to be used as labels , 
// and amount as data , the amount of sale and purchase should be reduced to two diffrent part of datasets 


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
    const {data : salesData, isLoading, error}= useFetch(
    "salesAmount", 
    getTotalSalesAmountByDateRange
);

    const {data : purcahseData} = useFetch(
        "purchaseAmount", 
        getPurchaseAmountByDateRange
    )

    const {data : staffData} = useFetch(
        "staff", 
        fetchStaffStats
    )  

if(isLoading) return <div>please wait...</div>

    return <div className='inline-block h-screen overflow-hidden '>
        <p className='ml-8 mt-4 text-3xl font-semi-bold font-mono'>Dashboard</p>
        <div className='flex flex-row flex-start flex-wrap mx-2  md:mx-5 '>
        <InfoContainer color="text-green-700" img={revenueImg}  amount={salesData?.data?.totalSalesAmount} title="Total Sales"  />
        <InfoContainer color="text-green-700" img={purchaseImg}  amount={purcahseData?.data?.totalPurchaseAmount} title="Total Purchases"   />
        <InfoContainer color="text-green-700" img={userImg}  count={staffData?.total} title="Total Staff"  />

        {/* <InfoContainer color="text-green-700" img={revenueImg}  amount="12000" title="Total Revenue"  /> */}
        
        </div>
        <div className='flex flex-row flex-start gap-20 flex-wrap'>
        <div className="w-90 md:w-110 ml-8 mt-10">
        <CustomChart  type="bar" data={data1} options={getChartFor("bar", "Sales and Purchases")} />
        </div>
        <div className="w-90  md:w-110 ml-8 mt-10">
        <CustomChart  type="line" data={data2} options={getChartFor("line", "Sales")} />
        </div>
        </div>
    </div>
}


 export default DashboardComp;