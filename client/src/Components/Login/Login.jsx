import { Link } from "react-router-dom";
import {InputBox, LoginSingupBtn} from "../index.js";
function LoginComponent(){
    return(
        <>
         <div className="
      w-full h-full min-h-screen bg-white px-6 py-10
      flex flex-col items-center
      md:h-auto md:min-h-0 md:max-w-md md:rounded-lg md:shadow-sm
    ">
      
      <h2 className="font-bold text-xl md:text-2xl pb-6 text-green-700">Welcome to Beyond Limits </h2>

      <form action="" method="POST" autocomplete="on" className="w-full space-y-4">

        <InputBox placeholder="Phone number or email" name="username" type="text"  />

        <InputBox placeholder="password" name="password" type="password"  />

        
        {/* <input
          className="pl-4 py-3 outline-none border border-gray-300 rounded-md w-full focus:border-green-600"
          type="text"
          placeholder="Phone number or email"
          name="username"
        /> */}
        
        {/* <input
          className="pl-4 py-3 outline-none border border-gray-300 rounded-md w-full focus:border-green-600"
          type="password"
          placeholder="Password"
          name="password"
        /> */}

        <div className="flex justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" />
            <span>Remember me</span>
          </label>

          <Link  className="text-green-700 hover:underline" >Forgot password?</Link>

          {/* <a href="#" className="text-green-700 hover:underline">Forgot password?</a> */}
        </div>

     <LoginSingupBtn Name="Login" />
        {/* <button
          className="w-full bg-green-600 text-white py-3 rounded-md font-medium hover:bg-green-700">
          Login
        </button> */}
      </form>

      <p className="my-4 text-gray-600">OR</p>

      <button
        className="w-full border border-green-600 rounded-md flex items-center justify-center gap-3 py-3 hover:bg-gray-100 transition">
        <img src="./gooleicon.svg" className="w-6 h-6" alt="Google Icon" />
        <span className="font-medium">Continue with Google</span>
      </button>

      <p className="text-xs text-center text-gray-600 mt-4 px-4">
        By logging in, you agree to Beyond Limit’s
         Terms of Service,
        Privacy Policy, and
        Intellectual Property Rights
      </p>

      <p className="mt-4 text-gray-700">
        Don’t have an account?
        <a href="#" className="text-green-700 font-medium hover:underline">Sign up</a>
      </p>

    </div>
        </>

    )
}

export default LoginComponent;