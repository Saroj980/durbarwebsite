import React, { useEffect, useState, useRef } from "react";
import DataTable from "react-data-table-component";
import adminapi from "../../api/adminapi";
import * as bootstrap from "bootstrap";
import { FaPlus } from "react-icons/fa";

export default function Gallery() {
  const [gallery, setGallery] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    id: null,
    title: "",
    description: "",
    visibility: 1,
    image_url: "",
  });

  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // Bootstrap Refs
  const modalRef = useRef(null);
  const previewRef = useRef(null);
  const toastRef = useRef(null);

  const modalInstance = useRef(null);
  const previewInstance = useRef(null);
  const toastInstance = useRef(null);

  // Fetch gallery
  const fetchGallery = async () => {
    const res = await adminapi.get("/admin/gallery");
    setGallery(res.data);
    setFiltered(res.data);
  };

  useEffect(() => {
    fetchGallery();

    modalInstance.current = new bootstrap.Modal(modalRef.current);
    previewInstance.current = new bootstrap.Modal(previewRef.current);
    toastInstance.current = new bootstrap.Toast(toastRef.current);
  }, []);

  // Search
  useEffect(() => {
    if (search.trim() === "") setFiltered(gallery);
    else {
      setFiltered(
        gallery.filter((g) =>
          g.title.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, gallery]);

  // Toast
  const showToast = (msg, type = "success") => {
    const toast = toastRef.current;
    toast.classList.remove("text-bg-success", "text-bg-danger");
    toast.classList.add(`text-bg-${type}`);
    toast.querySelector(".toast-body").innerText = msg;
    toastInstance.current.show();
  };

  // Open modal
  const openModal = (item = null) => {
    if (item) {
      setForm(item);
      setImage(null);
    } else {
      setForm({
        id: null,
        title: "",
        description: "",
        visibility: 1,
        image_url: "",
      });
      setImage(null);
    }
    modalInstance.current.show();
  };

  const closeModal = () => modalInstance.current.hide();

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("description", form.description);
    fd.append("visibility", form.visibility);

    if (image) fd.append("image_url", image);

    try {
      if (form.id) {
        await adminapi.post(`/admin/gallery/${form.id}?_method=PUT`, fd);
        showToast("Gallery updated successfully!");
      } else {
        await adminapi.post(`/admin/gallery`, fd);
        showToast("Image added to gallery!");
      }

      fetchGallery();
      closeModal();
    } catch (err) {
      console.error(err);
      if (err.response?.status === 422) {
        const firstError = Object.values(err.response.data.errors)[0][0];
        showToast(firstError, "danger");
      } else showToast("Something went wrong!", "danger");
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this image?")) return;

    try {
      await adminapi.delete(`/admin/gallery/${id}`);
      fetchGallery();
      showToast("Image deleted!");
    } catch {
      showToast("Error deleting image", "danger");
    }
  };

  // Preview image
  const previewModal = (url) => {
    setPreviewImage(`http://127.0.0.1:8000/storage/${url}`);
    previewInstance.current.show();
  };

  // Table columns
  const columns = [
    { name: "#", selector: (row, i) => i + 1, width: "60px" },
    { name: "Title", selector: (r) => r.title, sortable: true },
    {
      name: "Visibility",
      cell: (row) => (
        <span className={`badge bg-${row.visibility ? "success" : "secondary"}`}>
          {row.visibility ? "Visible" : "Hidden"}
        </span>
      ),
    },
    {
      name: "Image",
      cell: (row) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => previewModal(row.image_url)}
        >
          <img
            src={`http://127.0.0.1:8000/storage/${row.image_url}`}
            alt=""
            style={{
              width: "70px",
              height: "50px",
              objectFit: "cover",
              borderRadius: "6px",
            }}
          />
        </div>
      ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="d-flex gap-2">
          <button
            className="btn btn-sm btn-outline-primary rounded-pill px-3"
            onClick={() => openModal(row)}
          >
            Edit
          </button>
          <button
            className="btn btn-sm btn-outline-danger rounded-pill px-3"
            onClick={() => handleDelete(row.id)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 position-relative">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold label-primary">Gallery Management</h3>
          <p className="text-muted mb-0 small">Manage gallery photos</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <FaPlus className="me-2" /> Add Image
        </button>
      </div>

      {/* Table */}
      <div className="card shadow-sm border-0 rounded-4 p-3">
        <DataTable
          columns={columns}
          data={filtered}
          pagination
          paginationPerPage={20}
          highlightOnHover
          striped
          dense
          responsive
          pointerOnHover
          subHeader
          subHeaderComponent={
            <input
              type="text"
              placeholder="🔍 Search image..."
              className="form-control w-50 rounded-pill px-3 shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          }
        />
      </div>

      {/* Add/Edit Modal */}
      <div className="modal fade" ref={modalRef} tabIndex="-1">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content rounded-4">
            <div className="modal-header bg-light border-0">
              <h5 className="modal-title">{form.id ? "Edit Image" : "Add Image"}</h5>
              <button className="btn-close" onClick={closeModal}></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">

                <div className="mb-3">
                  <label className="fw-semibold">Title</label>
                  <input
                    className="form-control shadow-sm"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                </div>

                <div className="mb-3">
                  <label className="fw-semibold">Description</label>
                  <textarea
                    className="form-control shadow-sm"
                    rows="3"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>

                <div className="mb-3">
                  <label className="fw-semibold">Visibility</label>
                  <select
                    className="form-select shadow-sm"
                    value={form.visibility}
                    onChange={(e) => setForm({ ...form, visibility: e.target.value })}
                  >
                    <option value={1}>Visible</option>
                    <option value={0}>Hidden</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="fw-semibold">Upload Image</label>
                  <input
                    type="file"
                    className="form-control shadow-sm"
                    onChange={(e) => setImage(e.target.files[0])}
                  />

                  {form.image_url && (
                    <img
                      src={`http://127.0.0.1:8000/storage/${form.image_url}`}
                      alt=""
                      className="mt-3 rounded shadow-sm"
                      style={{ height: "100px", objectFit: "cover" }}
                    />
                  )}
                </div>

              </div>

              <div className="modal-footer border-0">
                <button className="btn btn-success px-4">Save</button>
                <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
              </div>

            </form>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      <div className="modal fade" ref={previewRef} tabIndex="-1">
        <div className="modal-dialog modal-fullscreen">
          <div className="modal-content bg-dark">
            <div className="modal-header border-0">
              <button className="btn-close btn-close-white" onClick={() => previewInstance.current.hide()}></button>
            </div>
            <div className="modal-body d-flex justify-content-center align-items-center">
              {previewImage && (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="img-fluid rounded shadow-lg"
                  style={{ maxHeight: "90vh" }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      <div className="toast-container position-fixed top-0 end-0 p-3">
        <div
          className="toast align-items-center text-bg-success border-0 shadow-lg"
          role="alert"
          ref={toastRef}
        >
          <div className="d-flex">
            <div className="toast-body fw-semibold"></div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
            ></button>
          </div>
        </div>
      </div>

    </div>
  );
}
