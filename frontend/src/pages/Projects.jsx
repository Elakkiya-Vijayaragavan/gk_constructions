import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProjectCard from "../components/ProjectCard";
import api from "../services/api";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/projects")
      .then((res) => {
        setProjects(Array.isArray(res.data) ? res.data : res.data.projects || []);
      })
      .catch((err) => {
        console.log(err);
        setError("Projects could not be loaded right now.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const categories = ["All", ...new Set(projects.map((project) => project.category).filter(Boolean))];
  const filteredProjects = projects.filter((project) => {
    const title = project.title || project.name || "";
    const matchesSearch = `${title} ${project.location || ""} ${project.status || ""}`.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || project.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Navbar />
      <main>
        <section className="page-hero">
          <div className="container">
            <span className="section-kicker">Portfolio</span>
            <h1>Projects built with discipline and detail</h1>
            <p>Explore completed, ongoing, and concept-stage works by GK Constructions.</p>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="projects-toolbar">
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by project, location, or status" />
              <div className="filter-buttons">
                {categories.map((item) => (
                  <button className={category === item ? "active" : ""} onClick={() => setCategory(item)} key={item}>
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {loading && <div className="loading-card">Loading projects...</div>}
            {error && !loading && <div className="empty-state">{error}</div>}
            {!loading && !error && filteredProjects.length === 0 && <div className="empty-state">No projects match your search.</div>}

            <div className="projects-grid">
              {filteredProjects.map((project) => (
                <ProjectCard project={project} key={project._id || project.id} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Projects;
