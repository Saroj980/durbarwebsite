// src/admin/pages/AcademicTeams.jsx
import React, { useEffect, useState, useRef } from "react";
import adminapi from "../../api/adminapi";
import * as bootstrap from "bootstrap";
import { FaPlus, FaTrash, FaEdit, FaEyeSlash, FaEye } from "react-icons/fa";

export default function AcademicTeams() {
  const [teams, setTeams] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: "",
    designation: "",
    qualification: "",
    phone: "",
    email: "",
    visibility: 1,
    photo: null,
    preview: null,
  });
  const [saving, setSaving] = useState(false);

  const modalRef = useRef(null);
  const modalInstance = useRef(null);
  const toastRef = useRef(null);
  const toastInstance = useRef(null);

  const base = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    if (toastRef.current) {
      toastInstance.current = bootstrap.Toast.getOrCreateInstance(toastRef.current);
    }
    if (modalRef.current) {
      modalInstance.current = bootstrap.Modal.getOrCreateInstance(modalRef.current);
    }
    loadTeams();
  }, []);

  const showToast = (msg, type = "success") => {
    if (!toastRef.current) return;
    if (!toastInstance.current) {
      toastInstance.current = bootstrap.Toast.getOrCreateInstance(toastRef.current);
    }
    const toastEl = toastRef.current;
    toastEl.classList.remove("text-bg-success", "text-bg-danger");
    toastEl.classList.add(`text-bg-${type}`);
    toastEl.querySelector(".toast-body").innerText = msg;
    toastInstance.current.show();
  };

  const loadTeams = async () => {
    try {
      const res = await adminapi.get("/admin/academic-teams");
      setTeams(res.data || []);
    } catch (err) {
      console.error(err);
      showToast("Failed to load academic team", "danger");
    }
  };

  const openModal = (member = null) => {
    if (member) {
      setForm({
        id: member.id,
        name: member.name || "",
        designation: member.designation || "",
        qualification: member.qualification || "",
        phone: member.phone || "",
        email: member.email || "",
        visibility: member.visibility,
        photo: null,
        preview: member.photo ? `${base}storage/${member.photo}` : null,
      });
    } else {
      setForm({
        id: null,
        name: "",
        designation: "",
        qualification: "",
        phone: "",
        email: "",
        visibility: 1,
        photo: null,
        preview: null,
      });
    }

    if (!modalInstance.current) {
      modalInstance.current = bootstrap.Modal.getOrCreateInstance(modalRef.current);
    }
    modalInstance.current.show();
  };

  const closeModal = () => {
    if (!modalInstance.current) {
      modalInstance.current = bootstrap.Modal.getOrCreateInstance(modalRef.current);
    }
    modalInstance.current.hide();
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm({ ...form, photo: file, preview: URL.createObjectURL(file) });
  };

  const saveTeam = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("designation", form.designation || "");
      fd.append("qualification", form.qualification || "");
      fd.append("phone", form.phone || "");
      fd.append("email", form.email || "");
      fd.append("visibility", form.visibility ? 1 : 0);
      if (form.photo) fd.append("photo", form.photo);

      if (form.id) {
        await adminapi.post(`/admin/academic-teams/${form.id}?_method=PUT`, fd);
        showToast("Member updated");
      } else {
        await adminapi.post(`/admin/academic-teams`, fd);
        showToast("Member added");
      }
      closeModal();
      loadTeams();
    } catch (err) {
      console.error(err);
      // if validation errors from server:
      if (err.response?.status === 422) {
        const first = Object.values(err.response.data.errors)[0][0];
        showToast(first, "danger");
      } else showToast("Failed to save", "danger");
    } finally {
      setSaving(false);
    }
  };

  const deleteMember = async (id) => {
    if (!window.confirm("Delete this member?")) return;
    try {
      await adminapi.delete(`/admin/academic-teams/${id}`);
      showToast("Deleted");
      loadTeams();
    } catch (err) {
      console.error(err);
      showToast("Failed to delete", "danger");
    }
  };

  const toggleVisibility = async (member) => {
    try {
      await adminapi.post(`/admin/academic-teams/${member.id}?_method=PUT`, {
        name: member.name,
        designation: member.designation,
        qualification: member.qualification,
        phone: member.phone,
        email: member.email,
        visibility: member.visibility ? 0 : 1,
      });
      showToast("Visibility updated");
      loadTeams();
    } catch (err) {
      console.error(err);
      showToast("Failed to update", "danger");
    }
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold label-primary">Academic Teams</h3>
          <p className="text-muted small mb-0">Manage academic staff & faculty</p>
        </div>

        <button className="btn btn-primary" onClick={() => openModal()}>
          <FaPlus /> Add Member
        </button>
      </div>

      <div className="row g-4">
        {teams.map((m) => (
          <div className="col-md-4 col-lg-3" key={m.id}>
            <div className="card shadow-sm">
              <img
                src={`${base}storage/${m.photo}`}
                className="card-img-top"
                style={{ height: 220, objectFit: "cover" }}
                alt={m.name}
              />
              <div className="card-body text-center">
                <h5 className="fw-bold">{m.name}</h5>
                {m.designation && <p className="text-muted small mb-1">{m.designation}</p>}
                {m.qualification && <p className="text-muted small mb-1">{m.qualification}</p>}

                <div className="d-flex justify-content-center gap-2 mt-3">
                  <button className="btn btn-sm btn-outline-primary" onClick={() => openModal(m)}>
                    <FaEdit />
                  </button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => deleteMember(m.id)}>
                    <FaTrash />
                  </button>
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => toggleVisibility(m)}>
                    {m.visibility ? <FaEye /> : <FaEyeSlash />}
                  </button>
                </div>

                <div className="mt-3">
                  {m.phone && <div className="small"><strong>📞</strong> {m.phone}</div>}
                  {m.email && <div className="small"><strong>✉️</strong> {m.email}</div>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <div className="modal fade" ref={modalRef}>
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{form.id ? "Edit Member" : "Add Member"}</h5>
              <button className="btn-close" onClick={closeModal}></button>
            </div>

            <div className="modal-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="fw-semibold">Full Name</label>
                  <input className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>

                <div className="col-md-6">
                  <label className="fw-semibold">Designation</label>
                  <input className="form-control" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} />
                </div>

                <div className="col-md-6">
                  <label className="fw-semibold">Qualification</label>
                  <input className="form-control" value={form.qualification} onChange={(e) => setForm({ ...form, qualification: e.target.value })} />
                </div>

                <div className="col-md-6">
                  <label className="fw-semibold">Phone</label>
                  <input className="form-control" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>

                <div className="col-md-12">
                  <label className="fw-semibold">Email</label>
                  <input className="form-control" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>

                <div className="col-md-6">
                  <label className="fw-semibold">Photo</label>
                  <input type="file" className="form-control" onChange={handlePhoto} />
                  {form.preview && <img src={form.preview} alt="preview" className="mt-3 rounded shadow-sm" style={{ width: "100%", maxHeight: 200, objectFit: "cover" }} />}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
              <button className="btn btn-primary" onClick={saveTeam} disabled={saving}>{saving ? "Saving..." : "Save"}</button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      <div className="toast-container position-fixed top-0 end-0 p-3">
        <div className="toast text-bg-success border-0 shadow-lg" ref={toastRef}>
          <div className="d-flex">
            <div className="toast-body fw-semibold"></div>
            <button type="button" className="btn-close btn-close-white me-2 m-auto"></button>
          </div>
        </div>
      </div>
    </div>
  );
}
