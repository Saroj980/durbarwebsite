// src/admin/Layout.jsx
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import "./admin.css";

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="admin-layout d-flex">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} />

      {/* Main content area */}
      <div className={`admin-main flex-grow-1 ${collapsed ? "collapsed" : ""}`}>
        <Topbar collapsed={collapsed} setCollapsed={setCollapsed} />
        <main className="admin-content p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
