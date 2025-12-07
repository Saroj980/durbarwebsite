import React, { useEffect, useState } from "react";
import api from "../api";
import PageTransition from "../components/PageTransition";
import "../css/Downloads.css";
import { FaDownload, FaEye, FaFilePdf, FaFileAlt, FaFileImage } from "react-icons/fa";

export default function Downloads() {
  const [items, setItems] = useState([]);
  const base = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    window.scrollTo(0, 0);

    api.get("/downloads")
      .then((res) => setItems(res.data || []))
      .catch(() => setItems([]));
  }, []);

  // Utility to get icon based on file extension
  const getFileIcon = (ext) => {
    ext = ext.toLowerCase();
    if (ext === "pdf") return <FaFilePdf className="file-icon pdf" />;
    if (["jpg", "jpeg", "png"].includes(ext)) return <FaFileImage className="file-icon img" />;
    return <FaFileAlt className="file-icon doc" />;
  };

  return (
    <PageTransition>
      <div className="downloads-list-page" style={{ paddingTop: "80px" }}>
        <div className="container">

          <h2 className="section-heading text-center mb-4">
            <span>Downloads & Resources</span>
          </h2>

          <div className="download-list-wrapper">

            {items.length === 0 ? (
              <p className="text-muted text-center">No resources found.</p>
            ) : (
              <ul className="download-list">
                {items.map((file, i) => {
                  const fileURL = `${base}storage/${file.file_url}`;
                  const ext = file.file_url.split(".").pop();

                  return (
                    <li
                      key={file.id}
                      className="download-item"
                      data-aos="fade-up"
                      data-aos-delay={i * 70}
                    >
                      {/* Left: Icon */}
                      <div className="download-icon">
                        {getFileIcon(ext)}
                      </div>

                      {/* Middle: Title + Description */}
                      <div className="download-info">
                        <h5 className="file-title">{file.title}</h5>
                        <p className="file-desc">{file.description}</p>

                        <div className="file-meta">
                          Uploaded on:{" "}
                          {new Date(file.created_at).toLocaleDateString()}
                        </div>
                      </div>

                      {/* Right: Buttons */}
                      <div className="download-actions">
                        <a
                          href={fileURL}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-sm btn-view"
                        >
                          <FaEye className="me-1" /> View
                        </a>

                        <a
                          href={fileURL}
                          download
                          className="btn btn-sm btn-download ms-2"
                        >
                          <FaDownload className="me-1" /> Download
                        </a>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}

          </div>
        </div>
      </div>
    </PageTransition>
  );
}
