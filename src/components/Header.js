import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaRegNewspaper } from "react-icons/fa";
import api from "../api";

export default function Header() {
  const [isShrunk, setIsShrunk] = useState(false);
  const [notices, setNotices] = useState([]);
  const [school, setSchool] = useState(null);
  const [menus, setMenus] = useState([]);

  const baseURL = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000/";

  // Fetch School Info
  useEffect(() => {
    api.get("/school-info")
      .then((res) => setSchool(res.data))
      .catch((err) => {
        console.error("School info fetch error:", err);
        setSchool({
          school_name: "Your School Name",
          address: "Your Address",
          logo: null,
        });
      });
  }, []);

  // Fetch Menus
  useEffect(() => {
    api.get("/menus")
      .then((res) => setMenus(res.data || []))
      .catch((err) => {
        console.error("Menu fetch error:", err);
        setMenus([
          { id: 1, title: "Home", slug: "/" },
          { id: 2, title: "About", slug: "/about" },
          { id: 3, title: "Courses", slug: "/courses" },
          { id: 4, title: "Gallery", slug: "/gallery" },
          { id: 5, title: "Contact", slug: "/contact" },
        ]);
      });
  }, []);

  // Fetch Notices
  useEffect(() => {
    api
      .get("/notices")
      .then((res) => setNotices(res.data || []))
      .catch(() => {
        setNotices([
          { id: 1, title: "Admission Open" },
          { id: 2, title: "Exam Routine Published" },
        ]);
      });
  }, []);

  // Shrink on scroll
  useEffect(() => {
    const handleScroll = () => setIsShrunk(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!school) return null; // Loading…

  return (
    <>
      <header className={`main-header ${isShrunk ? "shrink" : ""}`}>
        <div className="container d-flex align-items-center justify-content-between py-2">

          {/* School Logo + Name */}
          <div className="d-flex align-items-center gap-2">
            <img
              src={
                school.logo
                  ? `${baseURL}storage/${school.logo}`
                  : "/logo.png"
              }
              alt="Logo"
              className="school-logo"
              style={{ height: "55px", width: "55px", objectFit: "cover", borderRadius: "8px" }}
            />

            <div className="school-title">
              <h5 className="mb-0 text-white fw-bold">
                {school.school_name}
              </h5>
              <small className="text-light">
                {school.address}
              </small>
            </div>
          </div>

          {/* Navigation */}
          <nav className="navbar navbar-expand-lg navbar-dark">
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                {menus.map((m) => (
                  <li className="nav-item" key={m.id}>
                    <Link className="nav-link" to={m.slug}>
                      {m.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        {/* Latest Updates Bar */}
        <div className="latest-bar text-white d-flex align-items-center">
          <div className="bg-warning text-dark px-3 py-1 fw-semibold d-flex align-items-center gap-2">
            <FaRegNewspaper /> Latest Updates
          </div>

          <marquee className="flex-grow-1 py-1" scrollamount="6">
            {notices.length ? (
              notices.map((n) => (
                <span key={n.id} style={{ marginRight: "50px" }}>
                  📢 {n.title}
                </span>
              ))
            ) : (
              <span>No notices available</span>
            )}
          </marquee>
        </div>
      </header>

      {/* Spacer */}
      <div style={{ height: "140px" }}></div>
    </>
  );
}
