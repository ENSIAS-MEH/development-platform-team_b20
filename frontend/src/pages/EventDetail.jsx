import React, { useEffect, useState } from "react";

export default function EventDetail({ eventId }) {

  const [event, setEvent] = useState(null);

  useEffect(() => {
    loadEvent();
  }, []);

  const loadEvent = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/events/${eventId}`);
      const data = await res.json();
      setEvent(data);
    } catch (error) {
      console.error("Error loading event:", error);
    }
  };

  if (!event) {
    return <p>Loading...</p>;
  }

  return (
    <div style={{ border: "1px solid black", padding: "15px", margin: "10px" }}>
      
      <h2>{event.title}</h2>

      <p><b>Description:</b> {event.description}</p>
      <p><b>Location:</b> {event.location}</p>
      <p><b>Date:</b> {event.date}</p>
      <p><b>Category:</b> {event.category}</p>
      <p><b>Capacity:</b> {event.capacity}</p>

    </div>
  );
}