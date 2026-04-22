import React, { useState } from "react";
import { createEvent } from "../services/eventService";

export default function EventForm() {

  const [event, setEvent] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    capacity: "",
    category: ""
  });

  const handleChange = (e) => {
    setEvent({
      ...event,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createEvent(event);

    alert("Event created!");

    setEvent({
      title: "",
      description: "",
      location: "",
      date: "",
      capacity: "",
      category: ""
    });
  };

  return (
    <div>
      <h2>Create Event</h2>

      <form onSubmit={handleSubmit}>

        <input
          name="title"
          placeholder="Title"
          value={event.title}
          onChange={handleChange}
          required
        />

        <input
          name="location"
          placeholder="Location"
          value={event.location}
          onChange={handleChange}
        />

        <input
          type="datetime-local"
          name="date"
          value={event.date}
          onChange={handleChange}
        />

        <input
          name="capacity"
          type="number"
          placeholder="Capacity"
          value={event.capacity}
          onChange={handleChange}
        />

        <input
          name="category"
          placeholder="Category"
          value={event.category}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Description"
          value={event.description}
          onChange={handleChange}
        />

        <button type="submit">Create</button>

      </form>
    </div>
  );
}