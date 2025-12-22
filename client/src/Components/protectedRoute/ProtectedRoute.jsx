import { useState, useEffect, use } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


function Protected({ children }) {

  //the parameter authentication is for page routing ,is the userAuthenticated to brwose to that page or not, false means can navigate eg. to login/signup page true means requrire authentication like otpVerificationPage, Dashboard etc.

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { company, isOtpVerified, isAuthenticated } = useSelector((state) => state.auth);

  // TODO: must have send userId to the state, when the user is registered to the database

  useEffect(() => {
   if (!company.companyId ) {
  navigate("/signup");
}
else if (!isOtpVerified) {
  navigate("/signup/email-otp-verification");
}
else if (!isAuthenticated) {
  navigate("/super-admin-verification");
}
else {
  navigate("/");
}

    setLoading(false);
  }, [company, isAuthenticated, navigate]);

  return loading ? "Loading..." : <>{children}</>;
}

export default Protected;
