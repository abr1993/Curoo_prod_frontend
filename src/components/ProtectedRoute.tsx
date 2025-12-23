import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles?: ("PATIENT" | "PROVIDER")[];
}
 
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
 const { token, role, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (!token) {
      navigate("/verify/account", { replace: true });
    } else if (allowedRoles && !allowedRoles.includes(role as any)) {
      navigate("/", { replace: true });
    }
  }, [token, role, allowedRoles, navigate, isLoading]);

  if (isLoading) {
    return null; // Or <LoadingSpinner />
  }
  // Prevent rendering the children while redirecting
  if (!token || (allowedRoles && !allowedRoles.includes(role as any))) {
    return null;
  }

  return children;
};
