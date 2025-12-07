import React, { useRef, useState, useEffect } from "react";
import adminapi from "../../api/adminapi";
import * as bootstrap from "bootstrap";

export default function AdminChangePassword() {
  const [form, setForm] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  const [saving, setSaving] = useState(false);

  const toastRef = useRef(null);
  const toastInstance = useRef(null);

  useEffect(() => {
    if (toastRef.current) {
      toastInstance.current = bootstrap.Toast.getOrCreateInstance(toastRef.current);
    }
  }, []);

  const showToast = (msg, type = "success") => {
    const el = toastRef.current;
    el.classList.remove("text-bg-success", "text-bg-danger");
    el.classList.add(`text-bg-${type}`);
    el.querySelector(".toast-body").innerText = msg;
    toastInstance.current.show();
  };

  const handleInput = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await adminapi.post("/admin/change-password", form);
      showToast("Password updated successfully!");
      setForm({
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
      });

    } catch (err) {
      if (err.response?.status === 422) {
        const errors = err.response.data.errors;
        showToast(Object.values(errors)[0][0], "danger");
      } else {
        showToast("Failed to update password!", "danger");
      }
    }

    setSaving(false);
  };

  return (
    <div className="p-4">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold label-primary">Change Password</h3>
          <p className="text-muted small mb-0">Update your login credentials securely</p>
        </div>
      </div>

      <div className="card shadow-sm p-4">
        <form onSubmit={handleSubmit} className="row g-3">

          <div className="col-md-6">
            <label className="fw-semibold">Current Password</label>
            <input
              type="password"
              className="form-control shadow-sm"
              value={form.current_password}
              onChange={(e) => handleInput("current_password", e.target.value)}
              required
            />
          </div>

          <div className="col-md-6"></div>

          <div className="col-md-6">
            <label className="fw-semibold">New Password</label>
            <input
              type="password"
              className="form-control shadow-sm"
              value={form.new_password}
              onChange={(e) => handleInput("new_password", e.target.value)}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="fw-semibold">Confirm New Password</label>
            <input
              type="password"
              className="form-control shadow-sm"
              value={form.new_password_confirmation}
              onChange={(e) =>
                handleInput("new_password_confirmation", e.target.value)
              }
              required
            />
          </div>

          <div className="col-12 mt-3">
            <button
              type="submit"
              className="btn btn-primary px-4"
              disabled={saving}
            >
              {saving ? "Updating..." : "Update Password"}
            </button>
          </div>

        </form>
      </div>

      {/* Toast */}
      <div className="toast-container position-fixed top-0 end-0 p-3">
        <div className="toast text-bg-success shadow-lg" ref={toastRef}>
          <div className="d-flex">
            <div className="toast-body fw-semibold"></div>
            <button className="btn-close btn-close-white me-2 m-auto"></button>
          </div>
        </div>
      </div>
    </div>
  );
}
