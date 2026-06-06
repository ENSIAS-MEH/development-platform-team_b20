// =====================================================================
// Interaction Service API
// Calls go through the API Gateway with the /interaction-service prefix
// =====================================================================
// TODO: replace `userId` parameters with the authenticated user once JWT lands

const API_URL = 'http://localhost:8080/interaction-service/api';

// Helper: build query string from params
const qs = (params) => {
  const filtered = Object.entries(params).filter(([_, v]) => v !== undefined && v !== null);
  if (filtered.length === 0) return '';
  return '?' + filtered.map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
};

// Export de l'ID utilisateur courant via variable d'environnement
export const CURRENT_USER_ID = import.meta.env.VITE_CURRENT_USER_ID || "temp-user-123";

// Une seule déclaration de interactionApi
export const interactionApi = {

  // ----- PARTICIPATION -----

  joinEvent: async (eventId, userId) => {
    const res = await fetch(`${API_URL}/events/${eventId}/join${qs({ userId })}`, {
      method: 'POST',
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to join event');
    }
    return res.json();
  },

  leaveEvent: async (eventId, userId) => {
    const res = await fetch(`${API_URL}/events/${eventId}/leave${qs({ userId })}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to leave event');
    }
    return res.json();
  },

  getParticipantIds: async (eventId) => {
    const res = await fetch(`${API_URL}/events/${eventId}/participants`);
    if (!res.ok) throw new Error('Failed to load participants');
    return res.json();
  },

  getParticipantCount: async (eventId) => {
    const res = await fetch(`${API_URL}/events/${eventId}/participants/count`);
    if (!res.ok) throw new Error('Failed to load count');
    const data = await res.json();
    return data.count;
  },

  // ----- COMMENTS -----

  addComment: async (eventId, userId, content) => {
    const res = await fetch(`${API_URL}/events/${eventId}/comments${qs({ userId })}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to post comment');
    }
    return res.json();
  },

  getComments: async (eventId) => {
    const res = await fetch(`${API_URL}/events/${eventId}/comments`);
    if (!res.ok) throw new Error('Failed to load comments');
    return res.json();
  },

  deleteComment: async (commentId, userId) => {
    const res = await fetch(`${API_URL}/comments/${commentId}${qs({ userId })}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to delete comment');
    }
    return res.json();
  },

  // ----- LIKES -----

  likeEvent: async (eventId, userId) => {
    const res = await fetch(`${API_URL}/events/${eventId}/like${qs({ userId })}`, {
      method: 'POST',
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to like');
    }
    return res.json();
  },

  unlikeEvent: async (eventId, userId) => {
    const res = await fetch(`${API_URL}/events/${eventId}/like${qs({ userId })}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to unlike');
    }
    return res.json();
  },

  getLikes: async (eventId, userId) => {
    const res = await fetch(`${API_URL}/events/${eventId}/likes${qs({ userId })}`);
    if (!res.ok) throw new Error('Failed to load likes');
    return res.json();
  },
};