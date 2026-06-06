import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaBars, FaTimes, FaWhatsapp } from "react-icons/fa";
import api from "../services/api";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState(null);
  const token = localStorage.getItem("lk_admin_token") || localStorage.getItem("lk_user_token");
  const user = token ? JSON.parse(localStorage.getItem("lk_auth_user") || "null") : null;

  useEffect(() => {
    api.get("/settings")
      .then((res) => setSettings(res.data.settings || res.data))
      .catch(() => setSettings(null));
  }, []);

  const closeMenu = () => setOpen(false);
  const whatsappNumber = settings?.whatsapp ? settings.whatsapp.replace(/\D/g, "") : "919876543210";
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <header className="site-header">
      <nav className="navbar container">
        <Link to="/" className="brand" onClick={closeMenu}>
          <span className="brand-mark">GK</span>
          <span>{settings?.companyName || "GK Constructions"}</span>
        </Link>

        <button className="nav-toggle" onClick={() => setOpen((value) => !value)} aria-label="Toggle navigation">
          {open ? <FaTimes /> : <FaBars />}
        </button>

        <div className={`nav-links ${open ? "is-open" : ""}`}>
          <NavLink to="/" onClick={closeMenu}>Home</NavLink>
          <NavLink to="/about" onClick={closeMenu}>About</NavLink>
          <NavLink to="/services" onClick={closeMenu}>Services</NavLink>
          <NavLink to="/projects" onClick={closeMenu}>Projects</NavLink>
          <NavLink to="/gallery" onClick={closeMenu}>Gallery</NavLink>
          <NavLink to="/contact" onClick={closeMenu}>Contact</NavLink>
          <NavLink to={user ? "/profile" : "/login"} onClick={closeMenu}>{user ? "Profile" : "Login"}</NavLink>
          <a className="btn btn-whatsapp" href={whatsappLink} target="_blank" rel="noreferrer" onClick={closeMenu}>
            <FaWhatsapp /> <span>Chat on WhatsApp</span>
          </a>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
