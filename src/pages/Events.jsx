import React, { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import "../css/EventsPage.css";
import { FaCalendarAlt } from "react-icons/fa";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const base = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    window.scrollTo(0, 0);

    api.get("/events")
      .then((res) => setEvents(res.data || []))
      .catch(() => setEvents([]));
  }, []);

  // Split events
  const today = new Date();

  const upcoming = events.filter((e) => new Date(e.event_date) >= today);
  const completed = events.filter((e) => new Date(e.event_date) < today);

  return (
    <PageTransition>
      <div className="events-page" style={{ paddingTop: "80px" }}>
        <div className="container">

          <h2 className="section-heading text-center mb-5">
            <span>Our Events</span>
          </h2>

          {/* ---------------- UPCOMING EVENTS ---------------- */}
          <section className="event-section mb-5">
            <h3 className="event-subtitle mb-4" data-aos="fade-right">
              Upcoming Events  
            </h3>

            {upcoming.length === 0 ? (
              <p className="text-muted">No upcoming events.</p>
            ) : (
              <div className="row g-4">
                {upcoming.map((ev, i) => (
                  <div
                    className="col-md-6 col-lg-4"
                    key={ev.id}
                    data-aos="zoom-in"
                    data-aos-delay={i * 60}
                  >
                    <Link to={`/events/${ev.id}`} className="event-card-link">
                      <div className="event-card shadow-sm">
                        <div className="event-img-wrapper">
                          <img
                            src={`${base}storage/${ev.photo}`}
                            alt={ev.title}
                            className="event-img"
                          />
                        </div>

                        <div className="event-body p-3">
                          <h5 className="fw-bold mb-2">{ev.title}</h5>

                          {/* <p className="small text-muted">{ev.description}</p> */}

                          <div className="event-meta mt-3">
                            { <p>
                              <FaCalendarAlt className="me-2 text-primary" />
                              {ev.event_date_nepali}
                            </p>
                            /*<p>
                              <FaClock className="me-2 text-primary" />
                              {ev.event_time}
                            </p>
                            <p>
                              <FaMapMarkerAlt className="me-2 text-primary" />
                              {ev.location}
                            </p> */}
                          </div>
                        </div>

                        <span className="event-badge upcoming">Upcoming</span>
                      </div>
                    </Link>
                    
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ---------------- COMPLETED EVENTS ---------------- */}
          <section className="event-section">
            <h3 className="event-subtitle mb-4" data-aos="fade-right">
              Completed Events
            </h3>

            {completed.length === 0 ? (
              <p className="text-muted">No events completed yet.</p>
            ) : (
              <div className="row g-4">
                {completed.map((ev, i) => (
                  <div
                    className="col-md-6 col-lg-4"
                    key={ev.id}
                    data-aos="fade-up"
                    data-aos-delay={i * 60}
                  >
                    <Link to={`/events/${ev.id}`} className="event-card-link">
                      <div className="event-card shadow-sm completed-card">
                        <div className="event-img-wrapper">
                          <img
                            src={`${base}storage/${ev.photo}`}
                            alt={ev.title}
                            className="event-img"
                          />
                        </div>

                        <div className="event-body p-3">
                          <h5
                            className="fw-bold mb-2 event-title"
                            data-fulltitle={ev.title}
                          >
                            {ev.title}
                          </h5>


                          {/* <p className="small text-muted">{ev.description}</p> */}

                          <div className="event-meta mt-3">
                            <p>
                              <FaCalendarAlt className="me-2 text-primary" />
                              {ev.event_date_nepali}
                            </p>
                          </div>
                        </div>

                        <span className="event-badge completed">Completed</span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </PageTransition>
  );
}
