import React, { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import api from "../api";
import PageTransition from "../components/PageTransition";
import "../css/ContactUs.css";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import * as bootstrap from "bootstrap";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Load bootstrap JS only here


export default function Contact() {
  const [info, setInfo] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const toastRef = useRef(null);
  const toastInstance = useRef(null);

  // const base = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    window.scrollTo(0, 0);

    api.get("/school-info")
      .then(res => setInfo(res.data))
      .catch(() => setInfo(null));

    setTimeout(() => {
      if (toastRef.current) {
        toastInstance.current = bootstrap.Toast.getOrCreateInstance(toastRef.current);
      }
    }, 100); // small delay to ensure DOM is mounted

  }, []);


  if (!info) return null;

  // Map URL
  const encodedAddress = encodeURIComponent(info.address || "");
  const schoolName = encodeURIComponent(info.school_name || "");
  const mapURL = info.map_url
    ? info.map_url
    : `https://www.google.com/maps?q=${encodedAddress}(${schoolName})&z=15&output=embed`;

  // ------------------ FORM VALIDATION ------------------
  const validate = () => {
    let err = {};

    if (!form.name.trim()) err.name = "Name is required";
    if (!form.email.trim()) {
      err.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      err.email = "Invalid email format";
    }
    if (!form.subject.trim()) err.subject = "Subject is required";
    if (!form.message.trim()) err.message = "Message cannot be empty";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const showToast = (msg, type = "success") => {
    if (!toastRef.current) return;
    if (!toastInstance.current) return;

    const toastEl = toastRef.current;
    toastEl.classList.remove("text-bg-success", "text-bg-danger");
    toastEl.classList.add(`text-bg-${type}`);
    toastEl.querySelector(".toast-body").innerText = msg;
    toastInstance.current.show();
  };

  // ------------------ FORM SUBMIT ------------------
  const submitMessage = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);

      await api.post("/contact-message", form);

      showToast("Message sent successfully!", "success");
      setForm({ name: "", email: "", subject: "", message: "" });

    } catch (err) {
      if (err.response && err.response.status === 422) {
        const errors = err.response.data.errors;

        // Show the first error message
        const firstError = Object.values(errors)[0][0];
        showToast(firstError, "danger");
      } else {
        showToast("Something went wrong!", "danger");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="contact-page" style={{ paddingTop: "80px" }}>
        <div className="container">

          <h2 className="section-heading text-center mb-5">
            <span>Contact Us</span>
          </h2>

          <div className="row g-4">

            {/* ---------------- LEFT INFO ---------------- */}
            <div className="col-lg-5" data-aos="fade-right">
              <div className="contact-info-card shadow-sm">

                <h4 className="fw-bold mb-3">Get In Touch</h4>
                <p className="text-muted mb-4">We’re here to assist you.</p>

                <div className="info-item d-flex mb-3">
                  <FaMapMarkerAlt className="info-icon" />
                  <div>
                    <h6 className="fw-bold mb-1">Address</h6>
                    <p className="text-muted mb-0">{info.address}</p>
                  </div>
                </div>

                <div className="info-item d-flex mb-3">
                  <FaPhoneAlt className="info-icon" />
                  <div>
                    <h6 className="fw-bold mb-1">Phone</h6>
                    <p className="text-muted mb-0">{info.contact_number}</p>
                  </div>
                </div>

                <div className="info-item d-flex mb-3">
                  <FaEnvelope className="info-icon" />
                  <div>
                    <h6 className="fw-bold mb-1">Email</h6>
                    <p className="text-muted mb-0">{info.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ---------------- RIGHT FORM ---------------- */}
            <div className="col-lg-7" data-aos="fade-left">
              <div className="contact-form-card shadow-sm p-4">
                <h4 className="fw-bold mb-4">Send Us a Message</h4>

                <form onSubmit={submitMessage}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <input
                        className={`form-control ${errors.name ? "is-invalid" : ""}`}
                        placeholder="Your Name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                      />
                      {errors.name && <small className="text-danger">{errors.name}</small>}
                    </div>

                    <div className="col-md-6 mb-3">
                      <input
                        className={`form-control ${errors.email ? "is-invalid" : ""}`}
                        placeholder="Email Address"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                      {errors.email && <small className="text-danger">{errors.email}</small>}
                    </div>
                  </div>

                  <div className="mb-3">
                    <input
                      className={`form-control ${errors.subject ? "is-invalid" : ""}`}
                      placeholder="Subject"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    />
                    {errors.subject && <small className="text-danger">{errors.subject}</small>}
                  </div>

                  <div className="mb-3">
                    <textarea
                      className={`form-control ${errors.message ? "is-invalid" : ""}`}
                      placeholder="Your Message"
                      rows="5"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                    />
                    {errors.message && <small className="text-danger">{errors.message}</small>}
                  </div>

                  <button
                    className="btn btn-primary px-4"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send Message"}
                  </button>
                </form>

              </div>
            </div>
          </div>

          {/* ---------------- MAP ---------------- */}
          <div className="map-section mt-5" data-aos="zoom-in">
            <iframe
              src={mapURL}
              title="School Map"
              loading="lazy"
              style={{ width: "100%", height: "380px", border: 0 }}
              className="rounded-4 shadow-sm"
            ></iframe>
          </div>

        </div>

        {/* ----------- TOAST COMPONENT ----------- */}
        {ReactDOM.createPortal(
          <div className="toast-container position-fixed top-0 end-0 p-3" style={{ zIndex: 2000 }}>
            <div
              ref={toastRef}
              className="toast fade text-bg-success border-0 shadow"
              role="alert"
              aria-live="assertive"
              aria-atomic="true"
              data-bs-delay="3000"
              data-bs-autohide="true"
            >
              <div className="d-flex">
                <div className="toast-body fw-semibold"></div>
                <button
                  type="button"
                  className="btn-close btn-close-white me-2 m-auto"
                  data-bs-dismiss="toast"
                  aria-label="Close"
                ></button>
              </div>
            </div>
          </div>,
          document.body
        )}



      </div>
    </PageTransition>
  );
}
