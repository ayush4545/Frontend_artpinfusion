import React, { ReactNode } from "react";
import useAuth from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import { WithErrorBoundariesWrapper } from "./WithErrorBoundaries";
import config from "../config";

const WithAuthentication = ({ children }: { children: ReactNode }) => {
  const isAuthenticate = useAuth();
  const { routePaths } = config.constant.routes;
  if (!isAuthenticate) {
    return <Navigate to={routePaths?.HOME} state={{ isNeedToLogin: true }} />;
  }
  return <>{children}</>;
};

export default WithErrorBoundariesWrapper(WithAuthentication);
