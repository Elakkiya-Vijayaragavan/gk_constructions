import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";

const fallbackPhotos = [
  "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80",
];

function Gallery() {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    api.get("/gallery")
      .then((res) => setPhotos(Array.isArray(res.data) ? res.data : res.data.photos || []))
      .catch(() => setPhotos([]));
  }, []);

  const gallery = photos.length ? photos : fallbackPhotos.map((url) => ({ url, title: "GK Constructions Gallery" }));

  return (
    <>
      <Navbar />
      <main>
        <section className="page-hero">
          <div className="container page-hero-center">
            <h1>Gallery</h1>
            <p>Photos uploaded by the owner appear here automatically.</p>
          </div>
        </section>

        <section className="section">
          <div className="container gallery-grid gallery-page-grid">
            {gallery.map((photo, index) => (
              <article className="gallery-tile" key={photo._id || photo.url || index}>
                <img src={photo.url || photo.image || photo} alt={photo.title || "Construction gallery"} />
                <span>{photo.title || photo.category || "Project Photo"}</span>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Gallery;
