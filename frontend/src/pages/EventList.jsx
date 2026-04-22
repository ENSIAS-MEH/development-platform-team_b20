import React, { useEffect, useState } from "react";
import { getEvents, deleteEvent } from "../services/eventService";

export default function EventList() {

  const [events, setEvents] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setEvents(await getEvents());
  };

  return (
    <div>
      <h2>Events</h2>

      {events.map(e => (
        <div key={e.id}>
          <h3>{e.title}</h3>
          <p>{e.location}</p>

          <button onClick={() => deleteEvent(e.id).then(load)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}