import React, { useEffect, useRef, useState } from "react";
import adminapi from "../../api/adminapi";
import * as bootstrap from "bootstrap";
import { Editor } from "@tinymce/tinymce-react";

export default function AdminPrincipalMessage() {
  const [data, setData] = useState({
    id: null,
    name: "",
    designation: "",
    message: "",
    short_message: "",
    visibility: 1,
    photo: null,
    photo_preview: null,
  });

  const [saving, setSaving] = useState(false);
  const [fullImage, setFullImage] = useState(null);

  const toastRef = useRef(null);
  const toastInstance = useRef(null);
  const imageModalRef = useRef(null);
  const imageModalInstance = useRef(null);

  const base = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    if (toastRef.current) {
      toastInstance.current = bootstrap.Toast.getOrCreateInstance(toastRef.current);
    }
    if (imageModalRef.current) {
      imageModalInstance.current = bootstrap.Modal.getOrCreateInstance(imageModalRef.current);
    }

    loadData();
  }, []);

  const showToast = (msg, type = "success") => {
    const toastEl = toastRef.current;
    toastEl.classList.remove("text-bg-success", "text-bg-danger");
    toastEl.classList.add(`text-bg-${type}`);
    toastEl.querySelector(".toast-body").innerText = msg;
    toastInstance.current.show();
  };

  const loadData = async () => {
    try {
      const res = await adminapi.get("/admin/principal-message");
      const d = res.data;

      setData({
        ...d,
        photo: null,
        photo_preview: d.photo ? `${base}storage/${d.photo}` : null,
      });

    } catch (err) {
      showToast("Failed to load!", "danger");
    }
  };

  const handleInput = (key, value) => {
    setData({ ...data, [key]: value });
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setData({
      ...data,
      photo: file,
      photo_preview: URL.createObjectURL(file),
    });
  };

  const saveData = async () => {
    setSaving(true);

    try {
      const fd = new FormData();

      fd.append("name", data.name);
      fd.append("designation", data.designation);
      fd.append("message", data.message);
      fd.append("short_message", data.short_message);
      fd.append("visibility", data.visibility);

      if (data.photo instanceof File) {
        fd.append("photo", data.photo);
      }

      await adminapi.post("/admin/principal-message/save", fd);

      showToast("Saved successfully!");
      loadData();

    } catch (err) {
      showToast("Save failed!", "danger");
    }

    setSaving(false);
  };

  return (
    <div className="p-4">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold label-primary mb-1">Principal’s Message</h3>
          <p className="text-muted small mb-0">Update principal details, profile image & message</p>
        </div>

        <button className="btn btn-primary px-4" disabled={saving} onClick={saveData}>
          {saving ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>

      {/* CARD */}
      <div className="card shadow-sm border-0 rounded-4 p-4">

        <div className="row g-4">

          {/* LEFT SIDE */}
          <div className="col-lg-8">

            <div className="card border-0 shadow-sm rounded-4 p-3 mb-3">
              <h6 className="fw-bold mb-3">Basic Information</h6>

              <label className="form-label fw-semibold">Name <span className="text-danger">*</span></label>
              <input
                className="form-control mb-3"
                value={data.name}
                onChange={(e) => handleInput("name", e.target.value)}
              />

              <label className="form-label fw-semibold">Designation <span className="text-danger">*</span></label>
              <input
                className="form-control mb-3"
                value={data.designation}
                onChange={(e) => handleInput("designation", e.target.value)}
              />

              <label className="form-label fw-semibold">Short Message</label>
              <textarea
                className="form-control mb-3"
                rows={6}
                value={data.short_message}
                onChange={(e) => handleInput("short_message", e.target.value)}
              />
            </div>

            <div className="card border-0 shadow-sm rounded-4 p-3 mb-3">
              <h6 className="fw-bold mb-3">Full Message</h6>
              <Editor
                apiKey="w6uiatltadib52i5f3nsgdtew5ytwq4tba32wmmn4fhvczrb"
                value={data.message}
                init={{
                  height: '90vh',
                  menubar: true,
                  plugins: "link lists image code table",
                  toolbar:
                    "undo redo | bold italic underline | bullist numlist | link",
                }}
                onEditorChange={(content) => handleInput("message", content)}
              />
            </div>

            <div className="card border-0 shadow-sm rounded-4 p-3">
              <label className="form-label fw-semibold">Visibility</label>
              <select
                className="form-select shadow-sm"
                value={data.visibility}
                onChange={(e) => handleInput("visibility", e.target.value)}
              >
                <option value={1}>Visible</option>
                <option value={0}>Hidden</option>
              </select>
            </div>

          </div>

          {/* RIGHT SIDE PHOTO CARD */}
          <div className="col-lg-4">

            <div className="card border-0 shadow-sm rounded-4 p-3">
               {data.photo_preview ? (
                <div className="text-center">
                  <img
                    src={data.photo_preview}
                    alt="Principal"
                    className="rounded shadow-sm border"
                    style={{
                      width: "150px",
                      height: "190px",
                      objectFit: "cover",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setFullImage(data.photo_preview);
                      imageModalInstance.current.show();
                    }}
                  />
                  <p className="text-muted small mt-2">Click to view full image</p>
                </div>
              ) : (
                <p className="text-muted text-center small mt-2">No photo uploaded</p>
              )}
              <h6 className="fw-bold mb-3">Principal Photo</h6>

              <input type="file" className="form-control mb-3" onChange={handlePhoto} />

            </div>
          </div>

        </div>
      </div>

      {/* FULL IMAGE MODAL */}
      <div className="modal fade" ref={imageModalRef}>
        <div className="modal-dialog modal-fullscreen">
          <div className="modal-content bg-dark">
            <div className="modal-header border-0">
              <button className="btn-close btn-close-white" onClick={() => imageModalInstance.current.hide()}></button>
            </div>
            <div className="modal-body d-flex justify-content-center align-items-center">
              <img
                src={fullImage}
                alt="Full Preview"
                className="img-fluid rounded shadow"
                style={{ maxHeight: "92vh" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* TOAST */}
      <div className="toast-container position-fixed top-0 end-0 p-4">
        <div className="toast text-bg-success shadow-lg rounded-3" ref={toastRef}>
          <div className="d-flex">
            <div className="toast-body fw-semibold"></div>
            <button className="btn-close btn-close-white me-2 m-auto"></button>
          </div>
        </div>
      </div>

    </div>
  );
}
