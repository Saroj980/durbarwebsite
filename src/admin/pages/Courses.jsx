import React, { useEffect, useState, useRef } from "react";
import DataTable from "react-data-table-component";
import adminapi from "../../api/adminapi";
import { FaPlus, FaSearchPlus } from "react-icons/fa";
import * as bootstrap from "bootstrap";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ id: null, title: "", description: "", visibility: 1 });
  const [bgPicture, setBgPicture] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // Bootstrap modal & toast references
  const modalRef = useRef(null);
  const imageModalRef = useRef(null);
  const toastRef = useRef(null);
  const modalInstance = useRef(null);
  const imageModalInstance = useRef(null);
  const toastInstance = useRef(null);

  // Fetch courses
  const fetchCourses = async () => {
    try {
      const res = await adminapi.get("/admin/courses");
      setCourses(res.data);
      setFilteredCourses(res.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchCourses();

    // Initialize modals and toast when mounted
    if (modalRef.current) {
      modalInstance.current = new bootstrap.Modal(modalRef.current, { backdrop: "static" });
    }
    if (imageModalRef.current) {
      imageModalInstance.current = new bootstrap.Modal(imageModalRef.current, {});
    }
    if (toastRef.current) {
      toastInstance.current = new bootstrap.Toast(toastRef.current);
    }
  }, []);

  // Filter logic for search
  useEffect(() => {
    if (search) {
      setFilteredCourses(
        courses.filter((c) =>
          c.title.toLowerCase().includes(search.toLowerCase())
        )
      );
    } else {
      setFilteredCourses(courses);
    }
  }, [search, courses]);

  const openModal = (course = null) => {
    if (!modalInstance.current) return;
    if (course) {
      setForm(course);
      setBgPicture(null);
    } else {
      setForm({ id: null, title: "", description: "", visibility: 1 });
      setBgPicture(null);
    }
    modalInstance.current.show();
  };

  const closeModal = () => {
    modalInstance.current?.hide();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("visibility", form.visibility);
    if (bgPicture) formData.append("bg_picture", bgPicture);

    try {
      if (form.id) {
        await adminapi.post(`/admin/courses/${form.id}?_method=PUT`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await adminapi.post("/admin/courses", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      fetchCourses();
      closeModal();
      showToast("Course saved successfully!");
    } catch (error) {
      console.error("Error saving course:", error);
      showToast("Failed to save course.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await adminapi.delete(`/admin/courses/${id}`);
        fetchCourses();
        showToast("Course deleted successfully.");
      } catch (error) {
        console.error("Delete error:", error);
        showToast("Failed to delete course.");
      }
    }
  };

  const handleImageClick = (imgUrl) => {
    setPreviewImage(imgUrl);
    imageModalInstance.current?.show();
  };

  // Show Toast message (success color + top right)
  const showToast = (message, type = "success") => {
    if (toastRef.current) {
      const toastEl = toastRef.current;
      const body = toastEl.querySelector(".toast-body");
      body.innerText = message;

      // Reset classes for type
      toastEl.classList.remove("text-bg-success", "text-bg-danger", "text-bg-warning");
      toastEl.classList.add(`text-bg-${type}`);

      toastInstance.current?.show();
    }
  };


  const columns = [
    { name: "#", selector: (row, i) => i + 1, width: "60px" },
    { name: "Title", selector: (row) => row.title, sortable: true,},
    { name: "Description", selector: (row) => row.description?.substring(0, 60) + "...", grow: 2 },
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
      cell: (row) =>
        row.bg_picture ? (
          <div
            className="position-relative"
            style={{ cursor: "pointer" }}
            onClick={() => handleImageClick(`http://127.0.0.1:8000/storage/${row.bg_picture}`)}
          >
            <img
              src={`http://127.0.0.1:8000/storage/${row.bg_picture}`}
              alt="Course"
              style={{
                width: "70px",
                height: "50px",
                objectFit: "cover",
                borderRadius: "6px",
              }}
              className="img-thumbnail img-fluid"
            />
            <FaSearchPlus
              className="position-absolute top-50 start-50 translate-middle text-white"
              style={{ fontSize: "16px", opacity: 0.8 }}
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
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold label-primary mb-0">Course Management</h3>
          <p className="text-muted mb-0 small">
            Manage, edit, and publish available courses efficiently.
          </p>
        </div>
        <button className="btn btn-primary shadow-sm px-3" onClick={() => openModal()}>
          <FaPlus className="me-2" /> Add Course
        </button>
      </div>

      {/* Data Table */}
      <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
        <div className="card-body">
          <DataTable
            columns={columns}
            data={filteredCourses}
            pagination
            paginationPerPage={10}
            highlightOnHover
            striped
            dense
            pointerOnHover
            responsive
            customStyles={{
              table: { style: { borderSpacing: "0 12px" } },
              headCells: {
                style: {
                  backgroundColor: "var(--bs-primary)",
                  color: "white",
                  fontWeight: "600",
                  fontSize: "14px",
                  borderTop: "none",
                },
              },
              cells: {
                style: {
                  padding: "14px 12px",
                  fontSize: "14px",
                  verticalAlign: "middle",
                },
              },
              rows: {
                style: {
                  transition: "all 0.2s ease",
                  borderBottom: "1px solid #f1f1f1",
                },
                highlightOnHoverStyle: {
                  backgroundColor: "rgba(0, 123, 255, 0.05)",
                  borderBottomColor: "rgba(0, 123, 255, 0.2)",
                  transform: "scale(1.01)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                },
              },
            }}
            subHeader
            subHeaderComponent={
              <div className="d-flex justify-content-between align-items-center w-100">
                <input
                  type="text"
                  placeholder="🔍 Search courses..."
                  className="form-control w-50 rounded-pill px-3 shadow-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ maxWidth: "320px" }}
                />
                <div className="text-muted small">
                  Showing <strong>{filteredCourses.length}</strong> of <strong>{courses.length}</strong> entries
                </div>
              </div>
            }
          />
        </div>
      </div>

      {/* Add/Edit Modal */}
      <div className="modal fade" ref={modalRef} tabIndex="-1">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg rounded-4">
            <div className="modal-header border-0 bg-light">
              <h5 className="modal-title fw-semibold">
                {form.id ? "Edit Course" : "Add New Course"}
              </h5>
              <button type="button" className="btn-close" onClick={closeModal}></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Course Title</label>
                  <input
                    type="text"
                    className="form-control shadow-sm"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Description</label>
                  <textarea
                    className="form-control shadow-sm"
                    rows="3"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Background Image</label>
                  <input
                    type="file"
                    className="form-control shadow-sm"
                    onChange={(e) => setBgPicture(e.target.files[0])}
                  />
                  {form.bg_picture && (
                    <img
                      src={`http://127.0.0.1:8000/storage/${form.bg_picture}`}
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
                <button type="submit" className="btn btn-success px-4">
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  Cancel
                </button>
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
