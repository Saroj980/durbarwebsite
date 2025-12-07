import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import adminapi from "../api/adminapi";
import api from "../api/api";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./admin.css";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [school, setSchool] = useState(null);

  useEffect(() => {
    // Fetch school info for logo & name
    api
      .get("/school-info")
      .then((res) => setSchool(res.data))
      .catch(() => console.warn("Could not load school info"));
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await adminapi.get("/sanctum/csrf-cookie", { baseURL: `${process.env.REACT_APP_API_BASE_URL}` });
      const res = await adminapi.post("/admin/login", { email, password });
      localStorage.setItem("adminToken", res.data.token);
      navigate("/admin");
    } catch (err) {
      console.error(err);
      setError("Invalid credentials or server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container d-flex align-items-center justify-content-center vh-100">
      <div className="admin-login-card shadow-sm p-4 rounded-4 bg-white border">
        {/* Logo + School name */}
        <div className="text-center mb-4">
          {school?.logo && (
            <img
              src={`${process.env.REACT_APP_API_BASE_URL}storage/${school.logo}`}
              alt="School Logo"
              className="mb-3"
              style={{ height: "70px", borderRadius: "6px" }}
            />
          )}
          <h5 className="fw-bold mb-1 label-primary">
            {school?.school_name || "Admin Login"}
          </h5>
          <p className="text-secondary small">Administrator Portal</p>
        </div>

        {error && (
          <div className="alert alert-danger py-2 small mb-3 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label fw-semibold small text-secondary">
              Email
            </label>
            <input
              type="email"
              className="form-control rounded-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

         <div className="mb-3 position-relative">
            <label className="form-label fw-semibold small text-secondary">
                Password
            </label>
            <div className="position-relative">
                <input
                type={showPassword ? "text" : "password"}
                className="form-control rounded-3 pe-5"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                />
                <span
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                role="button"
                aria-label="Toggle password visibility"
                >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
            </div>
        </div>


          <button
            type="submit"
            className="btn btn-primary button-primary w-100 fw-semibold rounded-3 mt-2"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="text-center mt-4 small text-muted">
          © {new Date().getFullYear()} {school?.school_name || "School Name"}
        </div>
      </div>
    </div>
  );
}
