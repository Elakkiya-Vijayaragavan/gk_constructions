/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { FaBuilding, FaCouch, FaHammer, FaHardHat, FaPencilRuler, FaProjectDiagram, FaVectorSquare } from "react-icons/fa";
import api from "../services/api";

const fallbackServices = [
  { icon: <FaBuilding />, title: "Commercial Building Construction", text: "Strong, scalable construction for offices, shops, and business spaces." },
  { icon: <FaHardHat />, title: "Residential Building Construction", text: "Reliable home construction with practical planning and quality site execution." },
  { icon: <FaCouch />, title: "Interior Design", text: "Elegant interiors planned around comfort, function, and finish quality." },
  { icon: <FaHammer />, title: "Renovation Works", text: "Careful upgrades, repairs, and remodels for existing buildings." },
  { icon: <FaProjectDiagram />, title: "Structural Design", text: "Reliable structural planning for safe and efficient builds." },
  { icon: <FaPencilRuler />, title: "2D Floor Planning", text: "Clear floor plans, working drawings, and approval-ready layouts." },
  { icon: <FaVectorSquare />, title: "3D Elevation Design", text: "Realistic elevation concepts to visualize the finished project." },
  { icon: <FaHardHat />, title: "Site Supervision", text: "On-site monitoring to keep quality, timeline, and execution aligned." },
  { icon: <FaProjectDiagram />, title: "Construction Consultancy", text: "Professional advice for budgets, materials, planning, and execution strategy." },
];

const fallbackServiceImages = [
  "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1565182999561-7a9e0d5e0316?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1505842465776-3d4a61ec0adf?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1560185127-6d2285f08b8a?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1503481766315-983c9db3d6c2?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=900&q=80",
];

function Services() {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    location: "",
    budget: "",
    preferredDate: "",
    requirements: "",
  });
  const [bookingMessage, setBookingMessage] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    api.get("/services")
      .then((res) => setServices(res.data.services || res.data || []))
      .catch(() => setServices([]));
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("lk_auth_user") || "null");
    if (user) {
      setBookingForm((current) => ({
        ...current,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
    }
  }, []);

  const handleSelectService = (service) => {
    setSelectedService(service);
    setBookingForm((current) => ({
      ...current,
      service: service.title || service.serviceName || "Service Request",
    }));
    setBookingMessage("");
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  const handleBookingChange = (event) => setBookingForm({ ...bookingForm, [event.target.name]: event.target.value });

  const submitBooking = async (event) => {
    event.preventDefault();
    setBookingLoading(true);
    setBookingMessage("");

    try {
      await api.post("/service-requests", {
        name: bookingForm.name,
        email: bookingForm.email,
        phone: bookingForm.phone,
        service: bookingForm.service,
        location: bookingForm.location,
        budget: bookingForm.budget,
        preferredDate: bookingForm.preferredDate,
        requirements: bookingForm.requirements,
        status: "New Request",
      });
      setBookingMessage("Your service request has been submitted successfully. Our team will contact you soon.");
      setSelectedService(null);
      setBookingForm((current) => ({
        ...current,
        service: "",
        location: "",
        budget: "",
        preferredDate: "",
        requirements: "",
      }));
    } catch {
      setBookingMessage("Unable to submit your request right now. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  const displayServices = services.length ? services : fallbackServices;

  return (
    <section id="services" className="section services-section">
      <div className="container">
        <div className="section-heading">
          <span className="section-kicker">Our Services</span>
          <h2>Complete construction and design services</h2>
          <p>From first plan to final finish, we manage the details that make buildings dependable and refined.</p>
        </div>

        <div className="service-grid">
          {displayServices.map((service, index) => (
            <article className="service-card" key={service._id || service.title || index}>
              <div className="service-image">
                <img src={service.image || fallbackServiceImages[index % fallbackServiceImages.length]} alt={service.title || service.serviceName || "Service"} />
              </div>
              <div className="service-card-body">
                <span className="service-icon">{service.icon || service.iconName || fallbackServices[index % fallbackServices.length].icon}</span>
                <h3>{service.title || service.serviceName || "Construction Service"}</h3>
                <p>{service.description || "A professional service tailored by the owner."}</p>
                <button className="btn btn-outline-dark" type="button" onClick={() => handleSelectService(service)}>
                  Book Service
                </button>
              </div>
            </article>
          ))}
        </div>

        {selectedService && (
          <div className="booking-panel">
            <div className="section-heading">
              <span className="section-kicker">Book Service</span>
              <h2>Request {selectedService.title || selectedService.serviceName}</h2>
              <p>Complete the booking form and we will follow up with a consultation.</p>
            </div>

            <form className="contact-form booking-form" onSubmit={submitBooking}>
              <div className="form-row">
                <label>Full Name<input name="name" value={bookingForm.name} onChange={handleBookingChange} required /></label>
                <label>Email Address<input type="email" name="email" value={bookingForm.email} onChange={handleBookingChange} required /></label>
              </div>
              <div className="form-row">
                <label>Phone Number<input name="phone" value={bookingForm.phone} onChange={handleBookingChange} required /></label>
                <label>Service Name<input name="service" value={bookingForm.service} readOnly /></label>
              </div>
              <div className="form-row">
                <label>Project Location<input name="location" value={bookingForm.location} onChange={handleBookingChange} required /></label>
                <label>Estimated Budget<input name="budget" value={bookingForm.budget} onChange={handleBookingChange} required /></label>
              </div>
              <div className="form-row">
                <label>Preferred Date<input type="date" name="preferredDate" value={bookingForm.preferredDate} onChange={handleBookingChange} required /></label>
                <label>Additional Requirements<textarea name="requirements" rows="4" value={bookingForm.requirements} onChange={handleBookingChange} /></label>
              </div>
              <div className="admin-actions">
                <button className="btn btn-gold" type="submit" disabled={bookingLoading}>{bookingLoading ? "Submitting..." : "Submit Request"}</button>
                <button className="btn btn-outline-dark" type="button" onClick={() => setSelectedService(null)}>Cancel</button>
              </div>
              {bookingMessage && <p className="form-status">{bookingMessage}</p>}
            </form>
          </div>
        )}
      </div>
    </section>
  );
}

export default Services;
