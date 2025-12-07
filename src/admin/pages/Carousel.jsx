import React, { useEffect, useState, useRef } from "react";
import DataTable from "react-data-table-component";
import adminapi from "../../api/adminapi";
import * as bootstrap from "bootstrap";
import { FaPlus } from "react-icons/fa";

export default function Carousel() {
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    id: null,
    title: "",
    subtitle: "",
    link: "",
    position: 0,
    active: 1,
    image_url: "",
  });

  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // Refs
  const modalRef = useRef(null);
  const previewRef = useRef(null);
  const toastRef = useRef(null);

  const modalInstance = useRef(null);
  const previewInstance = useRef(null);
  const toastInstance = useRef(null);

  // Fetch items
  const fetchItems = async () => {
    const res = await adminapi.get("/admin/carousel-items");
    setItems(res.data);
    setFiltered(res.data);
  };

  useEffect(() => {
    fetchItems();
    modalInstance.current = new bootstrap.Modal(modalRef.current);
    previewInstance.current = new bootstrap.Modal(previewRef.current);
    toastInstance.current = new bootstrap.Toast(toastRef.current);
  }, []);

  // Search handler
  useEffect(() => {
    if (!search.trim()) return setFiltered(items);
    setFiltered(
      items.filter((i) =>
        i.title?.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, items]);

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
        subtitle: "",
        link: "",
        position: 0,
        active: 1,
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
    Object.keys(form).forEach((key) => {
      if (key !== "image_url") fd.append(key, form[key]);
    });
    if (image) fd.append("image_url", image);

    try {
      if (form.id) {
        await adminapi.post(`/admin/carousel-items/${form.id}?_method=PUT`, fd);
        showToast("Carousel item updated!");
      } else {
        await adminapi.post("/admin/carousel-items", fd);
        showToast("Carousel item added!");
      }
      fetchItems();
      closeModal();
    } catch (err) {
      if (err.response?.status === 422) {
        const msg = Object.values(err.response.data.errors)[0][0];
        showToast(msg, "danger");
      } else showToast("Something went wrong!", "danger");
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this carousel item?")) return;
    try {
      await adminapi.delete(`/admin/carousel-items/${id}`);
      fetchItems();
      showToast("Item deleted!");
    } catch {
      showToast("Delete error", "danger");
    }
  };

  // Preview Image
  const previewModal = (url) => {
    setPreviewImage(`http://127.0.0.1:8000/storage/${url}`);
    previewInstance.current.show();
  };

  // TABLE COLUMNS
  const columns = [
    { name: "#", selector: (row, i) => i + 1, width: "60px" },
    { name: "Title", selector: (r) => r.title },
    { name: "Subtitle", selector: (r) => r.subtitle || "—" },
    { name: "Position", selector: (r) => r.position, sortable: true },
    {
      name: "Status",
      cell: (row) => (
        <span className={`badge bg-${row.active ? "success" : "secondary"}`}>
          {row.active ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      name: "Image",
      cell: (row) => (
        <img
          src={`http://127.0.0.1:8000/storage/${row.image_url}`}
          alt=""
          className="img-thumbnail shadow-sm"
          style={{ width: "70px", height: "50px", objectFit: "cover", cursor: "pointer" }}
          onClick={() => previewModal(row.image_url)}
        />
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
    <div className="p-4">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold label-primary">Carousel Management</h3>
          <p className="text-muted small mb-0">Manage homepage slider items</p>
        </div>
        <button className="btn btn-primary shadow-sm px-3" onClick={() => openModal()}>
          <FaPlus className="me-2" /> Add Item
        </button>
      </div>

      {/* Table */}
      <div className="card shadow-sm border-0 rounded-4 p-3">
        <DataTable
          columns={columns}
          data={filtered}
          pagination
          highlightOnHover
          striped
          dense
          pointerOnHover
          responsive
          customStyles={{
            rows: { style: { paddingTop: "12px", paddingBottom: "12px" } },
          }}
          subHeader
          subHeaderComponent={
            <input
              type="text"
              placeholder="🔍 Search carousel..."
              className="form-control w-50 rounded-pill px-3 shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ maxWidth: "320px" }}
            />
          }
        />
      </div>

      {/* Add/Edit Modal */}
      <div className="modal fade" ref={modalRef} tabIndex="-1">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content rounded-4 shadow-lg">

            <div className="modal-header bg-light border-0">
              <h5 className="modal-title">{form.id ? "Edit Item" : "Add Item"}</h5>
              <button className="btn-close" onClick={closeModal}></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">

                <div className="mb-3">
                  <label className="fw-semibold">Title</label>
                  <input
                    className="form-control shadow-sm"
                    value={form.title ?? ''}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="fw-semibold">Subtitle</label>
                  <input
                    className="form-control shadow-sm"
                    value={form.subtitle ?? ''}
                    onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  />
                </div>

                <div className="mb-3">
                  <label className="fw-semibold">Link</label>
                  <input
                    className="form-control shadow-sm"
                    value={form.link ?? ''}
                    onChange={(e) => setForm({ ...form, link: e.target.value })}
                  />
                </div>

                <div className="mb-3">
                  <label className="fw-semibold">Position</label>
                  <input
                    type="number"
                    className="form-control shadow-sm"
                    value={form.position}
                    onChange={(e) => setForm({ ...form, position: e.target.value })}
                  />
                </div>

                <div className="mb-3">
                  <label className="fw-semibold">Status</label>
                  <select
                    className="form-select shadow-sm"
                    value={form.active}
                    onChange={(e) => setForm({ ...form, active: e.target.value })}
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="fw-semibold">Upload Image</label>
                  <input type="file" className="form-control shadow-sm" onChange={(e) => setImage(e.target.files[0])} />
                  {form.image_url && (
                    <img
                      src={`http://127.0.0.1:8000/storage/${form.image_url}`}
                      className="mt-3 rounded shadow-sm"
                      style={{ height: "100px", objectFit: "cover" }}
                      alt=""
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

      {/* Preview Modal */}
      <div className="modal fade" ref={previewRef} tabIndex="-1">
        <div className="modal-dialog modal-fullscreen">
          <div className="modal-content bg-dark">
            <div className="modal-header border-0">
              <button className="btn-close btn-close-white" onClick={() => previewInstance.current.hide()}></button>
            </div>
            <div className="modal-body d-flex justify-content-center align-items-center">
              <img
                src={previewImage}
                className="img-fluid rounded shadow-lg"
                style={{ maxHeight: "90vh" }}
                alt="Preview"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
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
