import { Navigate } from "react-router-dom";

function parseUser() {
  try {
    return JSON.parse(localStorage.getItem("lk_auth_user") || "null");
  } catch {
    return null;
  }
}

function ProtectedAdmin({ children }) {
  const token = localStorage.getItem("lk_admin_token");
  const user = parseUser();

  if (!token || user?.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedAdmin;
