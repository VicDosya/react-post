import { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProfileContext } from "./ProfileContext";

type ProtectedRouteType = {
  component: React.FunctionComponent;
}

function ProtectedRoute({ component: Component, ...rest }: ProtectedRouteType) {
  const [loading, setLoading] = useState(true);

  const { loadProfile } = useContext(ProfileContext);
  let navigate = useNavigate();
  useEffect(() => {
    loadProfile().then((data: any) => {
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
