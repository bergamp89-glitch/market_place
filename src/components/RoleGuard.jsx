import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RoleGuard({ allowedRoles, children }) {
  const { isAuthenticated, currentUser } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const currentRole = currentUser?.role || "user";

  if (!allowedRoles.includes(currentRole)) {
    return <Navigate to="/profile" replace />;
  }

  return children;
}