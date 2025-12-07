import React, { useEffect, useState, useRef } from "react";
import DataTable from "react-data-table-component";
import adminapi from "../../api/adminapi";
import * as bootstrap from "bootstrap";
import { FaPlus, FaTrash, FaEdit, FaEye, FaEyeSlash, FaDownload } from "react-icons/fa";

export default function AdminDownloads() {
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    id: null,
    title: "",
    description: "",
    visibility: 1,
    file_url: null,
    preview: null,
  });

  const [saving, setSaving] = useState(false);

  const modalRef = useRef(null);
  const toastRef = useRef(null);
  const imagePreviewRef = useRef(null);

  const modalInstance = useRef(null);
  const toastInstance = useRef(null);
  const imagePreviewInstance = useRef(null);

  const [previewImage, setPreviewImage] = useState(null);

  const base = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    if (toastRef.current)
      toastInstance.current = bootstrap.Toast.getOrCreateInstance(toastRef.current);

    if (modalRef.current)
      modalInstance.current = bootstrap.Modal.getOrCreateInstance(modalRef.current);

    if (imagePreviewRef.current)
      imagePreviewInstance.current = bootstrap.Modal.getOrCreateInstance(imagePreviewRef.current);

    loadItems();
  }, []);

  const showToast = (msg, type = "success") => {
    const el = toastRef.current;
    const body = el.querySelector(".toast-body");

    body.innerText = msg;
    el.classList.remove("text-bg-success", "text-bg-danger");
    el.classList.add(`text-bg-${type}`);

    toastInstance.current.show();
  };

  const loadItems = async () => {
    try {
      const res = await adminapi.get("/admin/downloads");
      setItems(res.data || []);
      setFiltered(res.data || []);
    } catch (err) {
      showToast("Failed to load downloads", "danger");
    }
  };

  const openModal = (item = null) => {
    if (item) {
      setForm({
        id: item.id,
        title: item.title,
        description: item.description,
        visibility: item.visibility,
        file_url: null,
        preview: `${base}storage/${item.file_url}`,
      });
    } else {
      setForm({
        id: null,
        title: "",
        description: "",
        visibility: 1,
        file_url: null,
        preview: null,
      });
    }
    modalInstance.current.show();
  };

  const closeModal = () => modalInstance.current.hide();

  const handleFile = (e) => {
    const file = e.target.files[0];
    setForm({
      ...form,
      file_url: file,
      preview: file.type.startsWith("image") ? URL.createObjectURL(file) : null,
    });
  };

  const saveItem = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("visibility", form.visibility);

      if (form.file_url) {
        fd.append("file_url", form.file_url);
      }

      if (form.id) {
        await adminapi.post(`/admin/downloads/${form.id}?_method=PUT`, fd);
        showToast("Download updated!");
      } else {
        await adminapi.post(`/admin/downloads`, fd);
        showToast("Download added!");
      }

      closeModal();
      loadItems();
    } catch (err) {
      showToast("Failed to save", "danger");
    }
    setSaving(false);
  };

  const deleteItem = async (id) => {
    if (!window.confirm("Delete this file?")) return;

    try {
      await adminapi.delete(`/admin/downloads/${id}`);
      showToast("Deleted!");
      loadItems();
    } catch {
      showToast("Failed to delete", "danger");
    }
  };

  const toggleVisibility = async (item) => {
    try {
      await adminapi.post(`/admin/downloads/${item.id}?_method=PUT`, {
        title: item.title,
        description: item.description,
        visibility: item.visibility ? 0 : 1,
      });
      showToast("Visibility updated");
      loadItems();
    } catch {
      showToast("Failed to update", "danger");
    }
  };

  const handleImageClick = (url) => {
    setPreviewImage(url);
    imagePreviewInstance.current.show();
  };

  useEffect(() => {
    setFiltered(
      items.filter((i) =>
        i.title.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, items]);

  const isImage = (file) =>
    file.endsWith(".jpg") ||
    file.endsWith(".jpeg") ||
    file.endsWith(".png") ||
    file.endsWith(".webp");

  const columns = [
    { name: "#", selector: (row, i) => i + 1, width: "60px" },

    {
      name: "File",
      cell: (row) =>
        isImage(row.file_url) ? (
          <img
            src={`${base}storage/${row.file_url}`}
            alt="file"
            onClick={() => handleImageClick(`${base}storage/${row.file_url}`)}
            style={{
              width: 60,
              height: 40,
              objectFit: "cover",
              cursor: "pointer",
              borderRadius: "6px",
            }}
          />
        ) : (
          <a
            href={`${base}storage/${row.file_url}`}
            target="_blank"
            rel="noreferrer"
            className="btn btn-sm btn-outline-primary"
          >
            <FaDownload /> File
          </a>
        ),
      width: "120px",
    },

    { name: "Title", selector: (row) => row.title, sortable: true },

    {
      name: "Visibility",
      cell: (row) =>
        row.visibility ? (
          <span className="badge bg-success">Visible</span>
        ) : (
          <span className="badge bg-secondary">Hidden</span>
        ),
      width: "120px",
    },

    {
      name: "Actions",
      cell: (row) => (
        <div className="d-flex gap-2">
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => openModal(row)}
          >
            <FaEdit />
          </button>

          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => deleteItem(row.id)}
          >
            <FaTrash />
          </button>

          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => toggleVisibility(row)}
          >
            {row.visibility ? <FaEye /> : <FaEyeSlash />}
          </button>
        </div>
      ),
      width: "180px",
    },
  ];

  return (
    <div className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h3 className="fw-bold label-primary mb-0">Download Management</h3>
                <p className="text-muted mb-0 small">Manage downloadable files and documents</p>
            </div>
            <button className="btn btn-primary shadow-sm px-3" onClick={() => openModal()}>
                <FaPlus className="me-2" /> Add File
            </button>
        </div>

      {/* <div className="d-flex justify-content-between mb-4">
        <div>
          <h3 className="fw-bold label-primary">Download Management</h3>
          <p className="text-muted small mb-0">Manage downloadable files and documents</p>
        </div>

        <button className="btn btn-primary" onClick={() => openModal()}>
          <FaPlus /> Add File
        </button>
      </div> */}

      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body">
          <DataTable
            columns={columns}
            data={filtered}
            pagination
            striped
            highlightOnHover
            subHeader
            subHeaderComponent={
              <input
                type="text"
                className="form-control w-25"
                placeholder="Search files..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            }
          />
        </div>
      </div>

      {/* Modal */}
      <div className="modal fade" ref={modalRef}>
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">

            <div className="modal-header">
              <h5 className="modal-title">{form.id ? "Edit File" : "Add File"}</h5>
              <button className="btn-close" onClick={closeModal}></button>
            </div>

            <div className="modal-body">
              <div className="row g-3">

                <div className="col-md-6">
                  <label className="fw-semibold">Title</label>
                  <input
                    className="form-control"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                </div>

                <div className="col-md-6">
                  <label className="fw-semibold">File</label>
                  <input type="file" className="form-control" onChange={handleFile} />
                </div>

                <div className="col-12">
                  <label className="fw-semibold">Description</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                  />
                </div>

                {form.preview && isImage(form.preview) && (
                  <div className="col-12">
                    <img
                      src={form.preview}
                      className="mt-3 rounded shadow-sm"
                      style={{ width: "100%", maxHeight: 200, objectFit: "contain" }}
                      alt="Preview"
                    />
                  </div>
                )}

              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button className="btn btn-primary" disabled={saving} onClick={saveItem}>
                {saving ? "Saving..." : "Save"}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Image Preview */}
      <div className="modal fade" ref={imagePreviewRef}>
        <div className="modal-dialog modal-fullscreen">
          <div className="modal-content bg-dark border-0">
            <div className="modal-header border-0">
              <button
                className="btn-close btn-close-white"
                onClick={() => imagePreviewInstance.current.hide()}
              ></button>
            </div>
            <div className="modal-body d-flex justify-content-center align-items-center">
              {previewImage && (
                <img
                  src={previewImage}
                  className="img-fluid rounded shadow"
                  alt={previewImage}
                  style={{ maxHeight: "90vh" }}
                />
              )}
            </div>
          </div>
        </div>
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
