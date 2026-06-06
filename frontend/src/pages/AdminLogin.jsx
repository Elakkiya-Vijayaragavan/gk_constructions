import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import api from "../services/api";

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const existing = JSON.parse(localStorage.getItem("lk_auth_user") || "null");
    const token = localStorage.getItem("lk_admin_token");
    if (existing?.role === "admin" && token) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email) {
      setError("Please enter the owner email.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login", { email });
      const token = res.data.token || res.data.accessToken;
      const user = res.data.user || { email, role: "admin" };

      if (user.role && user.role !== "admin") {
        setError("Only the owner email can access this page.");
        return;
      }

      if (token) localStorage.setItem("lk_admin_token", token);
      localStorage.setItem("lk_auth_user", JSON.stringify({ ...user, role: "admin" }));
      navigate("/admin/dashboard", { replace: true });
    } catch {
      setError("Unable to login as owner. Please check the email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <span className="login-icon"><FaLock /></span>
        <h1>Owner Login</h1>
        <p>Enter the owner email to access the dashboard.</p>

        <label>
          Email
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </label>
        {error && <p className="error-text">{error}</p>}
        <button className="btn btn-gold" type="submit" disabled={loading}>{loading ? "Signing in..." : "Continue"}</button>
      </form>
    </main>
  );
}

export default AdminLogin;
