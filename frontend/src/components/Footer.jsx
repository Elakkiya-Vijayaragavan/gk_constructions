import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import api from "../services/api";

function Footer() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    api.get("/settings")
      .then((res) => setSettings(res.data.settings || res.data))
      .catch(() => setSettings(null));
  }, []);

  const whatsappNumber = settings?.whatsapp ? settings.whatsapp.replace(/\D/g, "") : "919876543210";
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Link to="/" className="brand footer-brand">
            <span className="brand-mark">GK</span>
            <span>{settings?.companyName || "GK Constructions"}</span>
          </Link>
        </div>

        <div>
          <h3>Quick Links</h3>
          <Link to="/">Home</Link>
          <Link to="/services">Services</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/gallery">Gallery</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div>
          <h3>Contact Information</h3>
          <p>{settings?.phone || "+91 98765 43210"}</p>
          <p>{settings?.email || "kavihari155@gmail.com"}</p>
          <p>{settings?.address || "KG Valasu, Erode"}</p>

          <h3>Social Media</h3>
          <a href={settings?.socialLinks?.linkedin || "https://www.linkedin.com"} target="_blank" rel="noreferrer"><FaLinkedin /> LinkedIn</a>
          <a href={settings?.socialLinks?.instagram || "https://www.instagram.com"} target="_blank" rel="noreferrer"><FaInstagram /> Instagram</a>
          <a href={whatsappLink} target="_blank" rel="noreferrer"><FaWhatsapp /> WhatsApp</a>
        </div>
      </div>
      <div className="footer-bottom">© {new Date().getFullYear()} {settings?.companyName || "GK Constructions"}. All Rights Reserved.</div>
    </footer>
  );
}

export default Footer;
