import React, { useEffect, useState, useRef } from "react";
import DataTable from "react-data-table-component";
import adminapi from "../../api/adminapi";
import * as bootstrap from "bootstrap";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";import {
  NepaliDatePicker,
  adToBS,
 getCurrentBSDate
} from "nepali-calander";
import "nepali-calander/dist/styles.css";



export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);

  const [form, setForm] = useState({
    id: null,
    title: "",
    description: "",
    event_date: "",
    event_date_nepali: "",
    event_time: "",
    duration: "",
    location: "",
    photo: null,
    preview: null,
  });

  const [saving, setSaving] = useState(false);
  const base = process.env.REACT_APP_API_BASE_URL;

  // Bootstrap refs
  const modalRef = useRef(null);
  const toastRef = useRef(null);
  const imagePreviewRef = useRef(null);

  const modalInstance = useRef(null);
  const toastInstance = useRef(null);
  const imagePreviewInstance = useRef(null);

  const [previewImage, setPreviewImage] = useState(null);

  const formatTimeAMPM = (time) => {
    if (!time) return "—";

    let [hours, minutes] = time.split(":");
    hours = Number(hours);

    const ampm = hours >= 12 ? "PM" : "AM";
    const adjustedHour = hours % 12 || 12;

    return `${adjustedHour}:${minutes} ${ampm}`;
 };


  useEffect(() => {
    if (toastRef.current)
      toastInstance.current = bootstrap.Toast.getOrCreateInstance(toastRef.current);

    if (modalRef.current)
      modalInstance.current = bootstrap.Modal.getOrCreateInstance(modalRef.current);

    if (imagePreviewRef.current)
        imagePreviewInstance.current = new bootstrap.Modal(imagePreviewRef.current, {});
    loadEvents();
  }, []);

  const showToast = (msg, type = "success") => {
    if (!toastRef.current) return;

    const el = toastRef.current;
    const body = el.querySelector(".toast-body");

    body.innerText = msg;
    el.classList.remove("text-bg-success", "text-bg-danger");
    el.classList.add(`text-bg-${type}`);

    toastInstance.current.show();
  };

  const loadEvents = async () => {
    try {
      const res = await adminapi.get("/admin/events");
      setEvents(res.data || []);
      setFilteredEvents(res.data || []);
    } catch (err) {
      showToast("Failed to load events", "danger");
    }
  };

  // Format date for input type="date"
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    return dateString.substring(0, 10); // YYYY-MM-DD
  };

  const handleADChange = (e) => {
    const ad = e.target.value;
    if (!ad) return;

    const [y, m, d] = ad.split("-").map(Number);
    const bs = adToBS(y, m, d);

    const bsStr = `${bs.bs_y}-${String(bs.bs_m).padStart(2, "0")}-${String(bs.bs_d).padStart(2, "0")}`;

    setForm({ 
        ...form, 
        event_date: ad, 
        event_date_nepali: bsStr 
    });
 };



  const openModal = (event = null) => {
    if (event) {
      setForm({
        id: event.id,
        title: event.title,
        description: event.description,
        event_date: formatDateForInput(event.event_date),
        event_date_nepali: event.event_date_nepali,
        event_time: event.event_time,
        duration: event.duration,
        location: event.location,
        photo: null,
        preview: event.photo ? `${base}storage/${event.photo}` : null,
      });
    } else {
    // ★ Get today's BS date
    const todayBS = getCurrentBSDate();
    const bsTodayStr = `${todayBS.bs_y}-${String(todayBS.bs_m).padStart(2, "0")}-${String(
      todayBS.bs_d
    ).padStart(2, "0")}`;

    // ★ Get today's AD date
    const todayAD = new Date().toISOString().substring(0, 10);
      setForm({
        id: null,
        title: "",
        description: "",
        event_date: todayAD,
        event_date_nepali: bsTodayStr,
        event_time: "",
        duration: "",
        location: "",
        photo: null,
        preview: null,
      });
    }

    modalInstance.current.show();
  };

  const closeModal = () => modalInstance.current.hide();

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setForm({
      ...form,
      photo: file,
      preview: URL.createObjectURL(file),
    });
  };

  const saveEvent = async () => {
    setSaving(true);

    try {
      const fd = new FormData();

      Object.keys(form).forEach((key) => {
        if (key === "photo" || key === "preview") return;
        fd.append(key, form[key] ?? "");
      });

      if (form.photo) fd.append("photo", form.photo);

      if (form.id) {
        await adminapi.post(`/admin/events/${form.id}?_method=PUT`, fd);
        showToast("Event updated successfully");
      } else {
        await adminapi.post(`/admin/events`, fd);
        showToast("Event added successfully");
      }

      closeModal();
      loadEvents();
    } catch (err) {
      if (err.response?.status === 422) {
        showToast(Object.values(err.response.data.errors)[0][0], "danger");
      } else showToast("Failed to save!", "danger");
    }

    setSaving(false);
  };

  const deleteEvent = async (id) => {
    if (!window.confirm("Delete this event?")) return;

    try {
      await adminapi.delete(`/admin/events/${id}`);
      showToast("Event deleted");
      loadEvents();
    } catch (err) {
      showToast("Failed to delete", "danger");
    }
  };

  const handleImageClick = (url) => {
    setPreviewImage(url);
    imagePreviewInstance.current?.show();
  };
  

  // DataTable Search
  useEffect(() => {
    const result = events.filter((ev) =>
      ev.title.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredEvents(result);
  }, [search, events]);

  // Columns for DataTable
  const columns = [
    { name: "#", selector: (row, i) => i + 1, width: "60px" },

    {
    name: "Photo",
    cell: (row) =>
        row.photo ? (
        <div
            style={{ cursor: "pointer" }}
            onClick={() => handleImageClick(`${base}storage/${row.photo}`)}
          >
            <img
              src={`${base}storage/${row.photo}`}
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
    width: "100px",
    },


    { name: "Title", selector: (row) => row.title, sortable: true },

    {
      name: "Date (NP)",
      selector: (row) => row.event_date_nepali,
      sortable: true,
    },

    {
      name: "Time",
      selector: (row) => formatTimeAMPM(row.event_time),
    },

    {
      name: "Location",
      selector: (row) => row.location || "—",
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
            onClick={() => deleteEvent(row.id)}
          >
            <FaTrash />
          </button>
        </div>
      ),
      width: "160px",
    },
  ];
  

  return (
    <div className="p-4">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold label-primary">Events Management</h3>
          <p className="text-muted small mb-0">Create and manage school events</p>
        </div>

        <button className="btn btn-primary" onClick={() => openModal()}>
          <FaPlus /> Add Event
        </button>
      </div>

      {/* DataTable */}
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body">
          <DataTable
            columns={columns}
            data={filteredEvents}
            pagination
            highlightOnHover
            pointerOnHover
            striped
            dense
            subHeader
            subHeaderComponent={
              <input
                type="text"
                className="form-control w-25"
                placeholder="Search events..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            }
          />
        </div>
      </div>

      {/* Modal (Add/Edit) */}
      <div className="modal fade" ref={modalRef}>
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">

            <div className="modal-header">
              <h5 className="modal-title">{form.id ? "Edit Event" : "Add Event"}</h5>
              <button className="btn-close" onClick={closeModal}></button>
            </div>

            <div className="modal-body">
              <div className="row g-3">

                <div className="col-md-6">
                  <label className="fw-semibold">Event Title</label>
                  <input
                    className="form-control"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                </div>

                <div className="col-md-6">
                  <label className="fw-semibold">Duration</label>
                  <input
                    className="form-control"
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                  />
                </div>

                <div className="col-md-6">
                  <label className="fw-semibold">Event Date (EN)</label>
                  <input
                    type="date"
                    className="form-control"
                    value={form.event_date}
                    onChange={handleADChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="fw-semibold">Event Date (NP)</label>
                  <NepaliDatePicker
                    type="input"
                    calendarMode="bs"
                    placeholder="Select Nepali Date"
                    value={form.event_date_nepali}
                    showToggle={true}
                    onDateSelect={(day) => {
                        setForm({
                        ...form,
                        event_date_nepali: day.bs.date,
                        event_date: day.ad.date,
                        });
                    }}
                    />

                </div>

                <div className="col-md-6">
                  <label className="fw-semibold">Event Time</label>
                  <input
                    type="time"
                    className="form-control"
                    value={form.event_time}
                    onChange={(e) =>
                      setForm({ ...form, event_time: e.target.value })
                    }
                  />
                </div>

                <div className="col-md-6">
                  <label className="fw-semibold">Location</label>
                  <input
                    className="form-control"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                  />
                </div>

                <div className="col-12">
                  <label className="fw-semibold">Description</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                  />
                </div>

                <div className="col-md-6">
                  <label className="fw-semibold">Photo</label>
                  <input type="file" className="form-control" onChange={handlePhoto} />

                  {form.preview && (
                    <img
                      src={form.preview}
                      className="mt-3 rounded shadow-sm"
                      alt="Preview"
                      style={{
                        width: "100%",
                        maxHeight: 200,
                        objectFit: "cover",
                      }}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button className="btn btn-primary" disabled={saving} onClick={saveEvent}>
                {saving ? "Saving..." : "Save Event"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      <div className="modal fade" ref={imagePreviewRef}>
        <div className="modal-dialog modal-fullscreen">
            <div className="modal-content bg-dark border-0">
            <div className="modal-header border-0">
                <button className="btn-close btn-close-white" onClick={() => imagePreviewInstance.current.hide()}></button>
            </div>
            <div className="modal-body d-flex justify-content-center align-items-center">
                {previewImage && (
                <img
                    src={previewImage}
                    alt="Preview"
                    className="img-fluid rounded shadow"
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
