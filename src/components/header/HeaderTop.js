import React from 'react';
import { FaPhoneAlt, FaEnvelope, FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';

export default function HeaderTop() {
  return (
    <div className="header-top py-2 border-bottom bg-white">
      <div className="container d-flex justify-content-between align-items-center">
        {/* Logo + Title */}
        <div className="d-flex align-items-center">
          <img src="/logo.png" alt="Logo" height="60" className="me-2" />
          <div>
            <h4 className="mb-0 text-primary fw-bold">Shree Gogal Prasad Model Sec. School</h4>
            <small className="text-muted">Janakpurdham-24, Dhanusha</small>
          </div>
        </div>

        {/* Contact Info + Social */}
        <div className="d-flex align-items-center gap-4">
          <div>
            <FaPhoneAlt className="me-2 text-secondary" />
            <small>9854026151/9824835974/9801668738</small>
          </div>
          <div>
            <FaEnvelope className="me-2 text-secondary" />
            <small>gogalmabi77@gmail.com</small>
          </div>
          {/* <div className="d-flex gap-2">
            <a href="https://facebook.com" target="_blank" rel="noreferrer"><FaFacebook color="#1877F2" /></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer"><FaTwitter color="#1DA1F2" /></a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer"><FaLinkedin color="#0A66C2" /></a>
          </div> */}
          {/* <div className="search-box position-relative">
            <input
              type="text"
              placeholder="Search"
              className="form-control form-control-sm ps-3 pe-5"
              style={{ width: '180px', borderRadius: '0' }}
            />
            <button
              className="btn btn-link position-absolute top-0 end-0 mt-1 me-2 p-0 text-warning"
              style={{ border: 'none' }}
            >
              <i className="bi bi-search"></i>
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
}
