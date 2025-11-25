import type { FC, ReactNode } from "react";
import { Navigate } from "react-router-dom";
type ProtectedRouteProps ={
    element :ReactNode ,
    isAuthenticated:boolean
}
const ProtectedRoute:FC<ProtectedRouteProps> = ({ element, isAuthenticated }) => {
  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
