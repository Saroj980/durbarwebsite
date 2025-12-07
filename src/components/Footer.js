import React, { useEffect, useState } from "react";
import api from "../api";
import { FaPhoneAlt, FaEnvelope, FaFacebookF } from "react-icons/fa";

export default function Footer() {
  const [info, setInfo] = useState(null);
  const baseURL = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000";

  useEffect(() => {
    api.get("/school-info")
      .then((res) => setInfo(res.data))
      .catch((err) => console.error(err));
  }, []);

  if (!info)
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary"></div>
      </div>
    );

  // Google Map Logic
  const encodedAddress = encodeURIComponent(info.address || "");
  const schoolName = encodeURIComponent(info.school_name || "");
  const mapURL = info.map_url
    ? info.map_url
    : `https://www.google.com/maps?q=${encodedAddress}(${schoolName})&z=15&output=embed`;

  return (
    <>
      <footer className="footer-gradient text-light pt-5 pb-4">
        <div className="container">
          <div className="row gy-5">

            {/* ------------------ COLUMN 1: INFORMATION OFFICER ------------------ */}
            <div className="col-md-4" data-aos="fade-up">
  <h4 className="footer-title mb-3">INFORMATION OFFICER</h4>

  <div className="info-officer-horizontal d-flex align-items-center gap-3 p-3">
    {info.info_photo && (
      <img
        src={`${baseURL}storage/${info.info_photo}`}
        alt="Officer"
        className="officer-photo-horizontal"
      />
    )}

    <div>
      <h5 className="mb-1 fw-bold text-light">{info.info_officer}</h5>
      <p className="text-light small mb-1">Information Officer</p>
      <p className="fw-semibold text-light mb-0">
        <FaPhoneAlt className="me-2" />
        {info.info_phone}
      </p>
    </div>
  </div>
</div>

            {/* ------------------ COLUMN 2: CONTACT US ------------------ */}
            <div className="col-md-4" data-aos="fade-up" data-aos-delay="150">
              <h4 className="footer-title mb-3">CONTACT US</h4>

              <p className="footer-line">
                {info.address}
              </p>

              <p className="footer-line">
                <FaPhoneAlt className="me-2" /> {info.contact_number}
              </p>

              <p className="footer-line">
                <FaEnvelope className="me-2" /> {info.email}
              </p>

              {info.facebook && (
                <a
                  href={info.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="footer-social"
                >
                  <FaFacebookF />
                </a>
              )}
            </div>

            {/* ------------------ COLUMN 3: GOOGLE MAP ------------------ */}
            <div className="col-md-4" data-aos="fade-up" data-aos-delay="250">
              <h4 className="footer-title mb-3">FIND US</h4>

              <div className="map-wrapper shadow-lg rounded-3">
                <iframe
                  src={mapURL}
                  title="School Map"
                  loading="lazy"
                  style={{ width: "100%", height: "260px", border: 0 }}
                ></iframe>
              </div>
            </div>

          </div>
        </div>
      </footer>

      {/* COPYRIGHT */}
      <div className="footer-bottom text-center py-2">
        © {new Date().getFullYear()} {info.school_name}. All Rights Reserved. <br />
        Designed by <span className="fw-semibold text-warning">Blackboard Nepal</span>
      </div>
    </>
  );
}
