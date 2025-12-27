
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";


const MainContentLayout = () => {

    const {user, permissions}  = useSelector((state) => state.auth);
    console.log(permissions);

    if(user && permissions){
         return  ( <ul>
   { permissions.map(permission => (<li key={permission}>{permission}</li>))}
    </ul>)
        
    }
    return <h1>No user</h1>

}


export default MainContentLayout;