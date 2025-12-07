// src/adminapi.js
import axios from "axios";

const adminapi = axios.create({
  baseURL: process.env.REACT_APP_API_BASE || 'http://127.0.0.1:8000/api',
  withCredentials: true,
});

// Automatically attach the admin token (if logged in)
adminapi.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default adminapi;
