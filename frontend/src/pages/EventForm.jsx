import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function EventForm() {
  const navigate = useNavigate();
  const [event, setEvent] = useState({
    title: "",
    description: "",
    location: "",
    eventDate: "",
    capacity: 50,
    category: "",
    organizerId: 1, // TODO: replace with logged-in user once auth is in place
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (e) => {
    setEvent({ ...event, [field]: e.target.value });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await API.post("/event-service/api/events", event);
      navigate("/");
    } catch (err) {
      alert("Failed to create event: " + (err.response?.data?.error || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <h1 className="text-4xl font-bold mb-8">Create Event</h1>
      <div className="glass-effect rounded-2xl p-8 space-y-5">
        <Field label="Title">
          <Input value={event.title} onChange={handleChange("title")} />
        </Field>
        <Field label="Description">
          <textarea
            value={event.description}
            onChange={handleChange("description")}
            rows={3}
            className="w-full px-4 py-3 bg-dark-900 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-600 transition-all"
          />
        </Field>
        <Field label="Location">
          <Input value={event.location} onChange={handleChange("location")} />
        </Field>
        <Field label="Date & Time">
          <Input
            type="datetime-local"
            value={event.eventDate}
            onChange={handleChange("eventDate")}
          />
        </Field>
        <Field label="Capacity">
          <Input
            type="number"
            value={event.capacity}
            onChange={handleChange("capacity")}
          />
        </Field>
        <Field label="Category">
          <Input
            value={event.category}
            onChange={handleChange("category")}
            placeholder="Tech, Sports, Music..."
          />
        </Field>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white font-semibold transition-all shadow-lg shadow-primary-600/20"
        >
          {submitting ? "Creating..." : "Create Event"}
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-sm text-slate-400 mb-2 block font-medium">
        {label}
      </span>
      {children}
    </label>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      className="w-full px-4 py-3 bg-dark-900 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-600 transition-all"
    />
  );
}