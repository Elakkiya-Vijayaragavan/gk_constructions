import { Link } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";

const fallbackImage = "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=900&q=80";

function getImage(project) {
  if (project?.image) return project.image;
  if (project?.coverImage) return project.coverImage;
  if (Array.isArray(project?.images) && project.images[0]) return project.images[0];
  if (Array.isArray(project?.gallery) && project.gallery[0]) return project.gallery[0];
  return fallbackImage;
}

function ProjectCard({ project }) {
  const id = project?._id || project?.id;

  return (
    <article className="project-card">
      <Link to={`/projects/${id}`} className="project-image">
        <img src={getImage(project)} alt={project?.title || project?.name || "Construction project"} />
        <span>{project?.category || "Construction"}</span>
      </Link>
      <div className="project-card-body">
        <h3>{project?.title || project?.name || "Untitled Project"}</h3>
        <p><FaMapMarkerAlt /> {project?.location || "Location to be updated"}</p>
        <div className="project-card-footer">
          <span className={`status-badge ${String(project?.status || "").toLowerCase().replace(/\s+/g, "-")}`}>
            {project?.status || "Ongoing"}
          </span>
          <Link to={`/projects/${id}`}>View Details</Link>
        </div>
      </div>
    </article>
  );
}

export default ProjectCard;
