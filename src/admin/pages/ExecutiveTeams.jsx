import React, { useEffect, useState, useRef } from "react";
import adminapi from "../../api/adminapi";
import * as bootstrap from "bootstrap";
import { FaPlus, FaTrash, FaEdit, FaEyeSlash, FaEye } from "react-icons/fa";

export default function ExecutiveTeams() {
  const [teams, setTeams] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: "",
    position: "",
    description: "",
    visibility: 1,
    image: null,
    preview: null,
  });

  const [saving, setSaving] = useState(false);

  const modalRef = useRef(null);
  const modalInstance = useRef(null);

  const toastRef = useRef(null);
  const toastInstance = useRef(null);

  const base = process.env.REACT_APP_API_BASE_URL;

  // -------------------- INIT MODAL + TOAST --------------------
  useEffect(() => {
    if (toastRef.current) {
      toastInstance.current = bootstrap.Toast.getOrCreateInstance(toastRef.current);
    }

    if (modalRef.current) {
      modalInstance.current = bootstrap.Modal.getOrCreateInstance(modalRef.current);
    }

    loadTeams();
  }, []);

  // -------------------- TOAST --------------------
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

  // -------------------- LOAD MEMBERS --------------------
  const loadTeams = async () => {
    try {
      const res = await adminapi.get("/admin/executive-teams");
      setTeams(res.data || []);
    } catch (err) {
      showToast("Failed to load teams", "danger");
    }
  };

  // -------------------- OPEN MODAL --------------------
  const openModal = (member = null) => {
    if (member) {
      setForm({
        id: member.id,
        name: member.name,
        position: member.position,
        description: member.description,
        visibility: member.visibility,
        image: null,
        preview: `${base}storage/${member.image}`,
      });
    } else {
      setForm({
        id: null,
        name: "",
        position: "",
        description: "",
        visibility: 1,
        image: null,
        preview: null,
      });
    }

    if (!modalInstance.current) {
      modalInstance.current = bootstrap.Modal.getOrCreateInstance(modalRef.current);
    }

    modalInstance.current.show();
  };

  // -------------------- CLOSE MODAL --------------------
  const closeModal = () => {
    if (!modalInstance.current) {
      modalInstance.current = bootstrap.Modal.getOrCreateInstance(modalRef.current);
    }

    modalInstance.current.hide();
  };

  // -------------------- IMAGE PICK --------------------
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setForm({ ...form, image: file, preview: URL.createObjectURL(file) });
  };

  // -------------------- SAVE MEMBER --------------------
  const saveTeam = async () => {
    setSaving(true);

    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("position", form.position);
      fd.append("description", form.description ?? "");
      fd.append("visibility", form.visibility);

      if (form.image) {
        fd.append("image", form.image);
      }

      if (form.id) {
        await adminapi.post(`/admin/executive-teams/${form.id}?_method=PUT`, fd);
        showToast("Member updated successfully!");
      } else {
        await adminapi.post(`/admin/executive-teams`, fd);
        showToast("New member added!");
      }

      closeModal();
      loadTeams();

    } catch (err) {
      showToast("Failed to save!", "danger");
    }

    setSaving(false);
  };

  // -------------------- DELETE MEMBER --------------------
  const deleteTeam = async (id) => {
    if (!window.confirm("Delete this member?")) return;

    try {
      await adminapi.delete(`/admin/executive-teams/${id}`);
      showToast("Member deleted!");
      loadTeams();
    } catch {
      showToast("Failed to delete!", "danger");
    }
  };

  // -------------------- TOGGLE VISIBILITY --------------------
  const toggleVisibility = async (member) => {
    try {
      await adminapi.post(`/admin/executive-teams/${member.id}?_method=PUT`, {
        name: member.name,
        position: member.position,
        description: member.description,
        visibility: member.visibility ? 0 : 1,
      });

      showToast("Visibility updated!");
      loadTeams();
    } catch {
      showToast("Error updating visibility", "danger");
    }
  };

  // -------------------- UI --------------------
  return (
    <div className="p-4">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold label-primary">Executive Team</h3>
          <p className="text-muted small mb-0">Manage school executive members</p>
        </div>

        <button className="btn btn-primary" onClick={() => openModal()}>
          <FaPlus /> Add Member
        </button>
      </div>

      {/* Grid */}
      <div className="row g-4">
        {teams.map((member) => (
          <div className="col-md-4 col-lg-3" key={member.id}>
            <div className="card shadow-sm">

              <img
                src={`${base}storage/${member.image}`}
                className="card-img-top"
                style={{ height: "220px", objectFit: "cover" }}
                alt={member.name}
              />

              <div className="card-body text-center">
                <h5 className="fw-bold">{member.name}</h5>
                <p className="text-muted small">{member.position}</p>

                <div className="d-flex justify-content-center gap-3 mt-3">
                  <button className="btn btn-sm btn-outline-primary" onClick={() => openModal(member)}>
                    <FaEdit />
                  </button>

                  <button className="btn btn-sm btn-outline-danger" onClick={() => deleteTeam(member.id)}>
                    <FaTrash />
                  </button>

                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => toggleVisibility(member)}
                  >
                    {member.visibility ? <FaEye /> : <FaEyeSlash />}
                  </button>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
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
                  <input
                    className="form-control"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div className="col-md-6">
                  <label className="fw-semibold">Position</label>
                  <input
                    className="form-control"
                    value={form.position}
                    onChange={(e) => setForm({ ...form, position: e.target.value })}
                  />
                </div>

                <div className="col-12">
                  <label className="fw-semibold">Description</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>

                <div className="col-md-6">
                  <label className="fw-semibold">Photo</label>
                  <input type="file" className="form-control" onChange={handleImage} />

                  {form.preview && (
                    <img
                      src={form.preview}
                      alt={form.preview}
                      className="mt-3 rounded shadow-sm"
                      style={{ width: "100%", maxHeight: 200, objectFit: "cover" }}
                    />
                  )}
                </div>

              </div>

            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
              <button className="btn btn-primary" disabled={saving} onClick={saveTeam}>
                {saving ? "Saving..." : "Save"}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* TOAST */}
      <div className="toast-container position-fixed top-0 end-0 p-3">
        <div className="toast text-bg-success border-0 shadow-lg" ref={toastRef}>
          <div className="d-flex">
            <div className="toast-body fw-semibold"></div>
            <button className="btn-close btn-close-white me-2 m-auto"></button>
          </div>
        </div>
      </div>

    </div>
  );
}
