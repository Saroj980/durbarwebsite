import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api"; // ✅ your axios instance

export default function AboutSection() {
  const [schoolInfo, setSchoolInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchoolInfo = async () => {
      try {
        const res = await api.get("/school-info");
        setSchoolInfo(res.data);
      } catch (err) {
        console.error("Failed to load school info:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchoolInfo();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  if (!schoolInfo) return null;

  return (
    <section
      className="about-modern-section position-relative overflow-hidden py-5"
      data-aos="fade-up"
    >
      <div className="container">
        <div className="row align-items-center flex-md-row flex-column-reverse">
          {/* Left Side - Text Content */}
          <div
            className="col-lg-6 col-md-7 about-content"
            data-aos="fade-right"
            data-aos-delay="100"
          >
            <h2 className="fw-bold mb-3 text-primary">
              About Shree Gogal Prasad Model Sec. School
            </h2>

            {/* ✅ Dynamic Texts */}
            <p className="lead text-muted mb-3">
              {schoolInfo.home_about_us1}
            </p>
            <p className="text-muted">{schoolInfo.home_about_us2}</p>

            <Link
              to="/about"
              className="btn btn-primary btn-lg rounded-pill px-4 mt-3 shadow-sm"
              data-aos="zoom-in"
              data-aos-delay="300"
            >
              Learn More →
            </Link>
          </div>

          {/* Right Side - Dynamic Image */}
          <div
            className="col-lg-6 col-md-5 mb-4 mb-md-0"
            data-aos="zoom-in-up"
            data-aos-delay="200"
          >
            <div className="about-image-wrapper position-relative">
              <img
                src={
                  schoolInfo.banner
                    ? `${process.env.REACT_APP_API_BASE_URL}${schoolInfo.banner}`
                    : "/images/bg/about-bg.png"
                }
                alt="Shree Gogal Prasad Model Secondary School"
                className="img-fluid about-image rounded-4 shadow-lg"
              />
              <div className="about-image-overlay"></div>
              <div
                className="about-overlay-text text-white text-center"
                data-aos="fade-up"
                data-aos-delay="400"
              >
                <h3 className="fw-bold mb-1">25+ Years of Excellence</h3>
                <p className="mb-0 small">
                  Empowering students with knowledge and values
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
