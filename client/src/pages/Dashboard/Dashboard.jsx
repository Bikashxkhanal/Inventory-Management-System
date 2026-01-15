
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {verifyUserType} from "../../Stores/authThunk.js";
import { Outlet, replace, useNavigate } from "react-router-dom";
import { DashboardLayout, MainContentLayout ,SideBarLayout } from "../../Components/index.js";




 const Dashboard = () => {
    const navigate = useNavigate();
    const {user, authStatus} = useSelector((state) => state.auth );

   if(authStatus ===  'loading' || authStatus === 'idle'){
    return <div>Loading...</div>
   }


   if(authStatus === 'authenticated'){
    return (
        <DashboardLayout>
            <SideBarLayout />
            <MainContentLayout >
                <Outlet />
             </MainContentLayout> 
        </DashboardLayout>
    )
   }
 }
 
 export default Dashboard;