import React from "react";

export default function AdminTopbar({ admin }) {
  return (
    <nav className="navbar navbar-light bg-white shadow-sm px-3">
      <span className="navbar-brand mb-0 h5">Welcome, {admin?.name}</span>
    </nav>
  );
}
