
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {verifyUserType} from "../../Stores/authThunk.js";
import { replace, useNavigate } from "react-router-dom";
import { DashboardLayout, MainContentLayout ,SideBarLayout } from "../../Components/index.js";




 const SuperAdminDashboard = () => {
    const navigate = useNavigate();
    const {user, authStatus} = useSelector((state) => state.auth );

   if(authStatus ===  'loading' || authStatus === 'idle'){
    return <div>Loading...</div>
   }

   if(authStatus === 'authenticated'){
    return (
        <DashboardLayout>
            <MainContentLayout />
            <SideBarLayout />
        </DashboardLayout>
    )
   }
 }
 
 export default SuperAdminDashboard;