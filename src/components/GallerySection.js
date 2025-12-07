import React, { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

export default function GallerySection() {
  const [gallery, setGallery] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    api
      .get("/gallery")
      .then((res) => {
        setGallery(res.data);
        setTimeout(() => AOS.refresh(), 300);
      })
      .catch((err) => console.error("Error fetching gallery:", err));
  }, []);

  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = () =>
    setLightboxIndex((i) => (i === 0 ? gallery.length - 1 : i - 1));
  const nextImage = () =>
    setLightboxIndex((i) => (i === gallery.length - 1 ? 0 : i + 1));

  return (
    <section className="gallery-section py-5 position-relative overflow-hidden">
      <div className="container text-center">
        <h2 className="section-heading mb-4">
          <span>Our Gallery</span>
        </h2>
        <p className="text-muted mb-5">
          Glimpses of our joyful campus life and achievements.
        </p>

        <div className="row g-4 justify-content-center">
          {gallery.slice(0, 8).map((item, index) => (
            <div
              className="col-lg-3 col-md-4 col-sm-6"
              key={item.id || index}
              onClick={() => openLightbox(index)}
              style={{ cursor: "pointer" }}
              data-aos="fade-up"
              data-aos-delay={(index % 4) * 100} // Staggered wave effect
            >
              <div className="gallery-card shadow-sm">
                <div className="gallery-img-wrapper">
                  <img
                    src={`${process.env.REACT_APP_API_BASE_URL}storage/${item.image_url}`}
                    alt={item.title}
                    className="img-fluid rounded"
                  />
                  <div className="gallery-overlay">
                    <div className="gallery-info">
                      <h6 className="text-white fw-semibold">{item.title}</h6>
                      <p className="text-white small m-0">
                        {item.description?.length > 45
                          ? item.description.substring(0, 45) + "..."
                          : item.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {gallery.length > 8 && (
          <div className="mt-5" data-aos="zoom-in">
            <Link to="/gallery" className="btn-view-all">
              View All →
            </Link>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div className="lightbox-backdrop" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={gallery[lightboxIndex].image_url}
              alt={gallery[lightboxIndex].title}
              className="lightbox-img"
            />
            <h5 className="text-white mt-3">{gallery[lightboxIndex].title}</h5>
            <p className="text-light small mb-3 px-4">
              {gallery[lightboxIndex].description}
            </p>
            <button className="btn-nav left" onClick={prevImage}>
              <FaChevronLeft />
            </button>
            <button className="btn-nav right" onClick={nextImage}>
              <FaChevronRight />
            </button>
            <button className="btn-close-lightbox" onClick={closeLightbox}>
              <FaTimes />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
