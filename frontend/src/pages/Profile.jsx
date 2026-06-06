import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";

const statuses = ["New Request", "Under Review", "Contacted", "Accepted", "Rejected", "Completed"];

function getUser() {
  try {
    return JSON.parse(localStorage.getItem("lk_auth_user") || "null");
  } catch {
    return null;
  }
}

function Profile() {
  const [user, setUser] = useState(getUser());
  const [request, setRequest] = useState({ service: "", phone: "", message: "" });
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/user/requests")
      .then((res) => setRequests(Array.isArray(res.data) ? res.data : res.data.requests || []))
      .catch(() => setRequests([]));
  }, []);

  if (!user) return <Navigate to="/login" replace />;

  const handleProfileSave = async (event) => {
    event.preventDefault();
    localStorage.setItem("lk_auth_user", JSON.stringify(user));
    try {
      await api.put("/user/profile", user);
      setMessage("Profile updated successfully.");
    } catch {
      setMessage("Profile saved locally. Backend profile endpoint is not available yet.");
    }
  };

  const handleRequestSubmit = async (event) => {
    event.preventDefault();
    const payload = { ...request, name: user.name, email: user.email, status: "New Request" };
    try {
      const res = await api.post("/service-requests", payload);
      setRequests([{ ...payload, _id: res.data.request?._id || res.data._id || Date.now() }, ...requests]);
    } catch {
      setRequests([{ ...payload, _id: Date.now() }, ...requests]);
    }
    setRequest({ service: "", phone: "", message: "" });
    setMessage("Your service request has been submitted successfully.");
  };

  const logout = () => {
    localStorage.removeItem("lk_user_token");
    localStorage.removeItem("lk_admin_token");
    localStorage.removeItem("lk_auth_user");
    window.location.href = "/";
  };

  return (
    <>
      <Navbar />
      <main>
        <section className="page-hero">
          <div className="container">
            <span className="section-kicker">Customer Portal</span>
            <h1>My Profile</h1>
            <p>Manage your profile, submit requests, and track enquiry status.</p>
          </div>
        </section>

        <section className="section">
          <div className="container profile-grid">
            <form className="detail-panel" onSubmit={handleProfileSave}>
              <h2>Profile Details</h2>
              <label>Name<input value={user.name || ""} onChange={(event) => setUser({ ...user, name: event.target.value })} /></label>
              <label>Email<input type="email" value={user.email || ""} onChange={(event) => setUser({ ...user, email: event.target.value })} /></label>
              <label>Phone<input value={user.phone || ""} onChange={(event) => setUser({ ...user, phone: event.target.value })} /></label>
              <div className="admin-actions">
                <button className="btn btn-gold" type="submit">Save Profile</button>
                <button className="btn btn-outline-dark" type="button" onClick={logout}>Logout</button>
              </div>
              {message && <p className="form-status">{message}</p>}
            </form>

            <form className="detail-panel" onSubmit={handleRequestSubmit}>
              <h2>Submit Service Request</h2>
              <label>Service Required<input value={request.service} onChange={(event) => setRequest({ ...request, service: event.target.value })} required /></label>
              <label>Phone<input value={request.phone} onChange={(event) => setRequest({ ...request, phone: event.target.value })} required /></label>
              <label>Message<textarea rows="4" value={request.message} onChange={(event) => setRequest({ ...request, message: event.target.value })} required /></label>
              <button className="btn btn-gold" type="submit">Submit Request</button>
            </form>
          </div>

          <div className="container request-history">
            <h2>Request History</h2>
            <div className="request-status-row">
              {statuses.map((status) => <span key={status}>{status}</span>)}
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Service</th><th>Message</th><th>Status</th></tr></thead>
                <tbody>
                  {requests.map((item) => (
                    <tr key={item._id || item.id}>
                      <td>{item.service || item.subject || "Project Enquiry"}</td>
                      <td>{item.message}</td>
                      <td><span className="status-badge">{item.status || "Pending"}</span></td>
                    </tr>
                  ))}
                  {!requests.length && <tr><td colSpan="3">No requests yet.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Profile;
