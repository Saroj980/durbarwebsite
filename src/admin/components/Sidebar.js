// src/admin/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";

import {
  FaTachometerAlt,
  FaBook,
  FaBell,
  FaNewspaper,
  FaImages,
  FaDownload,
  FaSlidersH,
  FaSchool,
  FaInfoCircle,
  FaUsers,
  FaUserGraduate,
  FaCalendarAlt,
  FaEnvelopeOpenText,
  FaLayerGroup,FaLock
} from "react-icons/fa";

export default function Sidebar({ collapsed }) {
  return (
    <div className={`admin-sidebar ${collapsed ? "collapsed" : ""}`}>
      
      {/* LOGO */}
      <div className="sidebar-header d-flex align-items-center justify-content-center py-3 px-2 border-bottom">
        <img
          src="/logo.png"
          alt="Logo"
          className="sidebar-logo me-2"
          style={{
            height: "40px",
            width: "40px",
            objectFit: "cover",
            borderRadius: "6px",
          }}
        />
        {!collapsed && (
          <h5
            className="mb-0 fw-bold text-white"
            style={{ fontSize: "0.85rem", lineHeight: "1.2" }}
          >
            Shree Gogal Prasad Model Secondary School
          </h5>
        )}
      </div>

      {/* MENU */}
      <nav className="sidebar-menu mt-3">

        {/* ----------- Dashboard ----------- */}
        <NavLink to="/admin" end className="nav-link">
          <FaTachometerAlt /> {!collapsed && <span>Dashboard</span>}
        </NavLink>

        {/* ----------- CONTENT GROUP TITLE ----------- */}
        {!collapsed && <div className="sidebar-section-title">CONTENT</div>}

        <NavLink to="/admin/about-us" className="nav-link">
          <FaInfoCircle /> {!collapsed && <span>About Us</span>}
        </NavLink>

        <NavLink to="/admin/principal-message" className="nav-link">
          <FaUserGraduate /> {!collapsed && <span>Principal Message</span>}
        </NavLink>

        <NavLink to="/admin/executive-teams" className="nav-link">
          <FaUsers /> {!collapsed && <span>Executive Team</span>}
        </NavLink>

        <NavLink to="/admin/academic-teams" className="nav-link">
          <FaUserGraduate /> {!collapsed && <span>Academic Teams</span>}
        </NavLink>

        <NavLink to="/admin/courses" className="nav-link">
          <FaBook /> {!collapsed && <span>Courses</span>}
        </NavLink>

        <NavLink to="/admin/news" className="nav-link">
          <FaNewspaper /> {!collapsed && <span>News</span>}
        </NavLink>

        <NavLink to="/admin/events" className="nav-link">
          <FaCalendarAlt /> {!collapsed && <span>Events</span>}
        </NavLink>

        <NavLink to="/admin/notices" className="nav-link">
          <FaBell /> {!collapsed && <span>Notices</span>}
        </NavLink>

        <NavLink to="/admin/gallery" className="nav-link">
          <FaImages /> {!collapsed && <span>Gallery</span>}
        </NavLink>

        <NavLink to="/admin/downloads" className="nav-link">
          <FaDownload /> {!collapsed && <span>Downloads</span>}
        </NavLink>

        {/* ----------- SETTINGS GROUP TITLE ----------- */}
        {!collapsed && <div className="sidebar-section-title">SETTINGS</div>}

        <NavLink to="/admin/carousel" className="nav-link">
          <FaLayerGroup /> {!collapsed && <span>Carousel Items</span>}
        </NavLink>

        <NavLink to="/admin/theme-settings" className="nav-link">
          <FaSlidersH /> {!collapsed && <span>Theme Settings</span>}
        </NavLink>

        <NavLink to="/admin/school-info" className="nav-link">
          <FaSchool /> {!collapsed && <span>School Info</span>}
        </NavLink>

        <NavLink to="/admin/change-password" className="nav-link">
          <FaLock /> {!collapsed && <span>Change Password</span>}
        </NavLink>

        {/* ----------- MESSAGES GROUP ----------- */}
        {!collapsed && <div className="sidebar-section-title">MESSAGES</div>}

        <NavLink to="/admin/contact-messages" className="nav-link">
          <FaEnvelopeOpenText /> {!collapsed && <span>Contact Messages</span>}
        </NavLink>

        <hr />
      </nav>
    </div>
  );
}
