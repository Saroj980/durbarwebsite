import React, { useEffect, useState, useRef } from "react";
import DataTable from "react-data-table-component";
import adminapi from "../../api/adminapi";
import * as bootstrap from "bootstrap";
import { FaEnvelopeOpen, FaEye, FaTrash } from "react-icons/fa";

export default function AdminContactMessages() {
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);

  const [selectedMessage, setSelectedMessage] = useState(null);

  const modalRef = useRef(null);
  const toastRef = useRef(null);

  const modalInstance = useRef(null);
  const toastInstance = useRef(null);

  useEffect(() => {
    if (toastRef.current)
      toastInstance.current = bootstrap.Toast.getOrCreateInstance(toastRef.current);

    if (modalRef.current)
      modalInstance.current = bootstrap.Modal.getOrCreateInstance(modalRef.current);

    loadMessages();
  }, []);

  const showToast = (msg, type = "success") => {
    const el = toastRef.current;
    const body = el.querySelector(".toast-body");

    el.classList.remove("text-bg-success", "text-bg-danger");
    el.classList.add(`text-bg-${type}`);
    body.innerText = msg;

    toastInstance.current.show();
  };

  const loadMessages = async () => {
    try {
      const res = await adminapi.get("/admin/contact-messages");
      setMessages(res.data);
      setFiltered(res.data);
    } catch {
      showToast("Failed to load messages", "danger");
    }
  };

  const openViewModal = (msg) => {
    setSelectedMessage(msg);
    modalInstance.current.show();

    if (msg.status === 0) markAsRead(msg.id);
  };

  const markAsRead = async (id) => {
    try {
      await adminapi.post(`/admin/contact-messages/${id}/status`, { status: 1 });
      loadMessages();
    } catch {
      showToast("Failed to update status", "danger");
    }
  };

  // const markAsUnread = async (id) => {
  //   try {
  //     await adminapi.post(`/admin/contact-messages/${id}/status`, { status: 0 });
  //     loadMessages();
  //   } catch {
  //     showToast("Failed to update status", "danger");
  //   }
  // };

  const deleteMessage = async (id) => {
    if (!window.confirm("Delete this message?")) return;

    try {
      await adminapi.delete(`/admin/contact-messages/${id}`);
      showToast("Message deleted");
      loadMessages();
    } catch {
      showToast("Delete failed", "danger");
    }
  };

  useEffect(() => {
    const result = messages.filter((m) =>
      m.name.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [search, messages]);

  const columns = [
    { name: "#", selector: (row, i) => i + 1, width: "60px" },

    {
      name: "Status",
      cell: (row) => (
        <span className={`badge ${Number(row.status) ? "bg-success" : "bg-danger"}`}>
          {Number(row.status) ? "Read" : "Unread"}
        </span>
      ),
      width: "120px",
    },

    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Email", selector: (row) => row.email },

    {
      name: "Subject",
      selector: (row) => row.subject,
      maxWidth: "250px",
    },

    {
      name: "Actions",
      width: "200px",
      cell: (row) => (
        <div className="d-flex gap-2 align-items-center">
          {/* View Button */}
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => openViewModal(row)}
          >
            <FaEye />
          </button>

          {/* Mark as Read (Only if unread) */}
          {(Number(row.status) === 0 || row.status === 'pending') && (
            <button
              className="btn btn-sm btn-outline-success"
              onClick={() => markAsRead(row.id)}
            >
              <FaEnvelopeOpen /> 
            </button>
          )} 

          {/* Delete */}
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => deleteMessage(row.id)}
          >
            <FaTrash />
          </button>
        </div>
      ),
    }

  ];

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold label-primary">Contact Messages</h3>
          <p className="text-muted small mb-0">View & manage inquiries</p>
        </div>
      </div>

      <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
        <div className="card-body">
          <DataTable
            columns={columns}
            data={filtered}
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
                  placeholder="🔍 Search messages..."
                  className="form-control w-50 rounded-pill px-3 shadow-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ maxWidth: "320px" }}
                />
                <div className="text-muted small">
                  Showing <strong>{filtered.length}</strong> of{" "}
                  <strong>{messages.length}</strong> messages
                </div>
              </div>
            }
          />
        </div>
      </div>


      {/* View Modal */}
      <div className="modal fade" ref={modalRef}>
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">

            <div className="modal-header">
              <h5 className="modal-title">Message Details</h5>
              {/* <button className="btn-close" /> */}
            </div>

            <div className="modal-body">
              {selectedMessage && (
                <>
                  <h5>{selectedMessage.subject}</h5>
                  <p className="text-muted">
                    From: <strong>{selectedMessage.name}</strong> ({selectedMessage.email})
                  </p>

                  <div className="p-3 bg-light rounded">
                    <p>{selectedMessage.message}</p>
                  </div>
                </>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => modalInstance.current.hide()}>
                Close
              </button>
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
