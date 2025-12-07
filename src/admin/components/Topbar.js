// src/admin/Topbar.jsx
import React, { useEffect, useState } from "react";
import { FaBars, FaSignOutAlt } from "react-icons/fa";
import adminapi from "../../api/adminapi";

export default function Topbar({ collapsed, setCollapsed }) {
  const [school, setSchool] = useState(null);

  useEffect(() => {
    adminapi.get("/school-info").then((res) => setSchool(res.data));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin/login";
  };

  return (
    <header
      className="admin-topbar d-flex align-items-center justify-content-between shadow-sm px-4"
      style={{
        background: "var(--bs-primary)",
        color: "#fff",
        height: "65px",
      }}
    >
      {/* Left section - collapse button + logo */}
      <div className="d-flex align-items-center gap-3">
        <button
          className="btn btn-link text-white fs-4 m-0 p-0"
          onClick={() => setCollapsed(!collapsed)}
        >
          <FaBars />
        </button>
        {school && (
          <div className="d-flex align-items-center gap-2">
            {/* <img
              src={`${process.env.REACT_APP_API_BASE_URL}/${school.logo}`}
              alt="School Logo"
              style={{ height: "45px", borderRadius: "6px" }}
            /> */}
            <h5 className="mb-0 fw-bold text-white">
              {/* {school.school_name} */}
            </h5>
          </div>
        )}
      </div>

      {/* Right section - welcome + logout */}
      <div className="d-flex align-items-center gap-3">
        {/* <span className="fw-semibold">Welcome, Admin</span> */}
        <button
          className="btn btn-outline-light btn-sm d-flex align-items-center gap-2"
          onClick={handleLogout}
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </header>
  );
}
