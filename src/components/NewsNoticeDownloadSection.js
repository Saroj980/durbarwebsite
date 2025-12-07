import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaFilePdf, FaDownload, FaCalendarAlt } from "react-icons/fa";
import api from "../api";
import AOS from "aos";
import "aos/dist/aos.css";
import { format, formatDistanceToNow } from "date-fns";

export default function NewsNoticeDownloadSection() {
  const [news, setNews] = useState([]);
  const [notices, setNotices] = useState([]);
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageValid, setImageValid] = useState({});

  useEffect(() => {
    Promise.all([
      api.get("/news").catch(() => ({ data: [] })),
      api.get("/notices").catch(() => ({ data: [] })),
      api.get("/downloads").catch(() => ({ data: [] })),
    ])
      .then(([n, no, d]) => {
        setNews(n.data || []);
        setNotices(no.data || []);
        setDownloads(d.data || []);
        setLoading(false);
        setTimeout(() => AOS.refresh(), 400);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, []);

  // ✅ Helper to check if image exists
  const checkImage = (url, id) => {
    if (!url) {
      setImageValid((prev) => ({ ...prev, [id]: false }));
      return;
    }
    const img = new Image();
    img.onload = () => setImageValid((prev) => ({ ...prev, [id]: true }));
    img.onerror = () => setImageValid((prev) => ({ ...prev, [id]: false }));
    img.src = url;
  };

  // console.log(imageValid);

  // Run image validation after news is fetched
  useEffect(() => {
    news.forEach((n) => checkImage(n.image_url, n.id));
  }, [news]);

  if (loading) return null;

  const hasNews = news.length > 0;
  const hasNotices = notices.length > 0;
  const hasDownloads = downloads.length > 0;

  if (!hasNews && !hasNotices && !hasDownloads) return null;

  return (
    <section className="news-section py-5">
      <div className="container">
        <div className="row g-4">
          {/* ---------- NEWS SECTION ---------- */}
          {hasNews && (
            <div
              className={`${hasNotices || hasDownloads ? "col-lg-8" : "col-12"}`}
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="section-heading mb-0">
                  <span>News</span>
                </h3>
                <Link to="/news" className="btn-more">
                  + More
                </Link>
              </div>

              <div className="row g-3">
                {news.slice(0, 4).map((item, index) => {
                  const dateStr = item.published_at
                    ? format(new Date(item.published_at), "MMM d, yyyy")
                    : "—";
                  const agoTime = item.published_at
                    ? formatDistanceToNow(new Date(item.published_at), {
                        addSuffix: true,
                      })
                    : "";

                  return (
                    <div
                      className="col-md-6"
                      key={item.id || index}
                      data-aos="fade-up"
                      data-aos-delay={(index % 2) * 100}
                    >
                      <div className="news-card shadow-sm h-100 d-flex flex-column">
                        <div className="news-img-wrapper">
                          {/* {`${process.env.REACT_APP_API_BASE_URL}storage/${item.image_url}`} */}
                          {/* {imageValid[item.id] ? ( */}
                            <img
                              // src={item.image_url}
                              src={`${process.env.REACT_APP_API_BASE_URL}storage/${item.image_url}`}
                    
                              alt={item.title}
                              className="news-img"
                            />
                          {/* ) : (
                            <div className="news-placeholder bg-light d-flex align-items-center justify-content-center text-muted">
                              No Image Available
                            </div>
                          )} */}
                        </div>

                        <div className="p-3 flex-grow-1 d-flex flex-column">
                          <h6 className="fw-bold text-dark mb-1">
                            {item.title}
                          </h6>
                          <p className="small text-muted mb-2">
                            {item.summary
                              ? item.summary.slice(0, 80) + "..."
                              : ""}
                          </p>
                          <small className="text-muted mt-auto d-flex align-items-center justify-content-between">
                            <span>
                              <FaCalendarAlt className="me-1 text-warning" />
                              {dateStr}
                            </span>
                            <span className="text-secondary small">{agoTime}</span>
                          </small>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ---------- RIGHT SIDE (NOTICES + DOWNLOADS) ---------- */}
          {(hasNotices || hasDownloads) && (
            <div
              className={`${hasNews ? "col-lg-4" : "col-12"}`}
              data-aos="fade-up"
              data-aos-delay="200"
            >
              {/* Notices */}
              {hasNotices && (
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3 className="section-heading mb-0">
                      <span>Notices</span>
                    </h3>
                    <Link to="/notices" className="btn-more">
                      + More
                    </Link>
                  </div>

                  <div className="notice-box p-3 rounded shadow-sm">
                    {notices.slice(0, 6).map((notice, i) => (
                      <div key={notice.id || i} className="notice-item mb-2">
                        <small className="text-primary fw-semibold d-block">
                          {notice.published_at?.split("T")[0]}
                        </small> 
                        {/* {notice.file_url} */}
                        <p className="small text-muted mb-0">
                          {notice.title.length > 80
                            ? notice.title.substring(0, 80) + "..."
                            : notice.title}
                        </p>
                        <hr className="my-2" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Downloads */}
              {hasDownloads && (
                <div data-aos="fade-up" data-aos-delay="300">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3 className="section-heading mb-0">
                      <span>Downloads</span>
                    </h3>
                    <Link to="/resources" className="btn-more">
                      + More
                    </Link>
                  </div>

                  <div className="downloads-box p-3 rounded shadow-sm">
                    {downloads.slice(0, 6).map((file, i) => (
                      <div
                        key={file.id || i}
                        className="d-flex align-items-center mb-3"
                      >
                        <FaFilePdf className="text-danger me-2 fs-4" />
                        <div className="flex-grow-1">
                          <p className="small text-dark mb-0 fw-semibold">
                            {file.title.length > 50
                              ? file.title.substring(0, 50) + "..."
                              : file.title}
                          </p>
                          <a
                            href={file.file_url}
                            className="text-primary small text-decoration-none"
                            download
                          >
                            <FaDownload className="me-1" /> Download
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
