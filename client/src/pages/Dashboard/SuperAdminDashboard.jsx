
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {verifyUserType} from "../../Stores/authThunk.js";




 const SuperAdminDashboard = () => {

    const dispatch = useDispatch();
    const {user, isAuthenticated, permissions} = useSelector((state) => state.auth);
        useEffect(()=> {
            console.log("Bikash");
            dispatch(verifyUserType());
        }, []);



    return (
        <>
        Bikash khanal
        {isAuthenticated && <p>this user is authencticated</p>}
       
        </>
    )
 }

 export default SuperAdminDashboard;