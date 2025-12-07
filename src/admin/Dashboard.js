// src/admin/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import adminapi from "../api/adminapi";
import {
  FaBook,
  FaBullhorn,
  FaNewspaper,
  FaUsers,
  FaClock,
  FaSignOutAlt,
  FaSpinner,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function Dashboard() {
  const [stats, setStats] = useState({ notices: 0, news: 0, courses: 0 });
  const [recentLogins, setRecentLogins] = useState([]);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [userRes, notices, news, courses] = await Promise.all([
          adminapi.get("/admin/user"),
          adminapi.get("/notices"),
          adminapi.get("/news"),
          adminapi.get("/courses"),
        ]);

        setAdmin(userRes.data);
        setStats({
          notices: notices.data.length,
          news: news.data.length,
          courses: courses.data.length,
        });
        setRecentLogins([
          { id: 1, name: "Admin", time: "2 mins ago" },
          { id: 2, name: "Sub Admin", time: "1 hour ago" },
          { id: 3, name: "System", time: "Yesterday" },
        ]);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        if (error.response?.status === 401) {
          window.location.href = "/admin/login";
        }
      } finally {
        setTimeout(() => setLoading(false), 800); // add a slight fade effect
      }
    };

    fetchDashboardData();
  }, []);

  const pieData = [
    { name: "Notices", value: stats.notices },
    { name: "News", value: stats.news },
    { name: "Courses", value: stats.courses },
  ];

  const COLORS = ["#007bff", "#28a745", "#ffc107"];

  if (loading) {
    return (
      <div className="dashboard-loader d-flex flex-column justify-content-center align-items-center vh-100">
        <FaSpinner className="spinner label-primary mb-3" />
        <h6 className="text-muted">Loading...</h6>
      </div>
    );
  }

  return (
    <div className="p-4 dashboard-page fade-in">
      <h4 className="fw-bold mb-4 text-primary">
        Welcome Back, {admin?.name || "Admin"} 👋
      </h4>

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        {[
          { label: "Notices", value: stats.notices, icon: <FaBullhorn />, color: "primary" },
          { label: "News", value: stats.news, icon: <FaNewspaper />, color: "success" },
          { label: "Courses", value: stats.courses, icon: <FaBook />, color: "warning" },
          { label: "Users", value: 3, icon: <FaUsers />, color: "secondary" },
        ].map((item, i) => (
          <div className="col-md-3" key={i}>
            <div className="card border-0 shadow-sm text-center p-3">
              <div className={`text-${item.color} fs-2 mb-2`}>{item.icon}</div>
              <h6 className={`text-${item.color} fw-semibold`}>{item.label}</h6>
              <h4 className="fw-bold">{item.value}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Charts + Sidebar */}
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 p-4 mb-4">
            <h6 className="fw-semibold mb-3 text-secondary">Activity Overview</h6>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={pieData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="value"
                  fill="var(--bs-primary)"
                  radius={[6, 6, 0, 0]}
                  animationDuration={800}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card shadow-sm border-0 p-4">
            <h6 className="fw-semibold mb-3 text-secondary">Content Distribution</h6>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Admin Info Sidebar */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 p-4 mb-4">
            <div className="d-flex align-items-center mb-3">
              <img
                src="/logo.png"
                alt="Logo"
                style={{ width: 50, height: 50, borderRadius: "50%" }}
                className="me-3"
              />
              <div>
                <h6 className="mb-0 fw-bold">{admin?.name}</h6>
                <small className="text-muted">{admin?.email}</small>
              </div>
            </div>
            <hr />
            <h6 className="fw-semibold mb-3">
              <FaClock className="me-2 text-primary" /> Recent Logins
            </h6>
            <ul className="list-unstyled small">
              {recentLogins.map((log) => (
                <li key={log.id} className="d-flex justify-content-between mb-2">
                  <span>{log.name}</span>
                  <span className="text-muted">{log.time}</span>
                </li>
              ))}
            </ul>
            <button
              className="btn btn-outline-danger w-100 mt-3"
              onClick={async () => {
                await adminapi.post("/admin/logout");
                localStorage.removeItem("adminToken");
                window.location.href = "/admin/login";
              }}
            >
              <FaSignOutAlt className="me-2" /> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
