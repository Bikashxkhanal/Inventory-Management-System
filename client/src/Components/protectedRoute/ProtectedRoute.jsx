import { useState, useEffect, use } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


function Protected({ children }) {

  //the parameter authentication is for page routing ,is the userAuthenticated to brwose to that page or not, false means can navigate eg. to login/signup page true means requrire authentication like otpVerificationPage, Dashboard etc.



  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user, otpVerified, isAuthenticated } = useSelector((state) => state.auth);

  // TODO: must have send userId to the state, when the user is registered to the database

  useEffect(() => {
   if (!user.userId) {
  navigate("/signup");
}
else if (!otpVerified) {
  navigate("/signup/email-otp-verification");
}
else if (!isAuthenticated) {
  navigate("/login");
}
else {
  navigate("/");
}

    setLoading(false);
  }, [user, isAuthenticated, navigate]);

  return loading ? "Loading..." : <>{children}</>;
}

export default Protected;
