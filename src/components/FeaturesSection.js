import React from "react";
import {
  FaFlask,
  FaHeartbeat,
  FaFutbol,
  FaBookOpen,
  FaUtensils,
  FaLaptopCode,
} from "react-icons/fa";

export default function FeaturesSection() {
  const features = [
    {
      icon: <FaFlask />,
      title: "Labs & Classroom",
      desc: "Our educational institution boasts cutting-edge laboratories and meticulously designed classrooms, fostering an environment where students explore the wonders of science and engage in hands-on experimentation across various disciplines.",
      color: "linear-gradient(135deg, #06b6d4, #3b82f6)",
    },
    {
      icon: <FaFutbol />,
      title: "Sports & Extracurricular",
      desc: "At our school, we are dedicated to nurturing not only academic excellence but also holistic development. Our sports and extracurricular activities provide students with the perfect arena to unleash their passions, build resilience, and discover their hidden talents.",
      color: "linear-gradient(135deg, #16a34a, #65a30d)",
    },
    {
      icon: <FaUtensils />,
      title: "Cafeteria",
      desc: "In our vibrant cafeteria, we don't just serve meals; we create moments. A hub of culinary delights, it's where students gather to savor delicious food, forge friendships, and savor the flavors of togetherness",
      color: "linear-gradient(135deg, #f59e0b, #ef4444)",
    },
    {
      icon: <FaHeartbeat />,
      title: "Health Care",
      desc: "At our institution, the well-being of our students is paramount. Our healthcare facilities offer top-notch medical care, ensuring students are in safe hands. We prioritize their physical and emotional health, so they can focus on their academic journey with peace of mind.",
      color: "linear-gradient(135deg, #ec4899, #8b5cf6)",
    },
    {
      icon: <FaBookOpen />,
      title: "Library",
      desc: "A Within the walls of our library lies a treasure trove of knowledge and imagination. It's not just a place for books; it's where students embark on intellectual journeys, explore new worlds, and cultivate a lifelong love for learning. Our library is a sanctuary for curiosity and a gateway to endless possibilities.",
      color: "linear-gradient(135deg, #0ea5e9, #6366f1)",
    },
    {
      icon: <FaLaptopCode />,
      title: "Computer Laboratories",
      desc: "In our state-of-the-art computer laboratories, innovation takes root and digital dreams come to life. Equipped with cutting-edge technology, these labs serve as incubators for the next generation of tech-savvy pioneers, where students code their futures and engineer solutions that shape our world.",
      color: "linear-gradient(135deg, #10b981, #14b8a6)",
    },
  ];

  return (
    <section className="features-gradient-section py-5 position-relative overflow-hidden">
      <div className="container text-center">
        <h2 className="section-heading mb-4">
          <span>Our Features</span>
        </h2>
        <div className="row g-4 justify-content-center">
          {features.map((item, index) => (
            <div className="col-lg-4 col-md-6" key={index}>
              <div
                className="feature-gradient-card text-start text-white h-100 shadow-lg"
                style={{ background: item.color }}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="icon-circle mb-3">{item.icon}</div>
                <h5 className="fw-bold mb-2">{item.title}</h5>
                <p className="small opacity-90">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Optional floating gradient shapes */}
      <div className="floating-shape shape1"></div>
      <div className="floating-shape shape2"></div>
    </section>
  );
}
