import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import News from "./pages/News";
import Notices from "./pages/Notices";
import Events from "./pages/Events";
import Gallery from "./pages/Gallery";
import Downloads from "./pages/Downloads";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PrincipalMessage from "./pages/PrincipalMessage";
import ExecutiveTeam from "./pages/ExecutiveTeamPage";
import ScrollToTop from "./components/ScrollToTop";
import { AnimatePresence } from "framer-motion";


import AdminLogin from "./admin/AdminLogin";
import DashboardLayout from "./admin/Layout";
import Dashboard from "./admin/Dashboard";
import AdminProtectedRoute from "./admin/AdminProtectedRoute";
import Courses from "./admin/pages/Courses";
import AdminNews from "./admin/pages/News";
import AdminNotices from "./admin/pages/Notices";
import AdminGallery from "./admin/pages/Gallery";
import AdminAbout from "./admin/pages/About";
import AdminExecutiveTeam from "./admin/pages/ExecutiveTeams";
import AdminAcademicTeam from "./admin/pages/AcademicTeams";
import AdminEvents from "./admin/pages/Events";
import AdminDownloads from "./admin/pages/Downloads";
import AdminContactMessage from "./admin/pages/ContactMessages";
import AdminPrincipalMessage from "./admin/pages/PrincipalMessage";
import AdminChangePassword from "./admin/pages/ChangePassword";

import Carousel from "./admin/pages/Carousel";
import ThemeSettings from "./admin/pages/ThemeSettings";
import SchoolInfo from "./admin/pages/SchoolInfo";
import AcademicTeams from "./pages/AcademicTeams";
import EventDetail from "./pages/EventDetail";
import NoticeDetail from "./pages/NoticeDetail";
import NewsDetail from "./pages/NewsDetail";


function App() {
  // const location = useLocation();


  return (
    <BrowserRouter>
      <ScrollToTop />  
      <AnimatePresence mode="wait">
      <Routes>
        {/* 🌍 Public Website Layout */}
        <Route
          path="/"
          element={
            <>
              <Header />
              {/* <main className="container my-4" style={{ minHeight: "60vh", }}> */}
              <main className="w-100 p-0 m-0">
                <Home />
              </main>
              <Footer />
            </>
          }
        />

        <Route
          path="/news"
          element={
            <>
              <Header />
              <main className="container my-4" style={{ minHeight: "60vh" }}>
                <News />
              </main>
              <Footer />
            </>
          }
        />
        <Route
          path="/notices"
          element={
            <>
              <Header />
              <main className="container my-4" style={{ minHeight: "60vh" }}>
                <Notices />
              </main>
              <Footer />
            </>
          }
        />
        <Route
          path="/events"
          element={
            <>
              <Header />
              <main className="container my-4" style={{ minHeight: "60vh" }}>
                <Events />
              </main>
              <Footer />
            </>
          }
        />
        <Route
          path="/gallery"
          element={
            <>
              <Header />
              <main className="container my-4" style={{ minHeight: "60vh" }}>
                <Gallery />
              </main>
              <Footer />
            </>
          }
        />
        <Route
          path="/resources"
          element={
            <>
              <Header />
              <main className="container my-4" style={{ minHeight: "60vh" }}>
                <Downloads />
              </main>
              <Footer />
            </>
          }
        />
        <Route
          path="/about"
          element={
            <>
              <Header />
              <main className="container my-4" style={{ minHeight: "60vh" }}>
                <About />
              </main>
              <Footer />
            </>
          }
        />
        <Route
          path="/contact"
          element={
            <>
              <Header />
              <main className="container my-4" style={{ minHeight: "60vh" }}>
                <Contact />
              </main>
              <Footer />
            </>
          }
        />
        <Route
          path="/principal-message"
          element={
            <>
              <Header />
              <main className="container my-4" style={{ minHeight: "60vh" }}>
                <PrincipalMessage />
              </main>
              <Footer />
            </>
          }
        />
        <Route
          path="/executive-teams"
          element={
            <>
              <Header />
              <main className="container my-4" style={{ minHeight: "60vh" }}>
                <ExecutiveTeam />
              </main>
              <Footer />
            </>
          }
        />

        <Route
          path="/academic-team"
          element={
            <>
              <Header />
              <main className="container my-4" style={{ minHeight: "60vh" }}>
                <AcademicTeams />
              </main>
              <Footer />
            </>
          }
        />
        <Route path="/events/:id"
          element={
            <>
              <Header />
              <main className="container my-4" style={{ minHeight: "60vh" }}>
                <EventDetail />
              </main>
              <Footer />
            </>
          }
          />

        <Route path="/notices/:id"
          element={
            <>
              <Header />
              <main className="container my-4" style={{ minHeight: "60vh" }}>
                <NoticeDetail />
              </main>
              <Footer />
            </>
          }
        />

        <Route path="/news/:id"
          element={
            <>
              <Header />
              <main className="container my-4" style={{ minHeight: "60vh" }}>
                <NewsDetail />
              </main>
              <Footer />
            </>
          }
        />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />


        {/* 🔐 Protected Admin Area */}
        <Route path="/admin/*" element={<AdminProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="courses" element={<Courses />} />
            <Route path="news" element={<AdminNews />} />
            {/* <Route path="news" element={<div>News Management</div>} /> */}
            <Route path="notices" element={<AdminNotices />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="downloads" element={<AdminDownloads />} />

            <Route path="about-us" element={<AdminAbout />} />
            <Route path="executive-teams" element={<AdminExecutiveTeam />} />
            <Route path="academic-teams" element={<AdminAcademicTeam />} />
            <Route path="events" element={<AdminEvents />} />

            <Route path="carousel" element={<Carousel />} />
            <Route path="theme-settings" element={<ThemeSettings />} />
            <Route path="school-info" element={<SchoolInfo />} />


            <Route path="contact-messages" element={<AdminContactMessage />} />
            <Route path="principal-message" element={<AdminPrincipalMessage />} />

            <Route path="change-password" element={<AdminChangePassword />} />

          </Route>
        </Route>
      </Routes>
      </AnimatePresence>
    </BrowserRouter>
  );
}

export default App;
