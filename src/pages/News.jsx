import React, { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import { FaCalendarAlt, FaFireAlt, FaArrowRight } from "react-icons/fa";
import "../css/NewsPage.css";

export default function News() {
  const [news, setNews] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [trending, setTrending] = useState([]);
  const base = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    window.scrollTo(0, 0);

    api.get("/news")
      .then((res) => {
        const all = res.data || [];
        
        setFeatured(all.filter(n => n.is_featured === 1));
        setTrending(all.filter(n => n.is_trending === 1));
        setNews(all.filter(n => n.is_featured !== 1)); // exclude featured from main list
      })
      .catch(() => setNews([]));
  }, []);

  const isNew = (date) => {
    const diffDays = (new Date() - new Date(date)) / 86400000;
    return diffDays <= 7;
  };

  return (
    <PageTransition>
      <div className="news-page container" style={{ paddingTop: "80px" }}>

        {/* ------------------ PAGE TITLE ------------------ */}
        <h2 className="section-heading text-center mb-5" data-aos="fade-up">
          <span>Latest News & Updates</span>
        </h2>

        {/* =====================================================
                  FEATURED NEWS SECTION
        ====================================================== */}
        {featured.length > 0 && (
          <section className="featured-modern-section mb-5">

            <h3 className="featured-main-heading" data-aos="fade-right">
              Featured News
            </h3>

            {featured.map((f, i) => (
              <Link to={`/news/${f.id}`} key={f.id} className="featured-modern-link">
                <div
                  className="featured-modern-card shadow-lg"
                  data-aos="fade-up"
                  data-aos-delay={i * 60}
                >

                  {/* IMAGE */}
                  <div className="featured-modern-image-wrapper">
                    <img
                      src={`${base}storage/${f.image_url}`}
                      alt={f.title}
                      className="featured-modern-image"
                    />

                    <span className="featured-chip">
                      FEATURED
                    </span>
                  </div>

                  {/* CONTENT */}
                  <div className="featured-modern-content">
                    <h2 className="featured-modern-title">
                      {f.title}
                    </h2>

                    <p className="featured-modern-date">
                      <FaCalendarAlt /> {new Date(f.published_at).toLocaleDateString()}
                    </p>

                    <p className="featured-modern-summary">
                      {f.summary}
                    </p>

                    <div className="featured-modern-readmore">
                      Read Full Article →
                    </div>
                  </div>

                </div>
              </Link>
            ))}

          </section>
        )}


        <div className="row g-4">

          {/* =====================================================
                          MAIN NEWS GRID
          ====================================================== */}
          <div className="col-lg-8">
            <div className="row g-4">
              {news.map((n, i) => (
                <div className="col-md-6" key={n.id} data-aos="fade-up" data-aos-delay={i * 60}>

                  <Link to={`/news/${n.id}`} className="news-card-link">
                    <div className="news-card-modern shadow-sm">

                      <div className="news-img-box">
                        <img src={`${base}storage/${n.image_url}`} className="news-img" alt={n.title} />

                        {isNew(n.published_at) && (
                          <span className="badge-new-modern">NEW</span>
                        )}

                        {n.is_trending === 1 && (
                          <span className="badge-trending-modern">
                            <FaFireAlt /> Trending
                          </span>
                        )}
                      </div>

                      <div className="news-info p-3">
                        <h5 className="news-title-modern">{n.title}</h5>

                        <p className="news-date-modern">
                          <FaCalendarAlt className="me-2" />
                          {new Date(n.published_at).toLocaleDateString()}
                        </p>

                        <p className="news-summary-modern">{n.summary}</p>

                        <div className="news-readmore-modern">
                          Read More <FaArrowRight className="ms-1" />
                        </div>
                      </div>

                    </div>
                  </Link>

                </div>
              ))}
            </div>
          </div>

          {/* =====================================================
                          TRENDING SIDEBAR
          ====================================================== */}
          <div className="col-lg-4">
            <div className="trending-box sticky-top" data-aos="fade-left">
              <h4 className="trending-title">
                <FaFireAlt className="me-2" /> Trending News
              </h4>

              {trending.length === 0 && (
                <p className="text-muted small">No trending items.</p>
              )}

              {trending.map((t, i) => (
                <Link to={`/news/${t.id}`} key={t.id} className="trending-item-link">
                  <div className="trending-item" data-aos="fade-left" data-aos-delay={i * 60}>

                    <img
                      src={`${base}storage/${t.image_url}`}
                      alt={t.title}
                      className="trending-thumb"
                    />

                    <div>
                      <h6 className="trending-title-text">{t.title}</h6>
                      <p className="trending-date">
                        {new Date(t.published_at).toLocaleDateString()}
                      </p>
                    </div>

                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </PageTransition>
  );
}
