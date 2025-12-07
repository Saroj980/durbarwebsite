// src/admin/AdminSchoolInfo.jsx
import React, { useEffect, useState, useRef } from "react";
import adminapi from "../../api/adminapi"; // your axios instance
import * as bootstrap from "bootstrap";
import "../../admin/css/AdminSchoolInfo.css";
import { FaSave } from "react-icons/fa";

// Demo local-file preview path (from uploaded file in conversation)
const DEMO_LOCAL_IMAGE = "/mnt/data/Screenshot 2025-11-17 at 10.47.46 AM.png";

export default function AdminSchoolInfo() {
  const [info, setInfo] = useState(null);
  const [saving, setSaving] = useState(false);

  const toastRef = useRef(null);
  const toastInst = useRef(null);

  useEffect(() => {
    // create toast instance
    if (toastRef.current) toastInst.current = bootstrap.Toast.getOrCreateInstance(toastRef.current);
    loadInfo();
    // eslint-disable-next-line
  }, []);

  const showToast = (msg, type = "success") => {
    if (!toastRef.current) return;
    const el = toastRef.current;
    el.classList.remove("text-bg-success", "text-bg-danger");
    el.classList.add(`text-bg-${type}`);
    el.querySelector(".toast-body").innerText = msg;
    (toastInst.current ??= bootstrap.Toast.getOrCreateInstance(el)).show();
  };

  const loadInfo = async () => {
    try {
      const res = await adminapi.get("/admin/school-info");
      const data = res.data;
      setInfo({
        ...data,
        // For preview fields: if API returns file path, build full url; if empty, show demo local image
        logo_preview: data.logo ? `${process.env.REACT_APP_API_BASE_URL}storage/${data.logo}` : DEMO_LOCAL_IMAGE,
        info_photo_preview: data.info_photo ? `${process.env.REACT_APP_API_BASE_URL}storage/${data.info_photo}` : null,
        home_banner_preview: data.home_about_us_banner ? `${process.env.REACT_APP_API_BASE_URL}storage/${data.home_about_us_banner}` : null,
        // keep file objects for upload
        logo_file: null,
        info_photo_file: null,
        home_banner_file: null,
      });
    } catch (err) {
      console.error(err);
      showToast("Failed to load school info", "danger");
    }
  };

  // handle text inputs
  const handleChange = (key, value) => {
    setInfo(prev => ({ ...prev, [key]: value }));
  };

  // handle file selects
  const handleFile = (key, file) => {
    if (!file) return;
    const previewKey = `${key}_preview`;
    const fileKey = `${key}_file`;
    setInfo(prev => ({
      ...prev,
      [fileKey]: file,
      [previewKey]: URL.createObjectURL(file),
    }));
  };

  const handleRemoveFilePreview = (key) => {
    const previewKey = `${key}_preview`;
    const fileKey = `${key}_file`;
    setInfo(prev => ({ ...prev, [previewKey]: null, [fileKey]: null }));
  };

  const save = async () => {
    if (!info) return;
    setSaving(true);

    try {
      const fd = new FormData();
      // basic fields
      fd.append("school_name", info.school_name ?? "");
      fd.append("contact_number", info.contact_number ?? "");
      fd.append("email", info.email ?? "");
      fd.append("address", info.address ?? "");
      fd.append("about_us", info.about_us ?? "");
      fd.append("home_about_us1", info.home_about_us1 ?? "");
      fd.append("home_about_us2", info.home_about_us2 ?? "");
      fd.append("info_officer", info.info_officer ?? "");
      fd.append("info_phone", info.info_phone ?? "");
      fd.append("facebook", info.facebook ?? "");
      fd.append("instagram", info.instagram ?? "");
      fd.append("map_url", info.map_url ?? "");

      // files (only append if user selected new file)
      if (info.logo_file) fd.append("logo", info.logo_file);
      if (info.info_photo_file) fd.append("info_photo", info.info_photo_file);
      if (info.home_banner_file) fd.append("home_about_us_banner", info.home_banner_file);

      // call API
      await adminapi.post("/admin/school-info/update", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showToast("School info saved successfully!");
      await loadInfo();
    } catch (err) {
      console.error(err);
      // show validation or generic message
      if (err.response?.data?.errors) {
        const first = Object.values(err.response.data.errors)[0][0];
        showToast(first, "danger");
      } else {
        showToast("Failed to save school info", "danger");
      }
    } finally {
      setSaving(false);
    }
  };

  if (!info) {
    return (
      <div className="p-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return (
    <div className="admin-school-info p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold label-primary">School Info</h3>
          <p className="text-muted small mb-0">Update contact, branding and map</p>
        </div>

        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary" onClick={loadInfo} disabled={saving}>
            Refresh
          </button>
          <button className="btn btn-primary" onClick={save} disabled={saving}>
            <FaSave className="me-2" /> {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="card p-4 shadow-sm">
        <div className="row g-3">

          {/* Left column: branding + basic */}
          <div className="col-lg-6">
            <h6 className="mb-2">Branding</h6>

            {/* Logo */}
            <label className="form-label">Logo</label>
            <div className="d-flex align-items-center gap-3 mb-3">
              <div className="preview-box">
                {info.logo_preview ? (
                  <img src={info.logo_preview} alt="logo" className="img-fluid" />
                ) : (
                  <div className="placeholder">No logo</div>
                )}
              </div>

              <div className="flex-grow-1">
                <input
                  type="file"
                  accept="image/*"
                  className="form-control mb-2"
                  onChange={(e) => handleFile("logo", e.target.files[0])}
                />
                <div className="d-flex gap-2">
                  <button className="btn btn-outline-secondary btn-sm" onClick={() => handleRemoveFilePreview("logo")}>Remove</button>
                  <small className="text-muted align-self-center">Recommended: 180×60 PNG</small>
                </div>
              </div>
            </div>

            {/* Home banner */}
            <label className="form-label">Home About Banner</label>
            <div className="d-flex align-items-center gap-3 mb-3">
              <div className="banner-preview">
                {info.home_banner_preview ? (
                  <img src={info.home_banner_preview} alt="banner" className="img-fluid" />
                ) : (
                  <div className="placeholder">No banner</div>
                )}
              </div>
              <div className="flex-grow-1">
                <input
                  type="file"
                  accept="image/*"
                  className="form-control mb-2"
                  onChange={(e) => handleFile("home_banner", e.target.files[0])}
                />
                <small className="text-muted">Wide image recommended for hero (e.g. 1600×500)</small>
              </div>
            </div>

            <hr />

            <h6 className="mb-2">Contact</h6>
            <div className="mb-2">
              <label className="form-label">School name</label>
              <input className="form-control" value={info.school_name || ""} onChange={(e) => handleChange("school_name", e.target.value)} />
            </div>

            <div className="mb-2">
              <label className="form-label">Contact number</label>
              <input className="form-control" value={info.contact_number || ""} onChange={(e) => handleChange("contact_number", e.target.value)} />
            </div>

            <div className="mb-2">
              <label className="form-label">Email</label>
              <input className="form-control" value={info.email || ""} onChange={(e) => handleChange("email", e.target.value)} />
            </div>

            <div className="mb-2">
              <label className="form-label">Address</label>
              <textarea className="form-control" rows={3} value={info.address || ""} onChange={(e) => handleChange("address", e.target.value)} />
            </div>
          </div>

          {/* Right column: info officer + social + about */}
          <div className="col-lg-6">
            <h6 className="mb-2">Information Officer</h6>

            <div className="d-flex gap-3 align-items-center mb-3">
              <div className="officer-photo-preview">
                {info.info_photo_preview ? (
                  <img src={info.info_photo_preview} alt="info-officer" />
                ) : (
                  <div className="placeholder-sm">No photo</div>
                )}
              </div>

              <div className="flex-grow-1">
                <input type="file" accept="image/*" className="form-control mb-2" onChange={(e) => handleFile("info_photo", e.target.files[0])} />
                <input className="form-control mb-2" placeholder="Officer name" value={info.info_officer || ""} onChange={(e) => handleChange("info_officer", e.target.value)} />
                <input className="form-control" placeholder="Officer phone" value={info.info_phone || ""} onChange={(e) => handleChange("info_phone", e.target.value)} />
              </div>
            </div>

            <hr />

            <h6 className="mb-2">Social & Map</h6>
            <div className="mb-2">
              <label className="form-label">Facebook</label>
              <input className="form-control" value={info.facebook || ""} onChange={(e) => handleChange("facebook", e.target.value)} />
            </div>
            <div className="mb-2">
              <label className="form-label">Instagram</label>
              <input className="form-control" value={info.instagram || ""} onChange={(e) => handleChange("instagram", e.target.value)} />
            </div>
            <div className="mb-2">
              <label className="form-label">Google Maps embed / URL</label>
              <input className="form-control" value={info.map_url || ""} onChange={(e) => handleChange("map_url", e.target.value)} />
            </div>

            <hr />

            <h6 className="mb-2">About (home short)</h6>
            <div className="mb-2">
              <label className="form-label">Home about (line 1)</label>
              <input className="form-control" value={info.home_about_us1 || ""} onChange={(e) => handleChange("home_about_us1", e.target.value)} />
            </div>
            <div className="mb-2">
              <label className="form-label">Home about (line 2)</label>
              <input className="form-control" value={info.home_about_us2 || ""} onChange={(e) => handleChange("home_about_us2", e.target.value)} />
            </div>

            <div className="mb-2">
              <label className="form-label">Full about (About page)</label>
              <textarea className="form-control" rows={6} value={info.about_us || ""} onChange={(e) => handleChange("about_us", e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      <div className="toast-container position-fixed top-0 end-0 p-3">
        <div ref={toastRef} className="toast text-bg-success shadow-lg" role="alert" aria-live="assertive" aria-atomic="true">
          <div className="d-flex">
            <div className="toast-body fw-semibold"></div>
            <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
        </div>
      </div>
    </div>
  );
}
