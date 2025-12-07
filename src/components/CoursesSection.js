import React, { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";

export default function CoursesSection() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    api
      .get("/courses")
      .then((res) => setCourses(res.data))
      .catch((err) => console.error("Error fetching courses:", err));
  }, []);

  return (
    <section className="courses-section py-5 position-relative overflow-hidden">
      <div className="container text-center">
        <h2 className="section-heading mb-4">
          <span>Our Courses</span>
        </h2>
        <p className="text-muted mb-5">
          Explore diverse academic programs that shape bright futures.
        </p>

        <div className="row g-4 justify-content-center">
          {courses.map((course, index) => (
            <div className="col-lg-3 col-md-6" key={index}>
              <div
                className="course-card shadow-lg border-0 h-100"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="course-image-wrapper">
                  <img
                    src={`${process.env.REACT_APP_API_BASE_URL}storage/${course.bg_picture}`}
                    alt={course.title}
                    className="course-image"
                  />
                  <div className="course-overlay"></div>
                  <h5 className="course-title-overlay">{course.title}</h5>
                </div>
                <div className="course-body text-start p-4">
                  <p className="text-muted small mb-3">
                    {course.description?.length > 80
                      ? course.description.substring(0, 80) + "..."
                      : course.description}
                  </p>
                  <Link to={`/courses/${course.id}`} className="btn-read-more">
                    Read More →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* floating glow shapes */}
      <div className="floating-shape shape1"></div>
      <div className="floating-shape shape2"></div>
    </section>
  );
}
