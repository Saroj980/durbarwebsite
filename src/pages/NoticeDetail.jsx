import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import PageTransition from "../components/PageTransition";
import "../css/NoticeDetail.css";
import { FaCalendarAlt, FaDownload } from "react-icons/fa";

export default function NoticeDetail() {
  const { id } = useParams();
  const [notice, setNotice] = useState(null);
  const base = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    window.scrollTo(0, 0);

    api.get(`/notices/${id}`)
      .then((res) => setNotice(res.data))
      .catch(() => setNotice(null));
  }, [id]);

  if (!notice) return null;

  const fileUrl = `${base}storage/${notice.file_url}`;
  const isImage = notice.file_url.match(/\.(jpg|jpeg|png|gif|webp)$/i);

  const isNew = (date) => {
  const diff = (new Date() - new Date(date)) / (1000 * 60 * 60 * 24);
    return diff <= 7;
    };


  return (
    <PageTransition>
      <div className="notice-detail container" style={{ paddingTop: "90px" }}>
        
        <h2 className="fw-bold mb-2" data-aos="fade-down">
        {notice.title}

        {isNew(notice.published_at) && (
            <span className="notice-detail-badge">NEW</span>
        )}
        </h2>


        <p className="text-muted mb-3" data-aos="fade-up">
          <FaCalendarAlt className="me-1" />
          {notice.published_at
            ? new Date(notice.published_at).toLocaleDateString()
            : ""}
        </p>

        {/* IMAGE OR FILE */}
        <div className="notice-file-wrapper mb-4" data-aos="zoom-in">
          {isImage ? (
            <img src={fileUrl} alt={notice.title} className="notice-full-image" />
          ) : (
            <div className="file-preview bg-light p-5 text-center rounded ">
              <i className="bi bi-file-earmark-text fs-1 text-primary"></i>
              <p className="mt-2 text-muted">Preview unavailable</p>
            </div>
          )}
        </div>

        {/* DESCRIPTION */}
        <p className="lead text-muted" data-aos="fade-up">
          {notice.description}
        </p>

        {/* DOWNLOAD */}
        <a
          href={fileUrl}
          target="_blank"
          rel="noreferrer"
          className="btn btn-primary mt-3 px-4"
        >
          <FaDownload className="me-2" />
          View / Download
        </a>
      </div>
    </PageTransition>
  );
}
