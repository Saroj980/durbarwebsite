import React, { useEffect, useState, useRef } from "react";
import DataTable from "react-data-table-component";
import adminapi from "../../api/adminapi";
import * as bootstrap from "bootstrap";
import { FaPlus, FaFilePdf, } from "react-icons/fa";

export default function Notices() {
  const [notices, setNotices] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    id: null,
    title: "",
    description: "",
    popup: "no",
    visibility: 1,
    published_at: "",
    file_url: null,
  });

  const [file, setFile] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);

  // Bootstrap Refs
  const modalRef = useRef(null);
  const previewRef = useRef(null);
  const toastRef = useRef(null);
  const modalInstance = useRef(null);
  const previewInstance = useRef(null);
  const toastInstance = useRef(null);

  // Fetch Notice List
  const fetchNotices = async () => {
    const res = await adminapi.get("/admin/notices");
    setNotices(res.data);
    setFiltered(res.data);
  };

  useEffect(() => {
    fetchNotices();

    modalInstance.current = new bootstrap.Modal(modalRef.current);
    previewInstance.current = new bootstrap.Modal(previewRef.current);
    toastInstance.current = new bootstrap.Toast(toastRef.current);
  }, []);

  // Search filter
  useEffect(() => {
    if (search.trim() === "") setFiltered(notices);
    else {
      setFiltered(
        notices.filter((n) =>
          n.title.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, notices]);

  // Toast
  const showToast = (msg, type = "success") => {
    const toast = toastRef.current;
    toast.classList.remove("text-bg-success", "text-bg-danger");
    toast.classList.add(`text-bg-${type}`);
    toast.querySelector(".toast-body").innerText = msg;
    toastInstance.current.show();
  };

  // Format Date for input
  const formatDate = (str) => {
    if (!str) return "";
    const d = new Date(str);
    return d.toISOString().slice(0, 16);
  };

  // Open modal
  const openModal = (item = null) => {
    if (item) {
      setForm({
        id: item.id,
        title: item.title,
        description: item.description,
        popup: item.popup,
        visibility: item.visibility,
        published_at: formatDate(item.published_at),
        file_url: item.file_url,
      });
      setFile(null);
    } else {
      setForm({
        id: null,
        title: "",
        description: "",
        popup: "no",
        visibility: 1,
        published_at: "",
        file_url: null,
      });
      setFile(null);
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
    fd.append("popup", form.popup);
    fd.append("visibility", form.visibility);
    if (form.published_at) fd.append("published_at", form.published_at);
    if (file) fd.append("file_url", file);

    // console.log(fd);

    try {
      if (form.id) {
        await adminapi.post(`/admin/notices/${form.id}?_method=PUT`, fd);
        showToast("Notice updated successfully!");
      } else {
        await adminapi.post("/admin/notices", fd);
        showToast("Notice added successfully!");
      }
      closeModal();
      fetchNotices();
    } catch (err) {
        console.error("Save Notice Error:", err);

        // Laravel Validation Errors (422)
        if (err.response?.status === 422) {
            const errors = err.response.data.errors;
            const firstError = Object.values(errors)[0][0]; // Extract first message
            showToast(firstError, "danger");
            return;
        }

        // Laravel custom messages
        if (err.response?.data?.message) {
            showToast(err.response.data.message, "danger");
            return;
        }

        // Fallback
        showToast("Something went wrong!", "danger");
        }

  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this notice?")) return;
    try {
      await adminapi.delete(`/admin/notices/${id}`);
      fetchNotices();
      showToast("Notice deleted!");
    } catch {
      showToast("Error deleting notice", "danger");
    }
  };

  // Preview file modal
  const previewFileModal = (file_url) => {
    setPreviewFile(`http://127.0.0.1:8000/storage/${file_url}`);
    previewInstance.current.show();
  };

  // Columns
  const columns = [
    { name: "#", selector: (row, i) => i + 1, width: "60px" },
    { name: "Title", selector: (r) => r.title, sortable: true },
    {
      name: "Popup",
      cell: (row) => (
        <span className={`badge bg-${row.popup === "yes" ? "warning" : "secondary"}`}>
          {row.popup}
        </span>
      ),
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
      name: "File",
      cell: (row) =>
        row.file_url ? (
          <div
            className="text-primary cursor-pointer"
            onClick={() => previewFileModal(row.file_url)}
          >
            <FaFilePdf className="fs-4 text-danger" />
          </div>
        ) : (
          "—"
        ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="d-flex gap-2">
          <button className="btn btn-sm btn-outline-primary rounded-pill px-3"
            onClick={() => openModal(row)}>
            Edit
          </button>
          <button className="btn btn-sm btn-outline-danger rounded-pill px-3"
            onClick={() => handleDelete(row.id)}>
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
          <h3 className="fw-bold label-primary">Notice Management</h3>
          <p className="text-muted mb-0 small">Manage notices & official announcements</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <FaPlus className="me-2" /> Add Notice
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
            customStyles={{
                rows: {
                style: {
                    paddingTop: "14px",
                    paddingBottom: "14px",
                    minHeight: "60px", // optional - makes rows taller
                },
                },
                cells: {
                style: {
                    paddingLeft: "14px",
                    paddingRight: "14px",
                },
                },
            }}
            subHeaderComponent={
              <div className="d-flex justify-content-between align-items-center w-100 py-2">
                <input
                  type="text"
                  placeholder="🔍 Search notices..."
                  className="form-control w-50 rounded-pill px-3 shadow-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ maxWidth: "320px" }}
                />
                <div className="text-muted small">
                  Showing <strong>{filtered.length}</strong> of{" "}
                  <strong>{notices.length}</strong> entries
                </div>
              </div>
            }
          />
      </div>

      {/* Add/Edit Modal */}
      <div className="modal fade" ref={modalRef} tabIndex="-1">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content rounded-4">
            <div className="modal-header bg-light border-0">
              <h5 className="modal-title">{form.id ? "Edit Notice" : "Add Notice"}</h5>
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
                    required
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
                  <label className="fw-semibold">Upload File (pdf/doc/img)</label>
                  <input
                    type="file"
                    className="form-control shadow-sm"
                    onChange={(e) => setFile(e.target.files[0])}
                  />

                  {form.file_url && (
                    <p className="mt-2 small">
                      Current: <strong>{form.file_url.split("/").pop()}</strong>
                    </p>
                  )}
                </div>

                <div className="mb-3">
                  <label className="fw-semibold">Popup</label>
                  <select
                    className="form-select shadow-sm"
                    value={form.popup}
                    onChange={(e) => setForm({ ...form, popup: e.target.value })}
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
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
                  <label className="fw-semibold">Published At</label>
                  <input
                    type="datetime-local"
                    className="form-control shadow-sm"
                    value={form.published_at}
                    onChange={(e) => setForm({ ...form, published_at: e.target.value })}
                  />
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

      {/* File Preview Modal */}
      <div className="modal fade" ref={previewRef} tabIndex="-1">
        <div className="modal-dialog modal-fullscreen">
          <div className="modal-content bg-dark">
            <div className="modal-header border-0">
              <button className="btn-close btn-close-white" onClick={() => previewInstance.current.hide()}></button>
            </div>
            <div className="modal-body d-flex justify-content-center">
              {previewFile && (
                <iframe
                  src={previewFile}
                  title="Preview"
                  style={{ width: "90%", height: "90vh", borderRadius: "10px" }}
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
                data-bs-dismiss="toast"
                aria-label="Close"
                ></button>
            </div>
        </div>
      </div>

    </div>
  );
}
