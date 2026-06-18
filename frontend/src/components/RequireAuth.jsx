import { Navigate, useLocation } from "react-router-dom";

function getAuthUser() {
  try {
    return JSON.parse(localStorage.getItem("lk_auth_user") || "null");
  } catch {
    return null;
  }
}

function RequireAuth({ children }) {
  const user = getAuthUser();
  const adminToken = localStorage.getItem("lk_admin_token");
  const userToken = localStorage.getItem("lk_user_token");
  const token = adminToken || userToken;
  const location = useLocation();

  // Clear invalid auth data
  if (!user || !token) {
    localStorage.removeItem("lk_auth_user");
    localStorage.removeItem("lk_admin_token");
    localStorage.removeItem("lk_user_token");
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Validate token matches user role
  if (user.role === "admin" && !adminToken) {
    localStorage.removeItem("lk_auth_user");
    localStorage.removeItem("lk_user_token");
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (user.role !== "admin" && !userToken) {
    localStorage.removeItem("lk_auth_user");
    localStorage.removeItem("lk_admin_token");
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

export default RequireAuth;
