import React, {useEffect, useState} from 'react';
import api from '../api';

export default function NoticeSection({limit=5}){
  const [notices, setNotices] = useState([]);
  useEffect(()=> {
    api.get(`/notices?limit=${limit}`).then(res => setNotices(res.data)).catch(()=>{});
  }, [limit]);
  return (
    <section className="my-4">
      <h3>Notices</h3>
      <ul className="list-group">
        {notices.map(n => (
          <li className="list-group-item d-flex justify-content-between align-items-start" key={n.id}>
            <div>
              <div className="fw-bold">{n.title}</div>
              <small>{n.published_at ? new Date(n.published_at).toLocaleDateString() : ''}</small>
            </div>
            {n.file_url && <a href={n.file_url} className="btn btn-sm btn-outline-secondary" target="_blank" rel="noreferrer">Download</a>}
          </li>
        ))}
      </ul>
    </section>
  );
}
