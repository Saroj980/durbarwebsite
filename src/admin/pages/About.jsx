import React, { useEffect, useState, useRef } from "react";
import adminapi from "../../api/adminapi";
import * as bootstrap from "bootstrap";
import "../../admin/css/AboutAdmin.css";

export default function About() {
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);

  const toastRef = useRef(null);
  const toastInstance = useRef(null);

  // ------------------------ INIT ------------------------
  useEffect(() => {
    if (toastRef.current) {
      toastInstance.current = bootstrap.Toast.getOrCreateInstance(toastRef.current);
    }
    loadAbout();
  }, []);

  const showToast = (msg, type = "success") => {
    if (!toastRef.current) return;

    if (!toastInstance.current) {
      toastInstance.current = bootstrap.Toast.getOrCreateInstance(toastRef.current);
    }

    const toast = toastRef.current;
    toast.classList.remove("text-bg-success", "text-bg-danger");
    toast.classList.add(`text-bg-${type}`);
    toast.querySelector(".toast-body").innerText = msg;

    toastInstance.current.show();
  };

  // ------------------------ LOAD DATA ------------------------
  const loadAbout = async () => {
    try {
      const res = await adminapi.get("/admin/about-school");
      const raw = res.data;

      setData({
        ...raw,
        vision: JSON.parse(raw.vision.replace("{[", "[").replace("]}", "]")),
        mission: JSON.parse(raw.mission.replace("{[", "[").replace("]}", "]")),
        objective: JSON.parse(raw.objective.replace("{[", "[").replace("]}", "]")),
        about_image_preview: raw.about_image
          ? `${process.env.REACT_APP_API_BASE_URL}storage/${raw.about_image}`
          : null,
      });
    } catch (err) {
      console.error(err);
      showToast("Failed to load!", "danger");
    }
  };

  // ------------------------ FORM HANDLERS ------------------------
  const handleInput = (key, value) => {
    setData({ ...data, [key]: value });
  };

  const handleArrayChange = (key, index, value) => {
    const arr = [...data[key]];
    arr[index] = value;
    setData({ ...data, [key]: arr });
  };

  const addArrayItem = (key) => {
    setData({ ...data, [key]: [...data[key], ""] });
  };

  const removeArrayItem = (key, index) => {
    const arr = data[key].filter((_, i) => i !== index);
    setData({ ...data, [key]: arr });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setData({
      ...data,
      about_image_file: file,
      about_image_preview: URL.createObjectURL(file),
    });
  };

  // ------------------------ SAVE ------------------------
  const saveAbout = async () => {
    try {
      setSaving(true);

      const form = new FormData();
      form.append("id", data.id);
      form.append("hero_title", data.hero_title);
      form.append("hero_subtitle", data.hero_subtitle);
      form.append("about_title", data.about_title);
      form.append("about_text", data.about_text);

      form.append("vision", JSON.stringify(data.vision));
      form.append("mission", JSON.stringify(data.mission));
      form.append("objective", JSON.stringify(data.objective));

      if (data.about_image_file) {
        form.append("about_image", data.about_image_file);
      }

      await adminapi.post("admin/about-school/update", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showToast("Updated successfully!");
      setSaving(false);

    } catch (err) {
      console.error(err);
      showToast("Failed to save!", "danger");
      setSaving(false);
    }
  };

  // ------------------------ RENDER ------------------------
  if (!data)
    return (
      <div className="p-5 text-center">
        <div className="spinner-border text-primary"></div>
      </div>
    );

  return (
    <div className="p-4">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h3 className="fw-bold label-primary">About School</h3>
            <p className="text-muted mb-0 small">
                Manage About Us content, hero banner, vision, mission & objectives
            </p>
        </div>

        <button className="btn btn-primary px-4" onClick={saveAbout} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>


      {/* MAIN CARD */}
      <div className="card p-4 shadow-sm">

        {/* ---------------- MODERN TABS ---------------- */}
        <ul className="nav nav-pills about-admin-tabs mb-4">
          {[
            { key: "general", label: "General" },
            { key: "vision", label: "Vision" },
            { key: "mission", label: "Mission" },
            { key: "objective", label: "Objectives" }
          ].map((tab, i) => (
            <li key={tab.key} className="nav-item me-2">
              <button
                className={`nav-link ${i === 0 ? "active" : ""}`}
                data-bs-toggle="tab"
                data-bs-target={`#${tab.key}-tab`}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>

        {/* ---------------- TAB CONTENT ---------------- */}
        <div className="tab-content">

          {/* GENERAL TAB */}
          <div className="tab-pane fade show active" id="general-tab">
            <div className="row g-4">

              <div className="col-lg-6">
                <label className="fw-semibold">Hero Title</label>
                <input
                  className="form-control shadow-sm"
                  value={data.hero_title}
                  onChange={(e) => handleInput("hero_title", e.target.value)}
                />
              </div>

              <div className="col-lg-6">
                <label className="fw-semibold">Hero Subtitle</label>
                <input
                  className="form-control shadow-sm"
                  value={data.hero_subtitle}
                  onChange={(e) => handleInput("hero_subtitle", e.target.value)}
                />
              </div>

              <div className="col-12">
                <label className="fw-semibold">About Title</label>
                <input
                  className="form-control shadow-sm"
                  value={data.about_title}
                  onChange={(e) => handleInput("about_title", e.target.value)}
                />
              </div>

              <div className="col-12">
                <label className="fw-semibold">About Text</label>
                <textarea
                  className="form-control shadow-sm"
                  rows={8}
                  value={data.about_text}
                  onChange={(e) => handleInput("about_text", e.target.value)}
                />
              </div>

              <div className="col-lg-6">
                <label className="fw-semibold">Hero Image</label>
                <input type="file" className="form-control" onChange={handleImage} />

                {data.about_image_preview && (
                  <img
                    src={data.about_image_preview}
                    alt="Preview"
                    className="mt-3 rounded shadow-sm"
                    style={{ width: "100%", maxHeight: 220, objectFit: "cover" }}
                  />
                )}
              </div>

            </div>
          </div>

          {/* VISION TAB */}
          <div className="tab-pane fade" id="vision-tab">
            {data.vision.map((v, i) => (
              <div className="array-item-card mb-3" key={i}>
                <button
                  className="array-remove-btn"
                  onClick={() => removeArrayItem("vision", i)}
                >
                  ×
                </button>

                <input
                  className="form-control shadow-sm"
                  value={v}
                  onChange={(e) => handleArrayChange("vision", i, e.target.value)}
                />
              </div>
            ))}

            <button className="btn btn-outline-primary mt-2" onClick={() => addArrayItem("vision")}>
              + Add Vision
            </button>
          </div>

          {/* MISSION TAB */}
          <div className="tab-pane fade" id="mission-tab">
            {data.mission.map((v, i) => (
              <div className="array-item-card mb-3" key={i}>
                <button
                  className="array-remove-btn"
                  onClick={() => removeArrayItem("mission", i)}
                >
                  ×
                </button>

                <input
                  className="form-control shadow-sm"
                  value={v}
                  onChange={(e) => handleArrayChange("mission", i, e.target.value)}
                />
              </div>
            ))}

            <button className="btn btn-outline-primary mt-2" onClick={() => addArrayItem("mission")}>
              + Add Mission
            </button>
          </div>

          {/* OBJECTIVE TAB */}
          <div className="tab-pane fade" id="objective-tab">
            {data.objective.map((v, i) => (
              <div className="array-item-card mb-3" key={i}>
                <button
                  className="array-remove-btn"
                  onClick={() => removeArrayItem("objective", i)}
                >
                  ×
                </button>

                <input
                  className="form-control shadow-sm"
                  value={v}
                  onChange={(e) => handleArrayChange("objective", i, e.target.value)}
                />
              </div>
            ))}

            <button
              className="btn btn-outline-primary mt-2"
              onClick={() => addArrayItem("objective")}
            >
              + Add Objective
            </button>
          </div>

        </div>
      </div>

      {/* ---------------- Toast ---------------- */}
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
