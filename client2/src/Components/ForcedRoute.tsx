import React, { useEffect, useContext, useState } from "react";
import { useNavigate, Route } from "react-router-dom";
import { ProfileContext } from "./ProfileContext";
import {ProtectedRouteType} from './ReactPost.types';

function ProtectedRoute({ component: Component, ...rest }: ProtectedRouteType) {
  const [loading, setLoading] = useState(true);

  const { loadProfile } = useContext(ProfileContext);
  let navigate = useNavigate();
  useEffect(() => {
    loadProfile().then((data: any) => {
      if (data && !data.error) {
        navigate("/");
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
