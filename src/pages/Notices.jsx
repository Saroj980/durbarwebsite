import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import PageTransition from "../components/PageTransition";
import "../css/NoticesPage.css";
import { FaCalendarAlt } from "react-icons/fa";

export default function Notices() {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    api.get("/notices")
      .then((res) => setNotices(res.data || []))
      .catch(() => setNotices([]));
  }, []);

  const isNew = (date) => {
    const diff = (new Date() - new Date(date)) / (1000 * 60 * 60 * 24);
    return diff <= 7;   // 7 days
  };


  return (
    <PageTransition>
      <div className="notices-page container" style={{ paddingTop: "80px" }}>
        
        <h2 className="section-heading text-center mb-4">
          <span>Notices</span>
        </h2>

        <div className="notice-list">
          {notices.map((n, i) => (
            <Link
              to={`/notices/${n.id}`}
              key={n.id}
              className="notice-item"
              data-aos="fade-up"
              data-aos-delay={i * 50}
            >
              <div>
                <h5 className="notice-title mb-1">
                  {n.title}

                  {isNew(n.published_at) && (
                    <span className="notice-badge-new">NEW</span>
                  )}
                </h5>

                <small className="notice-date">
                  <FaCalendarAlt className="me-1 text-primary" />
                  {new Date(n.published_at).toLocaleDateString()}
                </small>
              </div>
            </Link>

          ))}
        </div>

      </div>
    </PageTransition>
  );
}
