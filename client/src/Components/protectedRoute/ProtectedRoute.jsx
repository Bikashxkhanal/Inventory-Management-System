import { useState, useEffect, use } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { verifyUserType } from "../../Stores/authThunk";


function Protected({ children }) {

  //the parameter authentication is for page routing ,is the userAuthenticated to brwose to that page or not, false means can navigate eg. to login/signup page true means requrire authentication like otpVerificationPage, Dashboard etc.
  const navigate = useNavigate();
  const { user, authStatus, isOtpVerified, company } = useSelector((state) => state.auth);

  const dispatch  = useDispatch();


  // TODO: must have send userId to the state, when the user is registered to the database

  //if the authStatus = idle

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


if (!company?.companyId ) {
  navigate("/signup");
}

if(authStatus === 'signup_in_progress'){
  navigate('/signup/email-otp-verification')
 }

  if (authStatus !== "authenticated"){
    return;
  } ;

  if(authStatus === 'authenticated' && user?.isAuthenticated){
    navigate('/web/dashboard');
  }


  }, [ user,company,  isOtpVerified , authStatus, navigate]);

  if(authStatus === 'loading' || authStatus === 'idle'){
    return <div>loading...</div>

  }

  return  <>{children}</>;
}

export default Protected;
