import React, { useEffect, useState, useRef } from "react";
import DataTable from "react-data-table-component";
import adminapi from "../../api/adminapi";
import { FaPlus } from "react-icons/fa";
import * as bootstrap from "bootstrap";

export default function News() {
  const [newsList, setNewsList] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    id: null,
    title: "",
    summary: "",
    content: "",
    visibility: 1,
    published_at: "",
  });
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // Bootstrap refs
  const modalRef = useRef(null);
  const imageModalRef = useRef(null);
  const toastRef = useRef(null);
  const modalInstance = useRef(null);
  const imageModalInstance = useRef(null);
  const toastInstance = useRef(null);

  // Fetch News
  const fetchNews = async () => {
    try {
      const res = await adminapi.get("/admin/news");
      setNewsList(res.data);
      setFilteredNews(res.data);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  useEffect(() => {
    fetchNews();

    if (modalRef.current)
      modalInstance.current = new bootstrap.Modal(modalRef.current, { backdrop: "static" });
    if (imageModalRef.current)
      imageModalInstance.current = new bootstrap.Modal(imageModalRef.current, {});
    if (toastRef.current)
      toastInstance.current = new bootstrap.Toast(toastRef.current);
  }, []);

  // Search filter
  useEffect(() => {
    if (search) {
      setFilteredNews(
        newsList.filter((n) =>
          n.title.toLowerCase().includes(search.toLowerCase())
        )
      );
    } else {
      setFilteredNews(newsList);
    }
  }, [search, newsList]);

  // Toast message
  const showToast = (message, type = "success") => {
    if (toastRef.current) {
      const el = toastRef.current;
      const body = el.querySelector(".toast-body");
      body.innerText = message;
      el.classList.remove("text-bg-success", "text-bg-danger", "text-bg-warning");
      el.classList.add(`text-bg-${type}`);
      toastInstance.current?.show();
    }
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    if (isNaN(d)) return ""; // invalid date fallback
    
    // Format to YYYY-MM-DDTHH:MM
    return d.toISOString().slice(0, 16);
  };

  // Open Modal
  const openModal = (item = null) => {
    if (!modalInstance.current) return;
    if (item) {
    setForm({
        id: item.id,
        title: item.title,
        summary: item.summary,
        content: item.content,
        visibility: item.visibility,
        published_at: formatDateForInput(item.published_at),
        image_url: item.image_url,
      });
      setImage(null);
    } else {
      setForm({
        id: null,
        title: "",
        summary: "",
        content: "",
        visibility: 1,
        published_at: "",
      });
      setImage(null);
    }
    modalInstance.current.show();
  };

  const closeModal = () => modalInstance.current?.hide();

  // Save (Add/Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("summary", form.summary);
    formData.append("content", form.content);
    formData.append("visibility", form.visibility);
    if (form.published_at) formData.append("published_at", form.published_at);
    if (image) formData.append("image_url", image);

    try {
      if (form.id) {
        await adminapi.post(`/admin/news/${form.id}?_method=PUT`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showToast("News updated successfully!");
      } else {
        await adminapi.post("/admin/news", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showToast("News added successfully!");
      }
      fetchNews();
      closeModal();
    } catch (error) {
      console.error("Save error:", error);
      showToast("Failed to save news.", "danger");
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this news item?")) {
      try {
        await adminapi.delete(`/admin/news/${id}`);
        fetchNews();
        showToast("News deleted successfully!");
      } catch (error) {
        console.error("Delete error:", error);
        showToast("Failed to delete news.", "danger");
      }
    }
  };

  const handleImageClick = (url) => {
    setPreviewImage(url);
    imageModalInstance.current?.show();
  };

  // Table columns
  const columns = [
    { name: "#", selector: (row, i) => i + 1, width: "60px" },
    { name: "Title", selector: (row) => row.title, sortable: true },
    {
      name: "Summary",
      selector: (row) =>
        row.summary ? row.summary.substring(0, 60) + "..." : "—",
      grow: 2,
    },
    {
      name: "Visibility",
      cell: (row) => (
        <span className={`badge bg-${row.visibility ? "success" : "secondary"}`}>
          {row.visibility ? "Visible" : "Hidden"}
        </span>
      ),
    },
    {
      name: "Published",
      selector: (row) => row.published_at?.split("T")[0] || "—",
    },
    {
      name: "Image",
      cell: (row) =>
        row.image_url ? (
          <div
            style={{ cursor: "pointer" }}
            onClick={() => handleImageClick(`http://127.0.0.1:8000/storage/${row.image_url}`)}
          >
            <img
              src={`http://127.0.0.1:8000/storage/${row.image_url}`}
              alt="News"
              style={{
                width: "70px",
                height: "50px",
                objectFit: "cover",
                borderRadius: "6px",
              }}
            />
          </div>
        ) : (
          "—"
        ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="d-flex gap-2">
          <button
            className="btn btn-sm btn-outline-primary rounded-pill px-3 py-1"
            onClick={() => openModal(row)}
          >
            Edit
          </button>
          <button
            className="btn btn-sm btn-outline-danger rounded-pill px-3 py-1"
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold label-primary mb-0">News Management</h3>
          <p className="text-muted mb-0 small">Manage, edit, and publish news articles.</p>
        </div>
        <button className="btn btn-primary shadow-sm px-3" onClick={() => openModal()}>
          <FaPlus className="me-2" /> Add News
        </button>
      </div>

      {/* DataTable */}
      <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
        <div className="card-body">
          <DataTable
            columns={columns}
            data={filteredNews}
            pagination
            paginationPerPage={10}
            highlightOnHover
            striped
            dense
            responsive
            pointerOnHover
            subHeader
            subHeaderComponent={
              <div className="d-flex justify-content-between align-items-center w-100">
                <input
                  type="text"
                  placeholder="🔍 Search news..."
                  className="form-control w-50 rounded-pill px-3 shadow-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ maxWidth: "320px" }}
                />
                <div className="text-muted small">
                  Showing <strong>{filteredNews.length}</strong> of{" "}
                  <strong>{newsList.length}</strong> entries
                </div>
              </div>
            }
          />
        </div>
      </div>

      {/* Modal */}
      <div className="modal fade" ref={modalRef} tabIndex="-1">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg rounded-4">
            <div className="modal-header bg-light border-0">
              <h5 className="modal-title fw-semibold">
                {form.id ? "Edit News" : "Add News"}
              </h5>
              <button type="button" className="btn-close" onClick={closeModal}></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Title</label>
                  <input
                    type="text"
                    className="form-control shadow-sm"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Summary</label>
                  <textarea
                    className="form-control shadow-sm"
                    rows="2"
                    value={form.summary}
                    onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Content</label>
                  <textarea
                    className="form-control shadow-sm"
                    rows="5"
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Published At</label>
                  <input
                    type="datetime-local"
                    className="form-control shadow-sm"
                    value={form.published_at || ""}
                    onChange={(e) => setForm({ ...form, published_at: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Image</label>
                  <input
                    type="file"
                    className="form-control shadow-sm"
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                  {form.image_url && (
                    <img
                      src={`http://127.0.0.1:8000/storage/${form.image_url}`}
                      alt=""
                      className="mt-3 rounded-3 shadow-sm border"
                      style={{ height: "100px", objectFit: "cover" }}
                    />
                  )}
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Visibility</label>
                  <select
                    className="form-select shadow-sm"
                    value={form.visibility}
                    onChange={(e) => setForm({ ...form, visibility: e.target.value })}
                  >
                    <option value={1}>Visible</option>
                    <option value={0}>Hidden</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer border-0">
                <button type="submit" className="btn btn-success px-4">Save</button>
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      <div className="modal fade" ref={imageModalRef} tabIndex="-1">
        <div className="modal-dialog modal-fullscreen">
          <div className="modal-content bg-dark border-0">
            <div className="modal-header border-0">
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={() => imageModalInstance.current?.hide()}
              ></button>
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

      {/* Toast Notification */}
      <div
        className="toast-container position-fixed top-0 end-0 p-3"
        style={{ zIndex: 1080 }}
      >
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
              data-bs-dismiss="toast"
              aria-label="Close"
            ></button>
          </div>
        </div>
      </div>
    </div>
  );
}
