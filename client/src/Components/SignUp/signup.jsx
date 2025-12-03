
import { Link } from "react-router-dom";
import {InputBox, LoginSingupBtn} from '../index';

function SignupComponent(){

    return(
        <>
        <div className="flex justify-center items-center min-h-screen bg-gray-50" >
        <div
      className="w-full h-full min-h-screen bg-white px-6 py-10 flex flex-col items-center md:h-auto md:min-h-0 md:max-w-md md:rounded-lg md:shadow-sm"
    >
      <h2 className="font-bold text-2xl pb-6 text-green-700">
        Register with Beyond Limits
      </h2>

      <form action="" method="POST" autocomplete="on" className="w-full space-y-4">

        <InputBox placeholder="Enter business name" name="businessName" type="text" />
        <InputBox placeholder="Enter business mail" name="businessMail" type="text" />
        <InputBox  placeholder="Enter phone number" name="username" type="text"/>

        <LoginSingupBtn Name="Create new Account" />


        {/* <input
          className="pl-4 py-3 outline-none border border-gray-300 rounded-md w-full focus:border-green-600"
          type="text"
          placeholder="Enter your business name"
          name="businessname"
        /> */}

        {/* <input
          className="pl-4 py-3 outline-none border border-gray-300 rounded-md w-full focus:border-green-600"
          type="text"
          placeholder="Enter your business mail"
          name="email"
        /> */}

        {/* <input
          className="pl-4 py-3 outline-none border border-gray-300 rounded-md w-full focus:border-green-600"
          type="number"
          placeholder="Enter your number"
          name="number"
        /> */}

        {/* <button
          className="w-full bg-green-600 text-white py-3 rounded-md font-medium hover:bg-green-700"
        >
          Create new Account
        </button> */}
      </form>

      <p className="my-4 text-gray-600">OR</p>

      <button
        className="w-full border border-green-600 rounded-md flex items-center justify-center gap-3 py-3 hover:bg-gray-100 transition"
      >
        <img src="./googleLogo.svg" className="w-6 h-6" alt="Google Icon" />
        <span className="font-medium">Continue with Google</span>
      </button>

      <p className="text-xs text-center text-gray-600 mt-4 px-4">
        By signing up, you agree to Beyond Limit’s
        <Link to="#" className="text-green-700 hover:underline"> Terms of Service</Link>,
        <Link to="#" className="text-green-700 hover:underline"> Privacy Policy</Link>,
        and
        <Link to="#" className="text-green-700 hover:underline">
          Intellectual Property Rights</Link>.
      </p>

      <p className="mt-4 text-gray-700">
        Already have an account?
        <Link to="/login" className="text-green-700 font-medium hover:underline"
          >Sign in</Link>
      </p>
    </div>
    </div>
        
        </>
    )
}


export default SignupComponent;