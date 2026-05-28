import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import {
  getLikes,
  likeEvent,
  unlikeEvent,
  CURRENT_USER_ID,
} from "../../services/interactionService";

export default function LikeButton({ eventId }) {
  const [count, setCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  // Load initial like state when the component mounts or eventId changes
  useEffect(() => {
    refresh();
  }, [eventId]);

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await getLikes(eventId, CURRENT_USER_ID);
      setCount(data.count);
      setLiked(data.likedByCurrentUser);
    } catch (err) {
      console.error("Failed to load likes:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = async () => {
    if (busy) return; // prevent double-clicks

    setBusy(true);

    // Optimistic update — flip the UI immediately, then call the API
    const newLiked = !liked;
    setLiked(newLiked);
    setCount((c) => c + (newLiked ? 1 : -1));

    try {
      if (newLiked) {
        await likeEvent(eventId, CURRENT_USER_ID);
      } else {
        await unlikeEvent(eventId, CURRENT_USER_ID);
      }
    } catch (err) {
      console.error("Like action failed:", err);
      // Revert the optimistic update on failure
      setLiked(!newLiked);
      setCount((c) => c + (newLiked ? -1 : 1));
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <button
        disabled
        className="flex items-center gap-2 px-4 py-2 bg-dark-900 border border-slate-800 rounded-xl text-slate-500 cursor-wait"
      >
        <Heart className="w-5 h-5" />
        <span>...</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={busy}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all border ${
        liked
          ? "bg-primary-600/10 border-primary-600 text-primary-600 hover:bg-primary-600/20"
          : "bg-dark-900 border-slate-800 text-slate-300 hover:border-primary-600 hover:text-primary-600"
      } ${busy ? "opacity-60 cursor-not-allowed" : ""}`}
    >
      <Heart
        className={`w-5 h-5 transition-all ${liked ? "fill-primary-600" : ""}`}
      />
      <span>{count}</span>
    </button>
  );
}