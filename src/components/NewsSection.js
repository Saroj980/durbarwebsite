import React, {useEffect, useState} from 'react';
import api from '../api';
import { Link } from 'react-router-dom';

export default function NewsSection({limit=3}){
  const [news, setNews] = useState([]);
  useEffect(()=>{
    api.get(`/news?limit=${limit}`).then(res => setNews(res.data)).catch(()=>{});
  },[limit]);

  return (
    <section className="my-4">
      <h3>Latest News</h3>
      <div className="row">
        {news.map(n => (
          <div className="col-md-4" key={n.id}>
            <div className="card mb-3 card-small">
              {n.image_url && <img src={`${process.env.REACT_APP_API_BASE_URL}storage/${n.image_url}`}
                     className="card-img-top" alt={n.title} />}
              <div className="card-body">
                <h5 className="card-title">{n.title}</h5>
                <p className="card-text">{n.summary}</p>
                <Link to={`/news`} className="btn btn-sm btn-primary">Read more</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
