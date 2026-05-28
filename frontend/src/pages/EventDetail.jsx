import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MapPin, Calendar, Users, Tag } from "lucide-react";
import API from "../services/api";
import LikeButton from "../components/interaction/LikeButton";
import JoinLeaveButton from "../components/interaction/JoinLeaveButton";
import CommentSection from "../components/interaction/CommentSection";

export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvent();
  }, [id]);

  const loadEvent = async () => {
    try {
      const res = await API.get(`/event-service/api/events/${id}`);
      setEvent(res.data);
    } catch (error) {
      console.error("Error loading event:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-center py-12 text-slate-400">Loading...</p>;
  }

  if (!event) {
    return <p className="text-center py-12 text-slate-400">Event not found</p>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="glass-effect rounded-3xl p-8 shadow-2xl shadow-primary-600/10">
        <h1 className="text-4xl font-bold mb-3">{event.title}</h1>
        <p className="text-slate-400 mb-8 text-lg">{event.description}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoRow
            icon={<MapPin className="w-5 h-5 text-primary-600" />}
            label="Location"
            value={event.location}
          />
          <InfoRow
            icon={<Calendar className="w-5 h-5 text-primary-600" />}
            label="Date"
            value={(event.eventDate || event.date)?.replace("T", " ")}
          />
          <InfoRow
            icon={<Users className="w-5 h-5 text-primary-600" />}
            label="Capacity"
            value={event.capacity}
          />
          <InfoRow
            icon={<Tag className="w-5 h-5 text-primary-600" />}
            label="Category"
            value={event.category}
          />
        </div>
      </div>

      {/* Interaction bar: Join + Like side by side */}
      <div className="glass-effect rounded-2xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <JoinLeaveButton eventId={id} />
          <LikeButton eventId={id} />
        </div>
      </div>

      {/* Comments */}
      <div className="glass-effect rounded-2xl p-6">
        <CommentSection eventId={id} />
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-4 bg-dark-900 rounded-xl p-4 border border-slate-800">
      {icon}
      <div>
        <p className="text-slate-500 text-xs uppercase tracking-wide font-semibold">
          {label}
        </p>
        <p className="text-slate-200 mt-1">{value || "—"}</p>
      </div>
    </div>
  );
}