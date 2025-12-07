import React, { useEffect, useState } from "react";
import api from "../api";
import * as bootstrap from "bootstrap";

export default function CarouselSlider() {
  const [slides, setSlides] = useState([]);
  useEffect(() => {
    api
      .get("/carousel")
      .then((res) => setSlides(res.data || []))
      .catch(() => {
        setSlides([
          {
            id: 1,
            title: "Welcome to Shree Gogal Prasad Model Sec. School",
            subtitle: "A place where learning meets excellence.",
            image_url: "/demo1.jpg",
          },
          {
            id: 2,
            title: "Admissions Open 2082",
            subtitle: "Enroll now for a brighter future.",
            image_url: "/demo2.jpg",
          },
        ]);
      });
  }, []);

  useEffect(() => {
    if (slides.length > 0) {
      const el = document.getElementById("homeCarousel");
      new bootstrap.Carousel(el, {
        interval: 4000,
        ride: "carousel",
        pause: false,
        touch: true,
      });
    }
  }, [slides]);

  if (!slides.length) return null;

  return (
    <div id="homeCarousel" className="carousel slide carousel-fade" data-bs-ride="carousel" style={{ marginTop: "56px" } }>
      {/* Indicators */}
      <div className="carousel-indicators">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            data-bs-target="#homeCarousel"
            data-bs-slide-to={i}
            className={i === 0 ? "active" : ""}
            aria-current={i === 0 ? "true" : "false"}
          ></button>
        ))}
      </div>

      {/* Slides */}
      <div className="carousel-inner">
        {slides.map((s, i) => (
          <div key={s.id} className={`carousel-item ${i === 0 ? "active" : ""}`}>
            <div className="carousel-image-wrapper">
              <img
                src={`${process.env.REACT_APP_API_BASE_URL}storage/${s.image_url}`}
                className="d-block w-100 carousel-image"
                alt={s.title}
              />
              <div className="carousel-gradient-overlay"></div>

              {/* Caption */}
              <div className="carousel-caption d-flex flex-column align-items-center justify-content-center text-center">
                <h2 className="carousel-title" data-aos="fade-up" data-aos-delay="100">
                  {s.title}
                </h2>
                {s.subtitle && (
                  <p className="carousel-subtitle mt-3" data-aos="fade-up" data-aos-delay="300">
                    {s.subtitle}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <button className="carousel-control-prev" type="button" data-bs-target="#homeCarousel" data-bs-slide="prev">
        <span className="carousel-control-prev-icon"></span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#homeCarousel" data-bs-slide="next">
        <span className="carousel-control-next-icon"></span>
      </button>
    </div>
  );
}
