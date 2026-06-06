import React, { useEffect, useState } from 'react';
import { UserPlus, UserMinus, Users } from 'lucide-react';
import { interactionApi } from '../../services/interactionService';
import { useAuth } from '../../context/AuthContext';

const JoinLeaveButton = ({ eventId }) => {
  const { user, isAuthenticated } = useAuth();
  const userId = user?.userId;
  const [joined, setJoined] = useState(false);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    refresh();
  }, [eventId]);

  const refresh = async () => {
    setLoading(true);
    try {
      const ids = await interactionApi.getParticipantIds(eventId);
      setCount(ids.length);
      setJoined(userId ? ids.includes(userId) : false);
    } catch (err) {
      console.error('Failed to load participants:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = async () => {
    if (!isAuthenticated) return;
    if (busy) return;
    setBusy(true);
    setError(null);
    const newJoined = !joined;
    setJoined(newJoined);
    setCount(c => c + (newJoined ? 1 : -1));

    try {
      if (newJoined) await interactionApi.joinEvent(eventId, userId);
      else await interactionApi.leaveEvent(eventId, userId);
    } catch (err) {
      setJoined(!newJoined);
      setCount(c => c + (newJoined ? -1 : 1));
      setError(err.message || 'Erreur');
      setTimeout(() => setError(null), 4000);
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-3">
        <button disabled className="flex items-center gap-2 px-5 py-2.5 bg-dark-900 border border-slate-800 rounded-xl text-slate-500 cursor-wait">
          <Users className="w-5 h-5" />
          <span>Chargement...</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={handleClick}
          disabled={busy || !isAuthenticated}
          title={!isAuthenticated ? 'Connectez-vous pour participer' : ''}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all ${
            joined
              ? 'bg-dark-900 border border-slate-700 text-slate-300 hover:border-red-500 hover:text-red-500'
              : 'bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-600/20'
          } ${busy || !isAuthenticated ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          {joined ? <UserMinus className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
          <span>{joined ? 'Quitter' : 'Participer'}</span>
        </button>

        <span className="flex items-center gap-1.5 text-slate-400 text-sm">
          <Users className="w-4 h-4" />
          <span><strong className="text-slate-200">{count}</strong> {count === 1 ? 'participant' : 'participants'}</span>
        </span>
      </div>

      {error && (
        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
    </div>
  );
};

export default JoinLeaveButton;