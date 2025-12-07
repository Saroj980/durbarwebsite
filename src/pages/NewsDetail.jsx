import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";
import PageTransition from "../components/PageTransition";
import "../css/NewsDetail.css";
import { FaCalendarAlt } from "react-icons/fa";

export default function NewsDetail() {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const base = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    window.scrollTo(0, 0);

    api.get(`/news/${id}`)
      .then((res) => setNews(res.data))
      .catch(() => setNews(null));
  }, [id]);

  if (!news) return null;

  const heroBg = `${base}storage/${news.image_url}`;

  return (
    <PageTransition>
      <div className="news-detail-page" style={{ paddingTop: "36px" }}>

        {/* --------------------- HERO --------------------- */}
        <section
          className="news-hero"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)),
              url(${heroBg})
            `
          }}
        >
          <div className="container text-center">
            <h1 className="fw-bold text-white hero-title" data-aos="fade-down">
              {news.title}
            </h1>

            <p className="text-light mt-2" data-aos="fade-up">
              <FaCalendarAlt className="me-2" />
              {news.published_at ? new Date(news.published_at).toDateString() : ""}
            </p>
          </div>
        </section>

        {/* --------------------- CONTENT --------------------- */}
        <section className="news-main py-5">
          <div className="container">
            <div className="row justify-content-center">

              <div className="col-lg-10">
                <div className="news-article shadow-sm bg-white p-4" data-aos="fade-up">

                  {/* Feature Image */}
                  <div className="news-img-wrapper mb-4">
                    <img
                      src={`${base}storage/${news.image_url}`}
                      className="news-detail-img"
                      alt={news.title}
                    />
                  </div>

                  {/* Full Content */}
                  <div className="news-text">
                    {news.content.split("\n").map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </div>

                {/* Back to list button */}
                <div className="text-center mt-4">
                  <Link to="/news" className="btn back-btn px-4">
                    ← Back to News
                  </Link>
                </div>

              </div>

            </div>
          </div>
        </section>

      </div>
    </PageTransition>
  );
}
