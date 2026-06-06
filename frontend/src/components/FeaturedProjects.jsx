import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import ProjectCard from "./ProjectCard";

function FeaturedProjects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    api.get("/projects")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.projects || [];
        setProjects(data.slice(0, 3));
      })
      .catch(() => setProjects([]));
  }, []);

  if (!projects.length) return null;

  return (
    <section className="section featured-projects">
      <div className="container">
        <div className="section-heading heading-center">
          <span className="section-kicker">Featured Work</span>
          <h2>Recently managed projects</h2>
          <p>New projects added by the owner appear here automatically.</p>
        </div>
        <div className="projects-grid">
          {projects.map((project) => (
            <ProjectCard project={project} key={project._id || project.id} />
          ))}
        </div>
        <div className="center-actions">
          <Link to="/projects" className="btn btn-outline-dark">View All Projects</Link>
        </div>
      </div>
    </section>
  );
}

export default FeaturedProjects;
