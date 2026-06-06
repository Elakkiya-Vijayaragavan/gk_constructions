import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const fallbackPhotos = [
  { url: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=900&q=80", title: "Modern Site Progress" },
  { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80", title: "Steel Frame Work" },
  { url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80", title: "Premium Interior Finish" },
  { url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80", title: "Exterior Facade Detail" },
];

function GalleryPreview() {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    api.get("/gallery")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.photos || [];
        setPhotos(data.slice(0, 4));
      })
      .catch(() => setPhotos([]));
  }, []);

  const gallery = photos.length ? photos : fallbackPhotos;

  return (
    <section className="section gallery-preview-section">
      <div className="container">
        <div className="section-heading heading-center">
          <span className="section-kicker">Gallery</span>
          <h2>Selected project visuals</h2>
          <p>High-quality images from completed and ongoing construction work, updated directly by the owner.</p>
        </div>

        <div className="gallery-grid">
          {gallery.map((photo, index) => (
            <article className="gallery-tile" key={photo._id || photo.url || index}>
              <img src={photo.url || photo.image || photo} alt={photo.title || "Project photo"} />
              <span>{photo.title || photo.category || "Project Photo"}</span>
            </article>
          ))}
        </div>

        <div className="center-actions">
          <Link to="/gallery" className="btn btn-outline-dark">View Full Gallery</Link>
        </div>
      </div>
    </section>
  );
}

export default GalleryPreview;
