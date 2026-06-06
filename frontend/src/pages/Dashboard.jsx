/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell, FaChartLine, FaFolderPlus, FaImages, FaSignOutAlt, FaTrash, FaEdit, FaCog, FaEnvelopeOpenText, FaCheck, FaEye, FaPhoneAlt, FaTimes } from "react-icons/fa";
import api from "../services/api";

const initialForm = {
  title: "",
  category: "",
  location: "",
  status: "Ongoing",
  description: "",
  image: "",
  documents: "",
  client: "",
  startDate: "",
  completionDate: "",
  area: "",
  budget: "",
};

const initialSettings = {
  companyName: "GK Constructions",
  phone: "+91 9876543210",
  email: "kavihari155@gmail.com",
  address: "KG Valasu, Erode",
  ownerName: "L. Kaviyarasu",
  engineerDetails: "B.E. Civil Engineer",
  qualification: "B.E. Civil Engineer",
  experience: "Construction planning, design, and site supervision",
  skills: ["Residential Construction", "Commercial Construction", "Interior Design", "2D Planning", "3D Elevation", "Site Supervision"],
  profilePhoto: "",
  about: "Professional construction, design and engineering solutions.",
  whatsapp: "+919876543210",
};

const initialServiceForm = {
  title: "",
  description: "",
  image: "",
  icon: "",
};

function Dashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [settings, setSettings] = useState(initialSettings);
  const [services, setServices] = useState([]);
  const [serviceForm, setServiceForm] = useState(initialServiceForm);
  const [galleryForm, setGalleryForm] = useState({ title: "", url: "", file: null });
  const [documentForm, setDocumentForm] = useState({ name: "", url: "", file: null });
  const [projectImageFile, setProjectImageFile] = useState(null);
  const [projectDocumentFile, setProjectDocumentFile] = useState(null);
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [enquiries, setEnquiries] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const loadProjects = async () => {
    const res = await api.get("/projects");
    setProjects(Array.isArray(res.data) ? res.data : res.data.projects || []);
  };

  useEffect(() => {
    loadProjects().catch(() => setMessage("Unable to load projects."));
    api.get("/settings").then((res) => setSettings({ ...initialSettings, ...(res.data.settings || res.data) })).catch(() => {});
    api.get("/services").then((res) => setServices(Array.isArray(res.data) ? res.data : res.data.services || [])).catch(() => {});
    api.get("/enquiries").then((res) => setEnquiries(Array.isArray(res.data) ? res.data : res.data.enquiries || [])).catch(() => {});
    api.get("/service-requests").then((res) => setServiceRequests(Array.isArray(res.data) ? res.data : res.data.requests || [])).catch(() => {});
  }, []);

  const totals = useMemo(() => ({
    total: projects.length,
    completed: projects.filter((project) => String(project.status).toLowerCase() === "completed").length,
    ongoing: projects.filter((project) => String(project.status).toLowerCase() === "ongoing").length,
    messages: enquiries.length,
  }), [projects, enquiries]);

  const requestStats = useMemo(() => ({
    total: serviceRequests.length,
    newRequests: serviceRequests.filter((request) => request.status === "New Request").length,
    pending: serviceRequests.filter((request) => ["New Request", "Under Review", "Contacted"].includes(request.status)).length,
    accepted: serviceRequests.filter((request) => request.status === "Accepted").length,
    completed: serviceRequests.filter((request) => request.status === "Completed").length,
  }), [serviceRequests]);

  const notifications = useMemo(() => [
    ...serviceRequests
      .filter((request) => request.status === "New Request" || !request.status)
      .map((request) => ({ type: "New Service Request", text: `${request.name || "Customer"} requested ${request.service || "a service"}` })),
    ...enquiries
      .filter((item) => item.status === "Pending" || !item.status)
      .map((item) => ({ type: "New Contact Message", text: `${item.name || item.email || "Visitor"} sent an enquiry` })),
  ], [serviceRequests, enquiries]);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setProjectImageFile(null);
    setProjectDocumentFile(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const payload = {
      ...form,
      name: form.title,
      images: form.image ? [form.image] : [],
      documents: form.documents
        ? form.documents.split(",").map((item) => item.trim()).filter(Boolean)
        : [],
    };

    // If admin selected a project image file, upload it first and use returned URL
    try {
      if (projectImageFile) {
        const fd = new FormData();
        fd.append("file", projectImageFile);
        const res = await api.post("/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
        const url = res.data.url || (res.data.file && res.data.file.url) || "";
        if (url) payload.images = [url];
      }

      // If a single project document file was selected, upload and append
      if (projectDocumentFile) {
        const fd2 = new FormData();
        fd2.append("file", projectDocumentFile);
        const res2 = await api.post("/upload", fd2, { headers: { "Content-Type": "multipart/form-data" } });
        const docUrl = res2.data.url || (res2.data.file && res2.data.file.url) || "";
        if (docUrl) payload.documents = [...payload.documents, docUrl];
      }
    } catch {
      setMessage("File upload failed. Try again.");
      setLoading(false);
      return;
    }
    try {
      if (editingId) {
        await api.put(`/projects/${editingId}`, payload);
        setMessage("Project updated successfully.");
      } else {
        await api.post("/projects", payload);
        setMessage("Project added successfully.");
      }
      resetForm();
      await loadProjects();
    } catch {
      setMessage("Unable to save project.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project) => {
    setEditingId(project._id || project.id);
    setForm({
      title: project.title || project.name || "",
      category: project.category || "",
      location: project.location || "",
      status: project.status || "Ongoing",
      description: project.description || "",
      image: project.image || project.coverImage || project.images?.[0] || "",
      documents: (project.documents || []).map((doc) => doc.url || doc).join(", "),
      client: project.client || "",
      startDate: project.startDate ? String(project.startDate).slice(0, 10) : "",
      completionDate: project.completionDate ? String(project.completionDate).slice(0, 10) : "",
      area: project.area || "",
      budget: project.budget || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this project?");
    if (!confirmed) return;

    try {
      await api.delete(`/projects/${id}`);
      setProjects((items) => items.filter((project) => (project._id || project.id) !== id));
      setMessage("Project deleted successfully.");
    } catch {
      setMessage("Unable to delete project.");
    }
  };

  const saveSettings = async (event) => {
    event.preventDefault();
    try {
      let nextSettings = settings;
      if (profilePhotoFile) {
        const fd = new FormData();
        fd.append("file", profilePhotoFile);
        const res = await api.post("/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
        const url = res.data.url || (res.data.file && res.data.file.url) || "";
        if (url) nextSettings = { ...nextSettings, profilePhoto: url };
      }
      const payload = {
        ...nextSettings,
        skills: Array.isArray(nextSettings.skills)
          ? nextSettings.skills
          : String(nextSettings.skills || "").split(",").map((item) => item.trim()).filter(Boolean),
      };
      await api.put("/settings", payload);
      setSettings(payload);
      setProfilePhotoFile(null);
      setMessage("Website settings updated successfully.");
    } catch {
      setMessage("Unable to save settings.");
    }
  };

  const saveService = async (event) => {
    event.preventDefault();
    try {
      const res = await api.post("/services", serviceForm);
      setServices([res.data.service || res.data || serviceForm, ...services]);
      setServiceForm(initialServiceForm);
      setMessage("Service added successfully.");
    } catch {
      setMessage("Unable to save service. Add POST /services in backend.");
    }
  };

  const deleteService = async (id) => {
    try {
      await api.delete(`/services/${id}`);
      setServices((items) => items.filter((service) => (service._id || service.id) !== id));
    } catch {
      setMessage("Unable to delete service.");
    }
  };

  const uploadGallery = async (event) => {
    event.preventDefault();
    try {
      let url = galleryForm.url;
      if (galleryForm.file) {
        const fd = new FormData();
        fd.append("file", galleryForm.file);
        const res = await api.post("/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
        url = res.data.url || (res.data.file && res.data.file.url) || url;
      }
      await api.post("/gallery", { title: galleryForm.title, url });
      setGalleryForm({ title: "", url: "", file: null });
      setMessage("Gallery photo added successfully.");
    } catch {
      setMessage("Unable to upload gallery photo. Add POST /gallery in backend.");
    }
  };

  const uploadDocument = async (event) => {
    event.preventDefault();
    try {
      let url = documentForm.url;
      if (documentForm.file) {
        const fd = new FormData();
        fd.append("file", documentForm.file);
        const res = await api.post("/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
        url = res.data.url || (res.data.file && res.data.file.url) || url;
      }
      await api.post("/documents", { name: documentForm.name, url });
      setDocumentForm({ name: "", url: "", file: null });
      setMessage("Document uploaded successfully.");
    } catch {
      setMessage("Unable to upload document. Add POST /documents in backend.");
    }
  };

  const updateEnquiryStatus = async (id, status) => {
    try {
      await api.put(`/enquiries/${id}`, { status });
      setEnquiries((items) => items.map((item) => (item._id || item.id) === id ? { ...item, status } : item));
    } catch {
      setMessage("Unable to update enquiry status.");
    }
  };

  const updateServiceRequestStatus = async (id, status) => {
    try {
      const res = await api.put(`/service-requests/${id}`, { status });
      setServiceRequests((items) => items.map((item) => (item._id || item.id) === id ? { ...item, status: res.data.request?.status || status } : item));
    } catch {
      setMessage("Unable to update service request status.");
    }
  };

  const deleteServiceRequest = async (id) => {
    try {
      await api.delete(`/service-requests/${id}`);
      setServiceRequests((items) => items.filter((item) => (item._id || item.id) !== id));
    } catch {
      setMessage("Unable to delete service request.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("lk_admin_token");
    localStorage.removeItem("lk_auth_user");
    navigate("/login");
  };

  return (
    <main className="dashboard-page">
      <aside className="dashboard-sidebar">
        <div className="brand sidebar-brand"><span className="brand-mark">GK</span><span>Admin</span></div>
        <a href="#dashboard"><FaChartLine /> Dashboard</a>
        <a href="#settings"><FaCog /> Profile & Settings</a>
        <a href="#projects"><FaImages /> Projects</a>
        <a href="#add-project"><FaFolderPlus /> Add Project</a>
        <a href="#service-requests"><FaEnvelopeOpenText /> Service Requests</a>
        <a href="#categories">Services</a>
        <a href="#gallery"><FaImages /> Gallery</a>
        <a href="#documents">Documents</a>
        <a href="#messages"><FaEnvelopeOpenText /> Messages</a>
        <button onClick={handleLogout}><FaSignOutAlt /> Logout</button>
      </aside>

      <section className="dashboard-content">
        <div className="dashboard-top" id="dashboard">
          <div>
            <span className="section-kicker">Admin Panel</span>
            <h1>GK Constructions Dashboard</h1>
            <p className="dashboard-notice"><FaBell /> {notifications.length} unread notification{notifications.length === 1 ? "" : "s"}</p>
          </div>
          <button className="btn btn-dark" onClick={loadProjects}>Refresh</button>
        </div>

        <section className="notifications-panel">
          <h2>Notifications</h2>
          {notifications.length ? notifications.slice(0, 6).map((notification, index) => (
            <article className="notification-item unread" key={`${notification.type}-${index}`}>
              <strong>{notification.type}</strong>
              <span>{notification.text}</span>
            </article>
          )) : <p>No unread notifications.</p>}
        </section>

        <div className="dashboard-cards">
          <article><span>Total Projects</span><strong>{totals.total}</strong></article>
          <article><span>Completed</span><strong>{totals.completed}</strong></article>
          <article><span>Ongoing</span><strong>{totals.ongoing}</strong></article>
          <article><span>Messages</span><strong>{totals.messages}</strong></article>
          <article><span>Service Requests</span><strong>{requestStats.total}</strong></article>
          <article><span>Pending Requests</span><strong>{requestStats.pending}</strong></article>
          <article><span>Accepted</span><strong>{requestStats.accepted}</strong></article>
          <article><span>Completed</span><strong>{requestStats.completed}</strong></article>
        </div>

        <section className="table-panel" id="service-requests">
          <h2>Service Requests</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Service</th>
                  <th>Location</th>
                  <th>Budget</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {serviceRequests.map((request) => {
                  const id = request._id || request.id;
                  return (
                    <tr key={id}>
                      <td>{request.name}</td>
                      <td>{request.email}</td>
                      <td>{request.phone}</td>
                      <td>{request.service}</td>
                      <td>{request.location}</td>
                      <td>{request.budget}</td>
                      <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                      <td><span className="status-badge">{request.status || "New Request"}</span></td>
                      <td className="table-actions">
                        <button type="button" onClick={() => setSelectedRequest(request)} title="View Request" aria-label="View request"><FaEye /></button>
                        <button type="button" onClick={() => updateServiceRequestStatus(id, "Contacted")} title="Mark as Contacted" aria-label="Mark as contacted"><FaPhoneAlt /></button>
                        <button type="button" onClick={() => updateServiceRequestStatus(id, "Accepted")} title="Accept Request" aria-label="Accept request"><FaCheck /></button>
                        <button type="button" onClick={() => updateServiceRequestStatus(id, "Rejected")} title="Reject Request" aria-label="Reject request"><FaTimes /></button>
                        <button type="button" onClick={() => updateServiceRequestStatus(id, "Completed")} title="Complete Request" aria-label="Complete request">Done</button>
                        <button type="button" onClick={() => deleteServiceRequest(id)} title="Delete Request" aria-label="Delete request"><FaTrash /></button>
                      </td>
                    </tr>
                  );
                })}
                {!serviceRequests.length && (
                  <tr><td colSpan="9">No service requests yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          {selectedRequest && (
            <article className="request-detail-panel">
              <button type="button" className="panel-close" onClick={() => setSelectedRequest(null)} aria-label="Close request details"><FaTimes /></button>
              <span className="section-kicker">Request Details</span>
              <h3>{selectedRequest.service}</h3>
              <p><strong>Customer:</strong> {selectedRequest.name}</p>
              <p><strong>Email:</strong> {selectedRequest.email}</p>
              <p><strong>Phone:</strong> {selectedRequest.phone}</p>
              <p><strong>Location:</strong> {selectedRequest.location || "Not provided"}</p>
              <p><strong>Budget:</strong> {selectedRequest.budget || "Not provided"}</p>
              <p><strong>Requirements:</strong> {selectedRequest.requirements || "No additional requirements provided."}</p>
            </article>
          )}
        </section>

        <form className="admin-form" id="add-project" onSubmit={handleSubmit}>
          <h2>{editingId ? "Edit Project" : "Add Project"}</h2>
          <div className="form-row">
            <label>Project Name<input name="title" value={form.title} onChange={handleChange} required /></label>
            <label>Category<input name="category" value={form.category} onChange={handleChange} required /></label>
          </div>
          <div className="form-row">
            <label>Location<input name="location" value={form.location} onChange={handleChange} required /></label>
            <label>Status<select name="status" value={form.status} onChange={handleChange}><option>Ongoing</option><option>Completed</option><option>Planning</option></select></label>
          </div>
          <div className="form-row">
            <label>Client Information<input name="client" value={form.client} onChange={handleChange} /></label>
            <label>Area Details<input name="area" value={form.area} onChange={handleChange} placeholder="1200 sq.ft" /></label>
          </div>
          <div className="form-row">
            <label>Start Date<input type="date" name="startDate" value={form.startDate} onChange={handleChange} /></label>
            <label>Completion Date<input type="date" name="completionDate" value={form.completionDate} onChange={handleChange} /></label>
          </div>
          <label>Budget Information<input name="budget" value={form.budget} onChange={handleChange} /></label>
          <label>Description<textarea name="description" rows="4" value={form.description} onChange={handleChange} required /></label>
          <div className="form-row">
            <label>Upload Images<input name="image" value={form.image} onChange={handleChange} placeholder="Image URL" /></label>
            <label>Upload Image File<input type="file" accept="image/*" onChange={(e) => setProjectImageFile(e.target.files[0])} /></label>
            <label>Upload Documents<input name="documents" value={form.documents} onChange={handleChange} placeholder="Document URLs, comma separated" /></label>
            <label>Upload Document File<input type="file" onChange={(e) => setProjectDocumentFile(e.target.files[0])} /></label>
          </div>
          <div className="admin-actions">
            <button className="btn btn-gold" type="submit" disabled={loading}>{loading ? "Saving..." : editingId ? "Update Project" : "Add Project"}</button>
            {editingId && <button className="btn btn-outline-dark" type="button" onClick={resetForm}>Cancel Edit</button>}
          </div>
          {message && <p className="form-status">{message}</p>}
        </form>

        <section className="table-panel" id="projects">
          <h2>Project Management</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => {
                  const id = project._id || project.id;
                  return (
                    <tr key={id}>
                      <td>{project.title || project.name}</td>
                      <td>{project.category}</td>
                      <td>{project.location}</td>
                      <td><span className="status-badge">{project.status || "Ongoing"}</span></td>
                      <td className="table-actions">
                        <button onClick={() => handleEdit(project)} aria-label="Edit project"><FaEdit /></button>
                        <button onClick={() => handleDelete(id)} aria-label="Delete project"><FaTrash /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="dashboard-manage-grid">
          <form className="admin-form" id="settings" onSubmit={saveSettings}>
            <h2>Profile & Website Settings</h2>
            <div className="form-row">
              <label>Company Name<input value={settings.companyName} onChange={(event) => setSettings({ ...settings, companyName: event.target.value })} /></label>
              <label>Phone<input value={settings.phone} onChange={(event) => setSettings({ ...settings, phone: event.target.value })} /></label>
            </div>
            <div className="form-row">
              <label>Email<input value={settings.email} onChange={(event) => setSettings({ ...settings, email: event.target.value })} /></label>
              <label>WhatsApp<input value={settings.whatsapp} onChange={(event) => setSettings({ ...settings, whatsapp: event.target.value })} /></label>
            </div>
            <label>Address<input value={settings.address} onChange={(event) => setSettings({ ...settings, address: event.target.value })} /></label>
            <div className="form-row">
              <label>Owner Name<input value={settings.ownerName} onChange={(event) => setSettings({ ...settings, ownerName: event.target.value })} /></label>
              <label>Qualification<input value={settings.qualification || settings.engineerDetails} onChange={(event) => setSettings({ ...settings, qualification: event.target.value, engineerDetails: event.target.value })} /></label>
            </div>
            <label>Experience<input value={settings.experience || ""} onChange={(event) => setSettings({ ...settings, experience: event.target.value })} /></label>
            <label>Skills<input value={Array.isArray(settings.skills) ? settings.skills.join(", ") : settings.skills || ""} onChange={(event) => setSettings({ ...settings, skills: event.target.value })} placeholder="Residential Construction, 2D Planning, Site Supervision" /></label>
            <div className="form-row">
              <label>Profile Photo URL<input value={settings.profilePhoto || ""} onChange={(event) => setSettings({ ...settings, profilePhoto: event.target.value })} /></label>
              <label>Upload Profile Photo<input type="file" accept="image/*" onChange={(event) => setProfilePhotoFile(event.target.files[0])} /></label>
            </div>
            <div className="form-row">
              <label>LinkedIn URL<input value={settings.socialLinks?.linkedin || ""} onChange={(event) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, linkedin: event.target.value } })} /></label>
              <label>Instagram URL<input value={settings.socialLinks?.instagram || ""} onChange={(event) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, instagram: event.target.value } })} /></label>
            </div>
            <label>Professional Description<textarea rows="4" value={settings.about} onChange={(event) => setSettings({ ...settings, about: event.target.value })} /></label>
            <button className="btn btn-gold" type="submit">Save Settings</button>
          </form>

          <form className="admin-form" id="categories" onSubmit={saveService}>
            <h2>Service Management</h2>
            <label>Service Name<input value={serviceForm.title} onChange={(event) => setServiceForm({ ...serviceForm, title: event.target.value })} required /></label>
            <label>Service Image URL<input value={serviceForm.image} onChange={(event) => setServiceForm({ ...serviceForm, image: event.target.value })} /></label>
            <label>Service Icon Name<input value={serviceForm.icon} onChange={(event) => setServiceForm({ ...serviceForm, icon: event.target.value })} placeholder="Building, Hammer, Interior" /></label>
            <label>Description<textarea rows="4" value={serviceForm.description} onChange={(event) => setServiceForm({ ...serviceForm, description: event.target.value })} required /></label>
            <button className="btn btn-gold" type="submit">Add Service</button>
            <div className="mini-list">
              {services.map((service) => (
                <div key={service._id || service.id || service.title}>
                  <span>{service.title || service.name}</span>
                  {(service._id || service.id) && <button type="button" onClick={() => deleteService(service._id || service.id)}>Delete</button>}
                </div>
              ))}
            </div>
          </form>

          <form className="admin-form" id="gallery" onSubmit={uploadGallery}>
            <h2>Gallery Management</h2>
            <label>Photo Title<input value={galleryForm.title} onChange={(event) => setGalleryForm({ ...galleryForm, title: event.target.value })} required /></label>
            <label>Image URL / Uploaded File URL<input value={galleryForm.url} onChange={(event) => setGalleryForm({ ...galleryForm, url: event.target.value })} required /></label>
            <label>Upload File<input type="file" accept="image/*,video/*" onChange={(event) => setGalleryForm({ ...galleryForm, file: event.target.files[0] })} /></label>
            <button className="btn btn-gold" type="submit">Upload Photo</button>
          </form>

          <form className="admin-form" id="documents" onSubmit={uploadDocument}>
            <h2>Document Management</h2>
            <label>Document Name<input value={documentForm.name} onChange={(event) => setDocumentForm({ ...documentForm, name: event.target.value })} required /></label>
            <label>PDF / DOCX / XLSX / CAD URL<input value={documentForm.url} onChange={(event) => setDocumentForm({ ...documentForm, url: event.target.value })} required /></label>
            <label>Upload File<input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg" onChange={(event) => setDocumentForm({ ...documentForm, file: event.target.files[0] })} /></label>
            <button className="btn btn-gold" type="submit">Upload Document</button>
          </form>
        </section>

        <section className="table-panel" id="messages">
          <h2>Enquiry Management</h2>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Name</th><th>Request</th><th>Status</th><th>Update</th></tr></thead>
              <tbody>
                {enquiries.map((item) => {
                  const id = item._id || item.id;
                  return (
                    <tr key={id}>
                      <td>{item.name || item.email || "Customer"}</td>
                      <td>{item.service || item.message}</td>
                      <td><span className="status-badge">{item.status || "Pending"}</span></td>
                      <td>
                        <select value={item.status || "Pending"} onChange={(event) => updateEnquiryStatus(id, event.target.value)}>
                          <option>Pending</option>
                          <option>In Review</option>
                          <option>Approved</option>
                          <option>Rejected</option>
                          <option>Completed</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
                {!enquiries.length && <tr><td colSpan="4">No enquiries yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  );
}

export default Dashboard;
