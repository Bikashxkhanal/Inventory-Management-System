import { InfoContainer} from './../../index';
import CustomChart from "../../Chart/CustomChart";
import getChartFor from "../../Chart/CreateOptions";
import { Arrow, purchaseImg, revenueImg, salesImg, userImg } from '../../../assets/Imagesender';
import useFetch from '../../../hooks/useFetch';
import { fetchStaffStats } from '../../../api/staff.api.js';
import {getPurchaseAmountOfDateRange, getTotalPurchaseAmountByDateRange} from '../../../api/purchase.api.js';
import {getSalesAmountOfDateRange, getTotalSalesAmountByDateRange} from '../../../api/sales.api.js'
import {getStartDateOfCurrentYear, formatDate, getDateBeforeCurrentDate} from '../../../helpers/date/date.js'


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
    //get today current date (y-m-d) format 
    const currentDate = new Date();
    const formatedCurrentDate = formatDate(currentDate);
    const formatedstartingYearDateOfCurrentDate = getStartDateOfCurrentYear(currentDate);  
    
    const dateOfSevenDayBeforeCurrentDate = getDateBeforeCurrentDate(7); //get week range 

    //call the api to get the sells details 
    const {data : salesData, isLoading, error}= useFetch(
    "salesAmount", 
    () => getTotalSalesAmountByDateRange(formatedstartingYearDateOfCurrentDate, formatedCurrentDate)
);

    const { data : saleAmtOfDate} = useFetch(
        "salesAmt", 
      () =>   getSalesAmountOfDateRange(dateOfSevenDayBeforeCurrentDate, formatedCurrentDate)
    );

     const { data : purchaseAmtOfDate} = useFetch(
        "purchaseAmt", 
      () =>  getPurchaseAmountOfDateRange(dateOfSevenDayBeforeCurrentDate, formatedCurrentDate)
    );

    //data fromat for custom chart :: data = { labels : {} // can be time , week days , datasets : 
    // [ {}, {} , ...]
    // numeric value (amount , staff count, etc) can be number of object , likely keeping less than 4
    
    //first push the data of one (either sale or purchase) => labels , then data , simillary for another
    //check for dublicate labels while pushing new one 
    const dummyData ={ labels : [] , datasets : [  {
            label : "Sale",
            //data is amount
            data : [],
            backgroundColor : "rgba(244, 90, 150)"
        }, 
        {
            label : "Purchase",
            data :[],
             backgroundColor : "rgba(44, 90, 200)"
        }]
     }

     // for storing unique lables (date)
    const dummySet = new Set();

    saleAmtOfDate?.forEach((saleItem) => {
        dummySet.add(saleItem.saleCreatedDate);
        // [...dummyData.labels, dummyData.labels.push(saleItem.saleCreatedDate)]
        dummyData.datasets?.[0].data.push(saleItem.amount);
    })

    purchaseAmtOfDate?.forEach((purchaseItem) => {
        dummySet.add(purchaseItem.purchaseCreatedDate);
        // [...dummyData.labels, dummyData.labels.push(purchaseItem.purchaseCreatedDate) ]
       
         dummyData.datasets?.[1].data.push(purchaseItem.amount);
    })

    // console.log(dummyData);
    console.log(dummySet);
    dummyData.labels = [...dummySet];
    console.log(dummyData);

    const {data : purcahseData} = useFetch(
        "purchaseAmount", 
       () =>  getTotalPurchaseAmountByDateRange(formatedstartingYearDateOfCurrentDate, formatedCurrentDate)
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
        <CustomChart  type="bar" data={dummyData} options={getChartFor("bar", "Sales and Purchases")} />
        </div>
        <div className="w-90  md:w-110 ml-8 mt-10">
        <CustomChart  type="line" data={data2} options={getChartFor("line", "Sales")} />
        </div>
        </div>
    </div>
}


 export default DashboardComp;