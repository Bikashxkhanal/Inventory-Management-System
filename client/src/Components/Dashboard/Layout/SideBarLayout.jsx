import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../Stores/authThunk";
const SideBarLayout = () => {

    const dispatch = useDispatch();

    const logoutEvent = () => {
        dispatch(logout());   
    }


    return(
        <button onClick={logoutEvent}>Logout</button>
    )
}


export default SideBarLayout;