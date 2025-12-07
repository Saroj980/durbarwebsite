import React, {useEffect, useState} from 'react';
import api from '../api';

export default function EventsSection({limit=4}){
  const [events, setEvents] = useState([]);
  useEffect(()=>{
    api.get(`/events?limit=${limit}`).then(res=>setEvents(res.data)).catch(()=>{});
  },[limit]);

  return (
    <section className="my-4">
      <h3>Upcoming Events</h3>
      <div className="row">
        {events.map(e=>(
          <div className="col-md-3" key={e.id}>
            <div className="card mb-3">
              <div className="card-body">
                <h5>{e.title}</h5>
                <p className="small">{e.event_date ? new Date(e.event_date).toLocaleDateString() : ''}</p>
                <p>{e.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
