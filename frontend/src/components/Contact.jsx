import { useEffect, useState } from "react";
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import api from "../services/api";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  message: "",
};

function Contact() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    api.get("/settings")
      .then((res) => setSettings(res.data.settings || res.data))
      .catch(() => setSettings(null));
  }, []);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      await api.post("/enquiries", form);
      setForm(initialForm);
      setStatus("Thank you. We will contact you shortly.");
    } catch {
      setStatus("Unable to submit right now. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section contact-section">
      <div className="container contact-grid">
        <div>
          <span className="section-kicker">Contact</span>
          <h2>Start your next project with {settings?.companyName || "GK Constructions"}</h2>
          <p className="contact-intro">Share your requirement and we will help you plan the next practical step.</p>

          <div className="contact-list">
            <p><FaPhoneAlt /> {settings?.phone || "+91 98765 43210"}</p>
            <p><FaEnvelope /> {settings?.email || "kavihari155@gmail.com"}</p>
            <p><FaMapMarkerAlt /> {settings?.address || "Tamil Nadu, India"}</p>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label>
              Name
              <input name="name" value={form.name} onChange={handleChange} required />
            </label>
            <label>
              Email
              <input type="email" name="email" value={form.email} onChange={handleChange} required />
            </label>
          </div>
          <label>
            Phone
            <input name="phone" value={form.phone} onChange={handleChange} required />
          </label>
          <label>
            Message
            <textarea name="message" rows="5" value={form.message} onChange={handleChange} required />
          </label>
          <button className="btn btn-gold" type="submit" disabled={loading}>{loading ? "Sending..." : "Send Message"}</button>
          {status && <p className="form-status">{status}</p>}
        </form>
      </div>
    </section>
  );
}

export default Contact;
