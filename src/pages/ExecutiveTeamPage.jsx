import React, { useEffect, useState } from "react";
import api from "../api";
import "../css/ExecutiveTeam.css";

export default function ExecutiveTeamPage() {
  const [team, setTeam] = useState([]);
  const base = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    window.scrollTo(0, 0);

    api
      .get("/executive-teams")
      .then((res) => setTeam(res.data || []))
      .catch(() => setTeam([]));
  }, []);

  const heroBg = `${base}storage/images/executive-bg.jpg`;

  return (
    <div className="executive-page" style={{ paddingTop: "36px" }}>
      {/* ---------------- HERO ---------------- */}
      <section className="exec-hero" style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)),
            url(${heroBg})
          `,
        }}>
        <div className="container text-center">
          <h1 className="display-5 fw-bold mb-2" data-aos="fade-down">
            Executive Team
          </h1>
          <p className="lead text-light" data-aos="fade-up">
            Leadership dedicated to excellence and innovation
          </p>
        </div>
      </section>

      {/* ---------------- TEAM SECTION ---------------- */}
      <section className="exec-section py-5">
        <div className="container">
          <h2 className="section-heading text-center" data-aos="fade-up">
            Meet Our Leaders
          </h2>
          <div className="underline mx-auto"></div>

          <div className="row g-4 mt-4">
            {team.map((item, i) => (
              <div className="col-md-4" key={i} data-aos="fade-up" data-aos-delay={i * 100}>
                <div className="exec-card">
                  <div className="exec-img-wrapper">
                    <img
                      src={`${base}storage/${item.image}`}
                      alt={item.name}
                      className="exec-img"
                    />
                  </div>

                  <h4 className="exec-name">{item.name}</h4>
                  <p className="exec-position">{item.position}</p>
                  <p className="exec-desc">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
