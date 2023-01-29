import { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProfileContext } from "./ProfileContext";
import { ProtectedRouteType, ProfileType, ErrorType } from './ReactPost.types';

function ProtectedRoute({ component: Component, ...rest }: ProtectedRouteType) {
  const [loading, setLoading] = useState(true);

  const { loadProfile } = useContext(ProfileContext);
  let navigate = useNavigate();
  useEffect(() => {
    //Never use 'any' type. except for try and catch blocks.
    loadProfile().then((data: ProfileType | ErrorType) => {
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
