import React, { useEffect, useState } from "react";
import api from "../api";
import PageTransition from "../components/PageTransition";
import "../css/GalleryPage.css";

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const base = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    window.scrollTo(0, 0);

    api.get("/gallery")
      .then((res) => setItems(res.data || []))
      .catch(() => setItems([]));
  }, []);

  const openLightbox = (index) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const prevImage = () => {
    setLightboxIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
  };

  const nextImage = () => {
    setLightboxIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
  };

  return (
    <PageTransition>
      <div className="gallery-page" style={{ paddingTop: "80px" }}>
        <div className="container">
          <h2 className="section-heading text-center mb-4">
            <span>Gallery</span>
          </h2>

          <div className="row g-4">
            {items.map((it, i) => (
              <div
                key={it.id}
                className="col-md-4 col-lg-3"
                data-aos="zoom-in"
                data-aos-delay={i * 50}
              >
                <div
                  className="gallery-card shadow-sm"
                  onClick={() => openLightbox(i)}
                >
                  <div className="gallery-img-wrapper">
                    <img
                      src={`${base}storage/${it.image_url}`}
                      alt={it.title || "Gallery Image"}
                      className="gallery-img"
                    />
                  </div>

                  {it.title?.trim() && (
                    <div className="gallery-info p-2">
                      <h6 className="mb-0 text-center">{it.title}</h6>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ---------- LIGHTBOX POPUP ---------- */}
        {lightboxIndex !== null && (
          <div className="lightbox-backdrop" onClick={closeLightbox}>
            <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
              <img
                src={`${base}storage/${items[lightboxIndex].image_url}`}
                alt="Large Preview"
                className="lightbox-img"
              />

              <button className="btn-nav left" onClick={prevImage}>
                ❮
              </button>
              <button className="btn-nav right" onClick={nextImage}>
                ❯
              </button>

              <button className="btn-close-lightbox" onClick={closeLightbox}>
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
