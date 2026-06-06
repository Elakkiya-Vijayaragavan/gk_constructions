import { useEffect, useState } from "react";
import { FaCheckCircle, FaClock, FaDraftingCompass, FaHandshake } from "react-icons/fa";
import api from "../services/api";

const features = [
  { icon: <FaCheckCircle />, title: "Quality Workmanship", text: "Careful execution, durable materials, and consistent site standards." },
  { icon: <FaClock />, title: "Timely Delivery", text: "Planned schedules and practical coordination from start to handover." },
  { icon: <FaDraftingCompass />, title: "Modern Design", text: "Smart layouts, clean elevations, and functional engineering detail." },
  { icon: <FaHandshake />, title: "Client Satisfaction", text: "Transparent communication and reliable support at every stage." },
];

function About() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    api.get("/settings")
      .then((res) => setSettings(res.data.settings || res.data))
      .catch(() => setSettings(null));
  }, []);

  const skills = Array.isArray(settings?.skills)
    ? settings.skills
    : String(settings?.skills || "Residential Construction, Commercial Construction, Interior Design, 2D Planning, 3D Elevation, Site Supervision")
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

  return (
    <section id="about" className="section about-section">
      <div className="container about-grid">
        <div className="engineer-card">
          <div className="engineer-photo">
            <img src={settings?.profilePhoto || "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=80"} alt={settings?.ownerName || "Kaviyarasu"} />
          </div>
          <div>
            <span className="section-kicker">Engineer Profile</span>
            <h2>{settings?.ownerName || "L. Kaviyarasu"}</h2>
            <p className="designation">{settings?.qualification || settings?.engineerDetails || "B.E Civil Engineer"}</p>
            <div className="profile-facts">
              <p><strong>Experience</strong>{settings?.experience || "Construction planning, design, and site supervision"}</p>
              <p><strong>Phone</strong>{settings?.phone || "+91 98765 43210"}</p>
              <p><strong>Email</strong>{settings?.email || "kavihari155@gmail.com"}</p>
            </div>
          </div>
        </div>

        <div className="about-copy">
          <span className="section-kicker">Professional Profile</span>
          <h2>About {settings?.ownerName || "Kaviyarasu"}</h2>
          <p>
            {settings?.about ||
              "GK Constructions delivers residential, commercial, interior, renovation, planning, and supervision services with a professional construction process. Every project is shaped around safety, build quality, cost clarity, and a finish that feels modern and lasting."}
          </p>
          <div className="skill-list">
            {skills.map((skill) => <span key={skill}>{skill}</span>)}
          </div>

          <div className="feature-grid">
            {features.map((feature) => (
              <article className="feature-card" key={feature.title}>
                <span>{feature.icon}</span>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
