import React from "react";

import { Outlet, useLocation, Navigate } from "react-router-dom";
import Home from "./Home";

const RequireAuth = () => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  console.log("isAuthenticated", isAuthenticated);
  return isAuthenticated ? <Home /> : <Navigate to="/" replace />;
};

export default RequireAuth;
