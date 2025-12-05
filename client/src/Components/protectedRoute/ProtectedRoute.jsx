import { useState, useEffect, use } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


function Protected({ children, authentication = true }) {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // TODO: must have send userId to the state, when the user is registered to the database

  useEffect(() => {
    if (authentication && !user.companyId) {
      navigate("/signup");
    } else if (!authentication && user.companyId) {
      navigate("/");
    }
    setLoading(false);
  }, [user, authentication, navigate]);

  return loading ? "Loading..." : <>{children}</>;
}

export default Protected;
