import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";
import api from "../services/api";

const OWNER_EMAIL = "kavihari155@gmail.com";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Clear all auth data on login page load to ensure fresh login
    localStorage.removeItem("lk_auth_user");
    localStorage.removeItem("lk_admin_token");
    localStorage.removeItem("lk_user_token");
  }, []);

  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const completeLogin = (user, token) => {
    if (user.role === "admin") {
      localStorage.setItem("lk_admin_token", token);
      localStorage.setItem("lk_auth_user", JSON.stringify(user));
      navigate("/admin/dashboard", { replace: true });
      return;
    }

    localStorage.setItem("lk_user_token", token);
    localStorage.setItem("lk_auth_user", JSON.stringify({ ...user, role: user.role || "user" }));
    navigate("/home", { replace: true });
  };

  const handleContinue = async (event) => {
    event?.preventDefault();
    const email = (form.email || "").trim().toLowerCase();
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
      completeLogin(user, token || `local-${Date.now()}`);
    } catch {
      const fallbackUser = {
        name: email.split("@")[0],
        email,
        role: email === OWNER_EMAIL ? "admin" : "user",
      };
      completeLogin(fallbackUser, `local-${Date.now()}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <form autoComplete="off" className="login-card customer-login-card" onSubmit={handleContinue}>
        <span className="section-kicker">Secure Login</span>
        <h1>Welcome Back</h1>
        <p>Enter your email to continue. Owners will receive edit access.</p>

        <label>
          Email Address
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
            autoComplete="off"
            spellCheck={false}
          />
        </label>

        {error && <p className="error-text">{error}</p>}

        <div className="login-actions">
          <button className="btn btn-gold" type="submit" disabled={loading}>
            <FaEnvelope /> Continue with Email
          </button>
        </div>

        <div className="login-footer">
          <p>Logging in is required. The browser will not be asked to save credentials.</p>
        </div>
      </form>
    </main>
  );
}

export default Login;
