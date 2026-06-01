import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { interactionApi, CURRENT_USER_ID } from '../../services/interactionService';

const LikeButton = ({ eventId }) => {
  const [count, setCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    refresh();
  }, [eventId]);

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await interactionApi.getLikes(eventId, CURRENT_USER_ID);
      setCount(data.count);
      setLiked(data.likedByCurrentUser);
    } catch (err) {
      console.error('Failed to load likes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = async () => {
    if (busy) return;
    setBusy(true);
    const newLiked = !liked;
    setLiked(newLiked);
    setCount(c => c + (newLiked ? 1 : -1));

    try {
      if (newLiked) await interactionApi.likeEvent(eventId, CURRENT_USER_ID);
      else await interactionApi.unlikeEvent(eventId, CURRENT_USER_ID);
    } catch (err) {
      // Revert on failure
      setLiked(!newLiked);
      setCount(c => c + (newLiked ? -1 : 1));
      console.error('Like action failed:', err);
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <button disabled className="flex items-center gap-2 px-4 py-2 bg-dark-900 border border-slate-800 rounded-xl text-slate-500 cursor-wait">
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
          ? 'bg-primary-600/10 border-primary-600 text-primary-500 hover:bg-primary-600/20'
          : 'bg-dark-900 border-slate-800 text-slate-300 hover:border-primary-600 hover:text-primary-500'
      } ${busy ? 'opacity-60 cursor-not-allowed' : ''}`}
    >
      <Heart className={`w-5 h-5 transition-all ${liked ? 'fill-primary-500' : ''}`} />
      <span>{count}</span>
    </button>
  );
};

export default LikeButton;