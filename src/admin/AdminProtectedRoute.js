// src/admin/AdminProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function AdminProtectedRoute() {
  const token = localStorage.getItem("adminToken");

  // if no token -> redirect to /admin/login
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  // if logged in -> render the child route
  return <Outlet />;
}
