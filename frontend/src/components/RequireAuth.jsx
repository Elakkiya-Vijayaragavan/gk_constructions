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
  const token = localStorage.getItem("lk_admin_token") || localStorage.getItem("lk_user_token");
  const location = useLocation();

  if (!user || !token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

export default RequireAuth;
