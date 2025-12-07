import React, { useEffect, useState } from "react";
import api from "../api";
import PageTransition from "../components/PageTransition";
import "../css/AcademicTeams.css";
import { FaPhoneAlt, FaEnvelope } from "react-icons/fa";

export default function AcademicTeams() {
  const [team, setTeam] = useState([]);
  const base = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    window.scrollTo(0, 0);

    api
      .get("/academic-teams")
      .then((res) => setTeam(res.data || []))
      .catch(() => setTeam([]));
  }, []);
  const heroBg = `${base}storage/images/academic-team-bg.jpg`;
  return (
    <PageTransition>
      <div className="academic-team-page" style={{ paddingTop: "36px" }}>

        {/* ------------------ HERO SECTION ------------------ */}
        <section className="exec-hero" style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)),
            url(${heroBg})
          `,
        }}>
          <div className="container text-center">
            <h1 className="display-5 fw-bold" data-aos="fade-down">
              Our Academic Team
            </h1>
            <p className="lead text-light" data-aos="fade-up">
              Experienced, dedicated and passionate educators guiding our future leaders.
            </p>
          </div>
        </section>

        {/* ------------------ TEAM GRID ------------------ */}
        <section className="team-section py-5">
          <div className="container">
            <div className="row g-4">

              {team.map((member, idx) => (
                <div
                  key={member.id}
                  className="col-md-4 col-lg-3"
                  data-aos="fade-up"
                  data-aos-delay={idx * 80}
                >
                  <div className="team-card shadow-sm">

                    {/* PHOTO */}
                    <div className="team-photo-wrapper">
                      <img
                        src={`${base}storage/${member.photo}`}
                        alt={member.name}
                        className="team-photo"
                      />
                    </div>

                    {/* CONTENT */}
                    <div className="team-body text-center p-3">
                      <h5 className="fw-bold">{member.name}</h5>

                      {member.designation && (
                        <p className="text-muted small mb-1">{member.designation}</p>
                      )}

                      {member.qualification && (
                        <p className="text-secondary small">{member.qualification}</p>
                      )}

                      {/* Contact */}
                      <div className="team-chips mt-3 d-flex flex-column align-items-center gap-2">
                         {member.email && (
                            <a href={`mailto:${member.email}`} className="contact-chip">
                            <FaEnvelope className="me-2" /> {member.email}
                            </a>
                        )}
                        {member.phone && (
                            <a href={`tel:${member.phone}`} className="contact-chip">
                            <FaPhoneAlt className="me-2" /> {member.phone}
                            </a>
                        )}
                        </div>


                    </div>

                  </div>
                </div>
              ))}

            </div>
          </div>
        </section>

      </div>
    </PageTransition>
  );
}
