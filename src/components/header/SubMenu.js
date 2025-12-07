import React from 'react';
import { FaUniversity, FaBuilding, FaCity, FaFlask, FaPenNib } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function SubMenu() {
  const links = [
    { icon: <FaUniversity />, title: 'Tribhuvan University', path: '/' },
    { icon: <FaBuilding />, title: 'Institutes / Faculties', path: '/institutes' },
    { icon: <FaCity />, title: 'Central Offices', path: '/offices' },
    { icon: <FaFlask />, title: 'Research Centers', path: '/research' },
    { icon: <FaPenNib />, title: 'Other Offices', path: '/others' },
    { icon: <FaUniversity />, title: 'Contact Us', path: '/contact' },
  ];

  return (
    <div className="sub-menu py-2" style={{ background: '#3279c3' }}>
      <div className="container d-flex flex-wrap gap-3">
        {links.map((l, i) => (
          <Link key={i} className="text-white text-decoration-none small d-flex align-items-center gap-1" to={l.path}>
            {l.icon}
            {l.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
