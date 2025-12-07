import React, { useEffect, useState } from "react";
import api from "../api";
import "../css/AboutPage.css";

import CoursesSection from '../components/CoursesSection';
import FeaturesSection from '../components/FeaturesSection';

export default function AboutPage() {
  const [about, setAbout] = useState(null);
  const base = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    window.scrollTo(0, 0);

    api.get("/about")
      .then((res) => setAbout(res.data))
      .catch(() => setAbout(null));
  }, []);

  if (!about) return null;

  const heroBg = `${base}storage/${about.about_image}`;

  const parseJsonArray = (str) => {
    try {
      // Remove `{[` and `]}` wrapper → convert to pure JSON array
      const cleaned = str.replace(/^{\[|]}$/g, "");
      return JSON.parse(`[${cleaned}]`);
    } catch {
      return [];
    }
  };

  const visionList = parseJsonArray(about.vision);
  const missionList = parseJsonArray(about.mission);
  const objectiveList = parseJsonArray(about.objective);

  return (
    <div className="about-page" style={{ paddingTop: "36px" }}>

      {/* ------------------------ HERO SECTION ------------------------ */}
      <section
        className="about-hero"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)),
            url(${heroBg})
          `,
        }}
      >
        <div className="container text-center">
          <h1 className="display-5 fw-bold mb-2" data-aos="fade-down">
            {about.hero_title}
          </h1>

          <p className="lead text-light" data-aos="fade-up">
            {about.hero_subtitle}
          </p>
        </div>
      </section>

      {/* ------------------------ ABOUT MAIN ------------------------ */}
      <section className="about-main py-5">
        <div className="floating-shape shape-a"></div>
        <div className="floating-shape shape-b"></div>

        <div className="container">
          <div className="about-wrapper" data-aos="fade-up">

            {/* FLOATING IMAGE RIGHT */}
            <img
              src={`${base}storage/${about.about_image}`}
              alt="About School"
              className="about-float-img"
              data-aos="zoom-in"
            />

            <h2 className="about-title fw-bold">{about.about_title}</h2>
            <div className="underline"></div>

            <div className="about-text">
              {about.about_text.split("\n").map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ------------------------ VISION ------------------------ */}
      <section className="vmo-block" data-aos="fade-up">
        <div className="container">
          <h2 className="vmo-header">Vision</h2>
          <div className="vmo-content">
            {visionList.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------ MISSION ------------------------ */}
      <section className="vmo-block" data-aos="fade-up" data-aos-delay="150">
        <div className="container">
          <h2 className="vmo-header">Mission</h2>
          <div className="vmo-content">
            {missionList.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------ OBJECTIVES ------------------------ */}
      <section className="vmo-block" data-aos="fade-up" data-aos-delay="300">
        <div className="container">
          <h2 className="vmo-header">Objectives</h2>
          <div className="vmo-content">
            {objectiveList.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </div>
      </section>

      
       <CoursesSection />

       
        <FeaturesSection />
    </div>
    
  );
}