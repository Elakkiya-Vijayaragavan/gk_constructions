import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaGoogle, FaEnvelope } from "react-icons/fa";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const existingUser = JSON.parse(localStorage.getItem("lk_auth_user") || "null");
    const token = localStorage.getItem("lk_admin_token") || localStorage.getItem("lk_user_token");
    if (existingUser && token) {
      if (existingUser.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [navigate]);

  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const handleContinue = async () => {
    const email = form.email.trim().toLowerCase();
    if (!email) {
      setError("Please enter your email to continue.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login", { email });
      const user = res.data.user || { email, role: "user" };
      const token = res.data.token || res.data.accessToken;

      if (user.role === "admin") {
        if (token) localStorage.setItem("lk_admin_token", token);
        localStorage.setItem("lk_auth_user", JSON.stringify(user));
        navigate("/admin/dashboard", { replace: true });
        return;
      }

      if (token) localStorage.setItem("lk_user_token", token);
      localStorage.setItem("lk_auth_user", JSON.stringify({ ...user, role: user.role || "user" }));
      navigate("/", { replace: true });
    } catch {
      setError("Unable to login with email. Please check the email and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <form className="login-card customer-login-card" onSubmit={(event) => event.preventDefault()}>
        <span className="section-kicker">Secure Login</span>
        <h1>Welcome Back</h1>
        <p>Continue with Google or Gmail. The owner email opens the dashboard automatically.</p>

        <label>Email Address<input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required /></label>
        {error && <p className="error-text">{error}</p>}

        <div className="login-actions">
          <button className="btn btn-outline-dark" type="button" disabled={loading} onClick={handleContinue}> 
            <FaGoogle /> Continue with Google
          </button>
          <button className="btn btn-gold" type="button" disabled={loading} onClick={handleContinue}> 
            <FaEnvelope /> Continue with Email
          </button>
        </div>

        <div className="login-footer">
          <p>No password needed. Other emails open the viewer website.</p>
        </div>
      </form>
    </main>
  );
}

export default Login;
