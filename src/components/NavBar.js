// src/components/Header.jsx
import React, { useEffect, useRef, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import api from "../api";
import { FaPhoneAlt, FaEnvelope, FaFacebook } from "react-icons/fa";
import * as bootstrap from "bootstrap";
import "bootstrap/js/dist/dropdown";

export default function Header() {
  const [isShrunk, setIsShrunk] = useState(false);
  const [notices, setNotices] = useState([]);
  const [courses, setCourses] = useState([]);

  // NEW: dynamic school info state
  const [info, setInfo] = useState(null);

  const baseURL =
    process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000/";

  // dropdown refs and instance refs
  const sgpssToggleRef = useRef(null);
  const acadToggleRef = useRef(null);
  const sgpssInst = useRef(null);
  const acadInst = useRef(null);

  useEffect(() => {
    api.get("/notices").then((r) => setNotices(r.data || [])).catch(() => {});
    api.get("/courses").then((r) => setCourses(r.data || [])).catch(() => {});

    // FETCH school info (dynamic logo + name + address + phone + email)
    api
      .get("/school-info")
      .then((res) => setInfo(res.data))
      .catch(() => {
        // fallback if API fails
        setInfo({
          school_name: "Shree Gogal Prasad Model Sec. School",
          address: "Janakpurdham-24, Basahiya, Dhanusha",
          contact_number: "9854026151",
          email: "gogalmabi77@gmail.com",
          logo: null,
        });
      });
  }, []);

  useEffect(() => {
    const onScroll = () => setIsShrunk(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // programmatic bootstrap dropdown initialization
  useEffect(() => {
    if (!bootstrap?.Dropdown) return;

    if (sgpssToggleRef.current) {
      sgpssInst.current = new bootstrap.Dropdown(sgpssToggleRef.current, { autoClose: true });
    }
    if (acadToggleRef.current) {
      acadInst.current = new bootstrap.Dropdown(acadToggleRef.current, { autoClose: true });
    }

    const onShown = (e) => {
      const opened = e.target;
      if (opened !== sgpssToggleRef.current && sgpssInst.current) {
        try { sgpssInst.current.hide(); } catch {}
      }
      if (opened !== acadToggleRef.current && acadInst.current) {
        try { acadInst.current.hide(); } catch {}
      }
    };

    document.addEventListener("shown.bs.dropdown", onShown);
    return () => {
      document.removeEventListener("shown.bs.dropdown", onShown);
      try { sgpssInst.current?.dispose(); } catch {}
      try { acadInst.current?.dispose(); } catch {}
    };
  }, []);

  const navClass = ({ isActive }) =>
    "nav-link px-3" + (isActive ? " active-nav" : "");

  // Wait until info is loaded
  if (!info) return null;

  return (
    <>
      <header className={`main-header ${isShrunk ? "shrink" : ""}`}>
        {/* TOP ROW */}
        <div className="header-top bg-white">
          <div className="container d-flex align-items-center justify-content-between py-2">
            <Link to="/" className="d-flex align-items-center text-decoration-none">

              {/* ✅ DYNAMIC LOGO */}
              <img
                src={
                  info.logo
                    ? `${baseURL}storage/${info.logo}`
                    : "/logo.png"
                }
                alt="Logo"
                className="school-logo"
              />

              <div className="ms-2 school-title">
                {/* ✅ DYNAMIC SCHOOL NAME */}
                <h5 className="mb-0 text-primary fw-bold">
                  {info.school_name}
                </h5>

                {/* ✅ DYNAMIC ADDRESS */}
                <small className="text-muted">{info.address}</small>
              </div>
            </Link>

            {/* RIGHT SIDE CONTACT (DYNAMIC) */}
            <div className="d-flex align-items-center gap-4 text-muted small">
              <div className="d-flex align-items-center gap-2">
                <FaPhoneAlt className="me-1" />
                {/* ✅ DYNAMIC PHONE */}
                <span>{info.contact_number}</span>
              </div>

              <div className="d-flex align-items-center gap-2">
                <FaEnvelope className="me-1" />
                {/* ✅ DYNAMIC EMAIL */}
                <span>{info.email}</span>
              </div>

              <div>
                <a
                  href={info.facebook || "https://facebook.com"}
                  target="_blank"
                  rel="noreferrer"
                  className="social-link"
                >
                  <FaFacebook />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* NAV ROW */}
        <nav className="header-nav navbar navbar-expand-lg" style={{ background: "var(--bs-primary)" }}>
          <div className="container">
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#mainNav"
              aria-controls="mainNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="mainNav">
              <ul className="navbar-nav me-auto align-items-lg-center">
                <li className="nav-item">
                  <NavLink to="/" className={navClass}>Home</NavLink>
                </li>

                {/* STATIC SGPSS DROPDOWN */}
                <li className="nav-item dropdown">
                  <button
                    ref={sgpssToggleRef}
                    className="nav-link dropdown-toggle btn btn-link p-0"
                    type="button"
                  >
                    SGPSS
                  </button>
                  <ul className="dropdown-menu">
                    <li><Link className="dropdown-item" to="/about">About</Link></li>
                    <li><Link className="dropdown-item" to="/smc">SMC</Link></li>
                    <li><Link className="dropdown-item" to="/executive-teams">Executive Team</Link></li>
                    <li><Link className="dropdown-item" to="/academic-team">Academic Team</Link></li>
                  </ul>
                </li>

                {/* Academics dropdown (dynamic courses) */}
                <li className="nav-item dropdown">
                  <button
                    ref={acadToggleRef}
                    className="nav-link dropdown-toggle btn btn-link p-0"
                    type="button"
                  >
                    Academics
                  </button>
                  <ul className="dropdown-menu">
                    {courses.length ? (
                      courses.map((c) => (
                        <li key={c.id}>
                          <Link className="dropdown-item" to={`/courses/${c.id}`}>
                            {c.title}
                          </Link>
                        </li>
                      ))
                    ) : (
                      <>
                        <li><Link className="dropdown-item" to="/courses">Courses</Link></li>
                        <li><Link className="dropdown-item" to="/higher-secondary">Higher Secondary</Link></li>
                      </>
                    )}
                  </ul>
                </li>

                <li className="nav-item">
                  <NavLink to="/gallery" className={navClass}>Gallery</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/events" className={navClass}>Events</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/notices" className={navClass}>Notice</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/news" className={navClass}>News</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/resources" className={navClass}>Downloads</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/contact" className={navClass}>Contact</NavLink>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* MARQUEE */}
        <div className="latest-bar d-flex text-white">
          <div className="bg-secondary px-3 py-2 fw-semibold shadow-sm">Highlights</div>
          <div className="scrolling-text-wrapper">
            <div className="scrolling-text" aria-live="polite">
              {notices.length ? (
                notices.map((n, i) => (
                  <span key={i} className="scroll-item">{n.title}</span>
                ))
              ) : (
                <span className="scroll-item">No recent notices</span>
              )}
            </div>
          </div>
        </div>
      </header>

      <div style={{ height: "130px" }} />
    </>
  );
}
