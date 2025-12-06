import {OtpInput, Button} from '../index'
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { emailOtp } from '../../Stores/authThunk';




function EmailOtpVerification(){
   
    const [otp, setOtp] = useState(["","","","","",""])
 

    const {otpVerificed, user, loading} = useSelector(state => state.auth);

    const dispatch = useDispatch();


   const validateOTP = () => {
   const isoptValid =  (otp.every((digit) => digit.trim() !== "" ))

    return isoptValid ? true : false;    
   
    }

    const handleSubmit = (e) => {
       e.preventDefault();
      if(!validateOTP()){
        return;
      }
      const singleOtp = {otp : otp.join(""),
        userEmail : user.userEmail,
      }
      console.log(singleOtp);
      
     dispatch(emailOtp(singleOtp)); 
    
    }



    return(
        <>

         <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <div
        className="w-full bg-gray-50 px-6 py-10 flex flex-col items-center md:h-auto min-h-0 md:max-w-md md:border md:border-gray-300 md:rounded-lg -translate-y-30 md:-translate-y-10"
      >
        <img  alt="Logo" />

        <h2 className="font-bold text-2xl pt-4 text-black">
          Please verify your account
        </h2>
        <p className="text-md text-center text-gray-400">
          Enter your 6-digit code send to your
          <span>{user.userEmail}</span>
        </p>
        <form  method='POST' className="flex flex-row gap-5 mt-10">
          <OtpInput otp={otp} setOtp={setOtp} />
         
        </form>

        <Button onClick={handleSubmit} backgroundColor='bg-green-500' btnName="Verify and continue"
        hoverColor='hover:bg-green-700' borderShape='rounded-md'
        className = "font-medium w-60 mt-10" borderColor="bg-green-700" />

        <Button  btnName="Resend OTP"
        hoverColor='hover:bg-gray-200'
         borderShape='rounded-md' 
         textColor='text-black'
        className = "font-medium w-60 mt-4"
         borderColor="border-gray-500" />


      </div>
    </div>

        </>
    )
}

export default EmailOtpVerification;