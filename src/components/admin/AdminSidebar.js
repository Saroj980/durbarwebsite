import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaTachometerAlt, FaNewspaper, FaBell, FaImages, FaCog, FaSignOutAlt } from "react-icons/fa";

export default function AdminSidebar({ onLogout }) {
  const location = useLocation();

  const navItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
    { path: "/admin/news", label: "News", icon: <FaNewspaper /> },
    { path: "/admin/notices", label: "Notices", icon: <FaBell /> },
    { path: "/admin/gallery", label: "Gallery", icon: <FaImages /> },
    { path: "/admin/settings", label: "Settings", icon: <FaCog /> },
  ];

  return (
    <div className="d-flex flex-column flex-shrink-0 bg-dark text-white p-3 vh-100" style={{ width: "250px" }}>
      <h5 className="text-center fw-bold mb-4">Admin Panel</h5>
      <ul className="nav nav-pills flex-column mb-auto">
        {navItems.map((item) => (
          <li className="nav-item" key={item.path}>
            <Link
              to={item.path}
              className={`nav-link text-white ${location.pathname === item.path ? "active bg-primary" : ""}`}
            >
              {item.icon} <span className="ms-2">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
      <hr />
      <button onClick={onLogout} className="btn btn-outline-light w-100">
        <FaSignOutAlt className="me-2" /> Logout
      </button>
    </div>
  );
}
