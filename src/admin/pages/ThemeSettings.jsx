import React, { useEffect, useState, useRef } from "react";
import adminapi from "../../api/adminapi";
import * as bootstrap from "bootstrap";
 import {
  FaSpinner,
} from "react-icons/fa";

export default function ThemeSettings() {
  const [theme, setTheme] = useState({});
  const [loading, setLoading] = useState(true); // ⬅️ Loading state

  const toastRef = useRef(null);
  const toastInstance = useRef(null);

  useEffect(() => {
    if (toastRef.current) {
      toastInstance.current = new bootstrap.Toast(toastRef.current);
    }
    loadTheme();
  }, []);

  const showToast = (msg, type = "success") => {
    if (!toastRef.current) return; 
    const toastEl = toastRef.current;

    toastEl.classList.remove("text-bg-success", "text-bg-danger");
    toastEl.classList.add(`text-bg-${type}`);
    toastEl.querySelector(".toast-body").innerText = msg;

    // Ensure Toast instance exists
    if (!toastInstance.current) {
      toastInstance.current = new bootstrap.Toast(toastEl);
    }

    toastInstance.current.show();
  };


  const loadTheme = async () => {
    try {
      const res = await adminapi.get("/theme");

      // Apply missing keys for safety
      const defaultKeys = [
        "primary", "secondary", "success", "info", "warning",
        "danger", "light", "dark", "body_bg", "body_text"
      ];

      const themeData = { ...res.data };
      defaultKeys.forEach(key => {
        if (!themeData[key]) themeData[key] = "";
      });

      setTheme(themeData);
    } catch (err) {
      console.error(err);
      showToast("Failed to load theme!", "danger");
    } finally {
      setLoading(false); // ⬅️ Hide loader when done
    }
  };

  const updateThemeVal = (key, value) => {
    setTheme({ ...theme, [key]: value });

    if (key === "body_bg") {
      document.documentElement.style.setProperty("--body-bg", value);
    } else if (key === "body_text") {
      document.documentElement.style.setProperty("--body-text", value);
    } else {
      document.documentElement.style.setProperty(`--bs-${key}`, value);
    }
  };

  const saveTheme = async () => {
    try {
      await adminapi.post("/admin/theme", theme);
      showToast("Theme saved successfully!");
    } catch (err) {
      console.error(err);
      showToast("Failed to save theme!", "danger");
    }
  };

  const renderRow = (label, key) => (
    <div className="col-md-6 mb-3">
      <div className="card shadow-sm border-0 rounded-4 p-3">
        <label className="fw-semibold">{label}</label>

        <div className="d-flex align-items-center gap-3 mt-2">
          <input
            type="color"
            className="form-control form-control-color"
            style={{ width: "60px", height: "40px", padding: 0 }}
            value={theme[key]}
            onChange={(e) => updateThemeVal(key, e.target.value)}
          />

          <input
            type="text"
            className="form-control"
            value={theme[key]}
            onChange={(e) => updateThemeVal(key, e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  // 🔵 Loading Screen UI
  if (loading) {
    return (
    <div className="dashboard-loader d-flex flex-column justify-content-center align-items-center vh-100">
        <FaSpinner className="spinner label-primary mb-3" />
        <h6 className="text-muted">Loading...</h6>
    </div>
    );
}

  return (
    <div className="p-4">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold label-primary">Theme Settings</h3>
          <p className="text-muted small mb-0">Customize your website colors</p>
        </div>

        <button className="btn btn-primary px-4" onClick={saveTheme}>
          Save Theme
        </button>
      </div>

      {/* Grid */}
      <div className="row">
        {renderRow("Primary", "primary")}
        {renderRow("Secondary", "secondary")}
        {renderRow("Success", "success")}
        {renderRow("Info", "info")}
        {renderRow("Warning", "warning")}
        {renderRow("Danger", "danger")}
        {renderRow("Light", "light")}
        {renderRow("Dark", "dark")}
        {renderRow("Body Background", "body_bg")}
        {renderRow("Body Text", "body_text")}
      </div>

      {/* Toast */}
      <div className="toast-container position-fixed top-0 end-0 p-3">
        <div className="toast align-items-center text-bg-success border-0 shadow-lg" ref={toastRef}>
          <div className="d-flex">
            <div className="toast-body fw-semibold"></div>
            <button type="button" className="btn-close btn-close-white me-2 m-auto"></button>
          </div>
        </div>
      </div>
    </div>
  );
}
