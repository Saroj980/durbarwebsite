import React, { useEffect, useState } from 'react';
import { FaRegNewspaper } from 'react-icons/fa';
import api from '../../api'; // make sure api.js exists

export default function HighlightsBar() {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    // Fetch latest notices from backend
    api.get('/notices')
      .then(res => {
        console.log(res.data);
        // Limit to first few for highlight display
        const data = Array.isArray(res.data) ? res.data.slice(0, 5) : [];
        setNotices(data);
      })
      .catch(() => {
        // fallback dummy data (if API not ready)
        setNotices([
          { id: 1, title: 'Admission Open for 2082', file_url: '#' },
          { id: 2, title: 'New Class Routine Published', file_url: '#' },
          { id: 3, title: 'PTM on Sunday', file_url: '#' }
        ]);
      });
  }, []);

  if (!notices.length) return null;

  return (
    <div className="highlights-bar text-white py-1" style={{ background: 'var(--bs-secondary)' }}>
      <div className="container d-flex align-items-center gap-3 overflow-hidden">
        {/* Label */}
        <div
          className="bg-light text-dark px-3 py-1 rounded-start d-flex align-items-center gap-2"
          style={{ whiteSpace: 'nowrap' }}
        >
          <FaRegNewspaper /> <strong>Notices:</strong>
        </div>

        {/* Scrolling area */}
        <marquee behavior="scroll" direction="left" scrollamount="5" className="small">
          {notices.map((n, i) => (
            <span key={n.id || i} style={{ marginRight: '40px' }}>
              <a
                href={n.file_url || '#'}
                className="text-white text-decoration-none"
                target="_blank"
                rel="noreferrer"
              >
                {n.title}
              </a>
            </span>
          ))}
        </marquee>
      </div>
    </div>
  );
}
