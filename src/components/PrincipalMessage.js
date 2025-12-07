import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function MessageFromPrincipal() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/principal-message")
      .then((res) => setData(res.data))
      .catch(() => setData(null));
  }, []);

  if (!data) return null;

  return (
    <section className="principal-section py-5">
      <div className="container">
        <div className="text-center mb-5">
        <h2 className="section-heading mb-4">
          <span>Message from the Principal</span>
        </h2>
        </div>

        <div className="principal-card shadow-lg">
          <div className="row g-0">

            {/* LEFT IMAGE WITH AOS */}
            <div
              className="col-lg-5"
              data-aos="fade-right"
            >
              <div className="principal-img-wrapper">
                <img
                  src={`${process.env.REACT_APP_API_BASE_URL}storage/${data.photo}`}
                  alt="Principal"
                  className="principal-img"
                />
              </div>
            </div>

            {/* RIGHT CONTENT WITH AOS */}
            <div className="col-lg-7" data-aos="fade-left">
              <div className="principal-content">

                <h4 className="fw-bold mb-1">{data.name}</h4>
                <div className="underline"></div>

                <h6 className="text-muted mb-4">{data.designation}</h6>

                <p className="principal-text text-muted">
                  {data.short_message}
                </p>

                <Link to="/principal-message">
                  <button className="btn principal-btn mt-3 px-4">
                    Read More
                  </button>
                </Link>

              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
