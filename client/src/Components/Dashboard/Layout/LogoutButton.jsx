import { useSelector , useDispatch } from "react-redux";
import { logout } from "../../../Stores/authThunk";
import {logoutImg } from '../../../assets/Imagesender';



function LogoutButton(){
    const dispatch = useDispatch();

    const handleLogout = () => {
         alert("Are you sure you want to logout");
        dispatch(logout());
    }

    return (
    <>
       <button onClick={handleLogout} className="flex cursor-pointer hover:bg-blue-950  flex-row flex-start gap-10 px-15 py-2 rounded-sm">
        <p className="text-center text-md">Logout</p>
        <img src={logoutImg} width="16px" height="8px" alt="btn" />
       </button>


    </>
    );

}

export default LogoutButton;