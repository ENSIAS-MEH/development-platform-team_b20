import API from "./api";

// =====================================================================
// PARTICIPATION
// =====================================================================
// All requests go through the gateway with the /interaction-service prefix.
// The gateway strips that prefix and forwards to the actual service.
// TODO: replace `userId` parameters with the authenticated user once JWT is in place.

const BASE = "/interaction-service/api";

// Join an event
export const joinEvent = (eventId, userId) =>
  API.post(`${BASE}/events/${eventId}/join`, null, {
    params: { userId },
  });

// Leave an event
export const leaveEvent = (eventId, userId) =>
  API.delete(`${BASE}/events/${eventId}/leave`, {
    params: { userId },
  });

// Get the list of user IDs who joined an event
export const getParticipantIds = (eventId) =>
  API.get(`${BASE}/events/${eventId}/participants`).then((r) => r.data);

// Get participant count
export const getParticipantCount = (eventId) =>
  API.get(`${BASE}/events/${eventId}/participants/count`).then((r) => r.data.count);


// =====================================================================
// COMMENTS
// =====================================================================

// Add a comment on an event
export const addComment = (eventId, userId, content) =>
  API.post(
    `${BASE}/events/${eventId}/comments`,
    { content },
    { params: { userId } }
  ).then((r) => r.data);

// Get all visible comments for an event (newest first)
export const getComments = (eventId) =>
  API.get(`${BASE}/events/${eventId}/comments`).then((r) => r.data);

// Delete one of your own comments
export const deleteComment = (commentId, userId) =>
  API.delete(`${BASE}/comments/${commentId}`, {
    params: { userId },
  });

// Hide a comment (moderation — for admins, Personne 4)
export const hideComment = (commentId) =>
  API.put(`${BASE}/comments/${commentId}/hide`);


// =====================================================================
// LIKES
// =====================================================================

// Like an event
export const likeEvent = (eventId, userId) =>
  API.post(`${BASE}/events/${eventId}/like`, null, {
    params: { userId },
  });

// Unlike an event
export const unlikeEvent = (eventId, userId) =>
  API.delete(`${BASE}/events/${eventId}/like`, {
    params: { userId },
  });

// Get like info: { count, likedByCurrentUser }
// userId is optional — if omitted, likedByCurrentUser will be false
export const getLikes = (eventId, userId) =>
  API.get(`${BASE}/events/${eventId}/likes`, {
    params: userId ? { userId } : {},
  }).then((r) => r.data);


// =====================================================================
// TEMPORARY: Current user placeholder
// =====================================================================
// Used everywhere until Personne 1's JWT auth is wired up.
// When auth is ready, this gets replaced with something like `useCurrentUser()`
// reading from a context or a token.
export const CURRENT_USER_ID = 1;