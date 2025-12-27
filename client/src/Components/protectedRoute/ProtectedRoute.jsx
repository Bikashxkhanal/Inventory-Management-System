import { useState, useEffect, use } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { verifyUserType } from "../../Stores/authThunk";


function Protected({ children }) {

  //the parameter authentication is for page routing ,is the userAuthenticated to brwose to that page or not, false means can navigate eg. to login/signup page true means requrire authentication like otpVerificationPage, Dashboard etc.
  const navigate = useNavigate();
  const { user, authStatus, isOtpVerified, isAuthenticated ,isAuthorized ,company } = useSelector((state) => state.auth);

  const dispatch  = useDispatch();


  // TODO: must have send userId to the state, when the user is registered to the database

  useEffect (()=>{
    console.log(authStatus);
    
  if(authStatus === 'idle'){
    console.log(authStatus);
    dispatch(verifyUserType());
  }
  }, [dispatch, authStatus])

useEffect(() => {
  console.log(authStatus);

  if(authStatus === 'unauthenticated'){
    navigate('/login');
    return;
  }

  if (authStatus !== "authenticated"){
    return;
  } ;

   if (!user?.companyId ) {
  navigate("/signup");
}
else if (!isOtpVerified) {
  navigate("/signup/email-otp-verification");
}
else if (!user.user_id && user.user_role === 'superadmin') {
  navigate("/super-admin-verification");
}else if(isAuthorized === 'unauthorized') {
  navigate("/login");
}else if(isAuthorized === null){
  navigate('/signup');
}else if(isAuthorized === 'authorized'){
  navigate('/dashboard');
}

 
  }, [ isAuthenticated,user, isOtpVerified , authStatus, isAuthorized, navigate]);

  if(authStatus === 'loading' || authStatus === 'idle'){
    return <div>loading...</div>

  }

  return  <>{children}</>;
}

export default Protected;
