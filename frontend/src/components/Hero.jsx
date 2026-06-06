import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt, FaWhatsapp } from "react-icons/fa";
import heroImage from "../assets/hero.png";
import api from "../services/api";

function Hero() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    api.get("/settings")
      .then((res) => setSettings(res.data.settings || res.data))
      .catch(() => setSettings(null));
  }, []);

  const phone = settings?.phone || "7010992575";
  const email = settings?.email || "kavihari155@gmail.com";
  const address = settings?.address || "KG Valasu, Erode";
  const whatsappNumber = settings?.whatsapp ? settings.whatsapp.replace(/\D/g, "") : "917010992575";
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <section className="hero-section" style={{ backgroundImage: `linear-gradient(90deg, rgba(4, 18, 32, 0.9), rgba(4, 18, 32, 0.42)), url(${heroImage})` }}>
      <div className="container hero-layout">
        <div className="hero-content">
          <span className="eyebrow">{settings?.companyName || "GK Constructions"}</span>
          <h1>Building Smart.<span>Designing Better.</span></h1>
          <p>{settings?.about || "We provide high quality construction, innovative design and reliable engineering solutions."}</p>
          <div className="hero-actions">
            <Link className="btn btn-gold" to="/projects">View Projects</Link>
            <a className="btn btn-outline-light" href={whatsappLink} target="_blank" rel="noreferrer" aria-label="Chat with GK Constructions on WhatsApp">
              <FaWhatsapp /> WhatsApp
            </a>
          </div>
        </div>

        <aside className="hero-profile-card">
          <h2>{settings?.ownerName || "L. Kaviyarasu"}</h2>
          <p>{settings?.engineerDetails || "B.E. Civil Engineer"}</p>
          <ul>
            <li><FaPhoneAlt /> {phone}</li>
            <li><FaEnvelope /> {email}</li>
            <li><FaMapMarkerAlt /> {address}</li>
          </ul>
        </aside>
      </div>
    </section>
  );
}

export default Hero;
