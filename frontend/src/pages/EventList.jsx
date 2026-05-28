import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Calendar } from "lucide-react";
import API from "../services/api";

export default function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await API.get("/event-service/api/events");
      setEvents(res.data);
    } catch (e) {
      console.error("Error loading events:", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-center py-12 text-slate-400">Loading events...</p>;
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-400 mb-4 text-lg">No events yet</p>
        <Link
          to="/events/new"
          className="text-primary-600 hover:text-primary-500 transition-colors"
        >
          Create the first one →
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h1 className="text-4xl font-bold mb-8">Events</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((e) => (
          <Link
            key={e.id}
            to={`/events/${e.id}`}
            className="glass-effect rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-primary-600/20 transition-all duration-300 hover:-translate-y-1 group"
          >
            <div className="p-6">
              <span className="inline-block bg-primary-600/10 text-primary-600 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                {e.category || "General"}
              </span>
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary-600 transition-colors">
                {e.title}
              </h3>
              <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                {e.description}
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {e.location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />{" "}
                  {(e.eventDate || e.date)?.split("T")[0]}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}