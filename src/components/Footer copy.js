import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { FaFacebookF, FaInstagram } from "react-icons/fa";

export default function Footer() {
  const [info, setInfo] = useState(null);
  const baseURL = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000";

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await api.get("/school-info");
        setInfo(res.data);
      } catch (error) {
        console.error("Error fetching school info:", error);
      }
    };
    fetchInfo();
  }, []);

  if (!info)
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary"></div>
      </div>
    );

  // ✅ Create custom map embed URL with marker and school name
  const encodedAddress = encodeURIComponent(info.address || "");
  const encodedName = encodeURIComponent(info.school_name || "Our School");
  const mapURL = info.map_url
    ? info.map_url
    : `https://www.google.com/maps?q=${encodedAddress}(${encodedName})&t=&z=15&ie=UTF8&iwloc=B&output=embed`;

  return (
    <>
      <footer className="footer-gradient text-light pt-5 pb-3 position-relative">
        <div className="container">
          <div className="row gy-4 align-items-start">
            {/* Column 1: School Info */}
            <div className="col-md-5" data-aos="fade-up" data-aos-delay="100">
              <div className="d-flex align-items-center mb-3">
                {info.logo && (
                  <img
                    src={`${baseURL}/${info.logo}`}
                    alt="School Logo"
                    className="me-2"
                    style={{ height: "60px", borderRadius: "6px" }}
                  />
                )}
                <h5 className="fw-bold mb-0 text-white">{info.school_name}</h5>
              </div>
              <p className="small mb-1">
                <i className="bi bi-geo-alt-fill me-2"></i> {info.address}
              </p>
              <p className="small mb-1">
                <i className="bi bi-telephone-fill me-2"></i> {info.contact_number}
              </p>
              <p className="small mb-3">
                <i className="bi bi-envelope-fill me-2"></i> {info.email}
              </p>

              <div className="d-flex gap-3 mt-2">
                {info.facebook && (
                  <a href={info.facebook} target="_blank" rel="noreferrer" className="social-icon">
                    <FaFacebookF />
                  </a>
                )}
                {info.instagram && (
                  <a href={info.instagram} target="_blank" rel="noreferrer" className="social-icon">
                    <FaInstagram />
                  </a>
                )}
              </div>
            </div>

            {/* Column 2: Useful Links */}
            <div className="col-md-3" data-aos="fade-up" data-aos-delay="200">
              <h5 className="fw-semibold text-white mb-3 position-relative">
                Useful Links
              </h5>
              <ul className="list-unstyled small">
                <li><Link className="footer-link" to="/">› Home</Link></li>
                <li><Link className="footer-link" to="/about">› About Us</Link></li>
                <li><Link className="footer-link" to="/news">› News</Link></li>
                <li><Link className="footer-link" to="/notices">› Notices</Link></li>
                <li><Link className="footer-link" to="/gallery">› Gallery</Link></li>
              </ul>
            </div>

            {/* Column 3: Google Map */}
            <div className="col-md-4" data-aos="fade-up" data-aos-delay="300">
              <h5 className="fw-semibold text-white mb-3 position-relative">
                Find Us
              </h5>
              <div
                className="rounded-4 overflow-hidden shadow border border-light"
                style={{
                  height: "240px",
                  width: "100%",
                  maxWidth: "380px",
                  marginLeft: "auto",
                  marginTop: "10px",
                }}
              >
                <iframe
                  title="School Location"
                  src={mapURL}
                  allowFullScreen
                  loading="lazy"
                  style={{ width: "100%", height: "100%", border: 0 }}
                ></iframe>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-glow"></div>
      </footer>

      {/* Copyright */}
      <div className="py-2 text-center text-white small bg-dark">
        © {new Date().getFullYear()} <strong>{info.school_name}</strong>. All Rights Reserved. <br />
        Designed by{" "}
        <span className="fw-semibold text-warning">Blackboard Nepal Pvt. Ltd.</span>
      </div>
    </>
  );
}
