import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";

const fallbackImage = "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80";

function formatDate(value) {
  if (!value) return "To be updated";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function pickImages(project) {
  const images = [project?.image, project?.coverImage, ...(project?.images || []), ...(project?.gallery || [])].filter(Boolean);
  return [...new Set(images)];
}

function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/projects/${id}`)
      .then((res) => {
        setProject(res.data.project || res.data);
      })
      .catch(() => {
        setError("Project details could not be loaded.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const images = pickImages(project);
  const documents = project?.documents || project?.docs || [];

  return (
    <>
      <Navbar />
      <main>
        {loading && <section className="section"><div className="container loading-card">Loading project details...</div></section>}
        {error && !loading && <section className="section"><div className="container empty-state">{error}</div></section>}

        {project && (
          <>
            <section className="details-hero">
              <img src={images[0] || fallbackImage} alt={project.title || project.name || "Project"} />
              <div className="details-overlay">
                <div className="container">
                  <Link to="/projects" className="back-link">Back to Projects</Link>
                  <h1>{project.title || project.name}</h1>
                  <div className="badge-row">
                    <span className="category-badge">{project.category || "Construction"}</span>
                    <span className="status-badge">{project.status || "Ongoing"}</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="section">
              <div className="container project-detail-grid">
                <article className="detail-panel">
                  <h2>Project Overview</h2>
                  <p>{project.description || "Project description will be updated soon."}</p>
                </article>

                <aside className="detail-panel facts-panel">
                  <h2>Project Facts</h2>
                  <dl>
                    <div><dt>Location</dt><dd>{project.location || "To be updated"}</dd></div>
                    <div><dt>Client</dt><dd>{project.client || "Private Client"}</dd></div>
                    <div><dt>Start Date</dt><dd>{formatDate(project.startDate)}</dd></div>
                    <div><dt>Completion Date</dt><dd>{formatDate(project.completionDate || project.endDate)}</dd></div>
                    <div><dt>Project Area</dt><dd>{project.area || project.projectArea || "To be updated"}</dd></div>
                    <div><dt>Budget</dt><dd>{project.budget || project.budgetInfo || "To be updated"}</dd></div>
                  </dl>
                </aside>
              </div>
            </section>

            <section className="section muted-section">
              <div className="container">
                <div className="section-heading">
                  <span className="section-kicker">Gallery</span>
                  <h2>Project Images</h2>
                </div>
                <div className="gallery-grid">
                  {(images.length ? images : [fallbackImage]).map((image) => (
                    <img src={image} alt="Project gallery" key={image} />
                  ))}
                </div>
              </div>
            </section>

            <section className="section">
              <div className="container detail-panel">
                <h2>Documents</h2>
                {documents.length === 0 && <p>No documents have been uploaded for this project yet.</p>}
                <div className="documents-list">
                  {documents.map((document, index) => (
                    <a href={document.url || document} target="_blank" rel="noreferrer" key={document.url || document}>
                      {document.name || `Project Document ${index + 1}`}
                    </a>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}

export default ProjectDetails;
