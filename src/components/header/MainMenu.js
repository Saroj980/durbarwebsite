import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';

export default function MainMenu() {
  const [menus, setMenus] = useState([]);

  useEffect(() => {
    api.get('/menus').then(res => setMenus(res.data)).catch(() => {});
  }, []);

  return (
    <nav className="navbar navbar-expand-lg" style={{ background: 'var(--bs-primary)' }}>
      <div className="container">
        <button
          className="navbar-toggler text-white"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainmenu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="mainmenu">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {menus.map((m) => (
              <li className="nav-item" key={m.id}>
                <Link className="nav-link text-white fw-semibold" to={m.url || `/${m.slug}`}>
                  {m.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
