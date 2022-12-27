import { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProfileContext } from "./ProfileContext";

function ProtectedRoute({ component: Component, ...rest }) {
  const [loading, setLoading] = useState(true);

  const { loadProfile } = useContext(ProfileContext);
  let navigate = useNavigate();
  useEffect(() => {
    loadProfile().then((data) => {
      if (!data || data.error) {
        navigate("/auth/login");
      }
      setLoading(false);
    });
  }, []);
  if (loading) {
    return <div></div>;
  }
  return <Component {...rest} />;
}

export default ProtectedRoute;
