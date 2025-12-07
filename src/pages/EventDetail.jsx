import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import PageTransition from "../components/PageTransition";
import "../css/EventDetail.css";
import { FaClock, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";

export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const base = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    window.scrollTo(0, 0);

    api.get(`/events/${id}`)
      .then((res) => setEvent(res.data))
      .catch(() => setEvent(null));
  }, [id]);

  if (!event) return null;

  const heroBg = `${base}storage/${event.photo}`;

    // Convert "HH:MM:SS" → "hh:mm AM/PM"
    const formatTime = (timeString) => {
    if (!timeString) return "";
    const [hour, minute] = timeString.split(":");
    let h = parseInt(hour);
    const suffix = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12; 
    return `${h}:${minute} ${suffix}`;
    };


  return (
    <PageTransition>
      <div className="event-detail-page" style={{ paddingTop: "36px" }}>

        {/* ---------------- HERO SECTION ---------------- */}
        <section
          className="event-detail-hero"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)),
              url(${heroBg})
            `,
          }}
        >
          <div className="container text-center">
            <h1 className="fw-bold text-white mb-4" data-aos="fade-down">
              {event.title}
            </h1>

            {/* META BAR */}
            <div
              className="event-meta-bar mx-auto"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="meta-item">
                <FaCalendarAlt /> {event.event_date_nepali}
              </div>
              <div className="meta-item">
                <FaClock /> {formatTime(event.event_time)}
              </div>
              <div className="meta-item">
                ⏳ {event.duration}
              </div>
            </div>

            {/* LOCATION */}
            <p
              className="event-location text-light mt-2"
              data-aos="fade-up"
              data-aos-delay="350"
            >
              <FaMapMarkerAlt className="me-2" />
              {event.location}
            </p>
          </div>
        </section>

        {/* ---------------- MAIN CONTENT ---------------- */}
        <section className="event-detail-content py-5">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                
                <div
                  className="event-description p-4 shadow-sm bg-white"
                  data-aos="fade-up"
                  data-aos-delay="150"
                >
                  <h3 className="fw-bold mb-3">Event Details</h3>

                  <p className="lead text-muted mb-4">
                    {event.description}
                  </p>

                  {/* Details Block */}
                  <div className="details-box mt-4">
                    <h5 className="fw-bold">Event Date & Time</h5>
                    <p>{event.event_date_nepali} • {formatTime(event.event_time)}</p>

                    <h5 className="fw-bold mt-3">Duration</h5>
                    <p>{event.duration}</p>

                    <h5 className="fw-bold mt-3">Location</h5>
                    <p>{event.location}</p>
                  </div>

                </div>

              </div>
            </div>
          </div>
        </section>

      </div>
    </PageTransition>
  );
}
