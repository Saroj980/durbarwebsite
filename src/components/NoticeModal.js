import React, { useEffect, useState } from "react";
import api from "../api";

export default function NoticeModal() {
  const [notices, setNotices] = useState([]);
  const [current, setCurrent] = useState(0);
  const [show, setShow] = useState(false);

  // ✅ Check if modal was shown within last 24 hours
  useEffect(() => {
    const lastShown = localStorage.getItem("noticeShown");
    if (!lastShown || Date.now() - lastShown > 24 * 60 * 60 * 1000) {
      setShow(true);
    }
  }, []);

  // ✅ Fetch notices from API or fallback
  useEffect(() => {
    api
      .get("/popup-notices")
      .then((res) => setNotices(res.data || []))
      .catch(() =>
        setNotices([])
      );
  }, []);

  // ✅ Auto-slide notices every 5 seconds
  useEffect(() => {
    if (notices.length > 1 && show) {
      const timer = setInterval(() => {
        setCurrent((prev) => (prev + 1) % notices.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [notices, show]);

  const handleNext = () => setCurrent((prev) => (prev + 1) % notices.length);
  const handlePrev = () =>
    setCurrent((prev) => (prev - 1 + notices.length) % notices.length);

  const handleClose = () => {
    setShow(false);
    localStorage.setItem("noticeShown", Date.now()); // ✅ Remember not to show again for 24h
  };

  if (!notices.length || !show) return null;

  const notice = notices[current];

  return (
    <div
      className="modal fade show"
      style={{
        display: "block",
        background: "rgba(0,0,0,0.6)",
        zIndex: 2000,
      }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-3">
          {/* Header */}
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title fw-bold d-flex align-items-center">
                Notices
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={handleClose}
            ></button>
          </div>

          {/* Body */}
          <div className="modal-body text-start p-4">
            {/* <img
              src="/logo.png"
              alt="School Logo"
              style={{ height: 70, marginBottom: 15 }}
            /> */}
            <h5 className="fw-bold mb-3">{notice.title}</h5>
            <p className="text-muted">{notice.description}</p>
          </div>

          {/* Footer */}
          <div className="modal-footer justify-content-between">
            <button
              className="btn btn-outline-primary"
              onClick={handlePrev}
              disabled={notices.length <= 1}
            >
              Previous
            </button>
            <div className="text-muted small">
              Notice {current + 1} of {notices.length}
            </div>
            <button
              className="btn btn-outline-primary"
              onClick={handleNext}
              disabled={notices.length <= 1}
            >
              Next
            </button>
          </div>

          {/* Optional "Don't show again" button */}
          <div className="text-center pb-3">
            <button
              className="btn btn-sm btn-link text-secondary"
              onClick={handleClose}
            >
              Don’t show again today
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
