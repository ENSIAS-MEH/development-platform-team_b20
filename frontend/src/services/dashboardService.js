import { eventApi } from './api';

const GATEWAY_URL = 'http://localhost:8080';

export const dashboardService = {

  /**
   * Returns events created by a specific user.
   * Filtered client-side from the full event list since event-service
   * doesn't have a "by organizer" endpoint.
   */
  getEventsCreatedByUser: async (userId) => {
    if (!userId) return [];
    const allEvents = await eventApi.getAllEvents();
    return allEvents.filter(e => e.organizerId === userId);
  },

  /**
   * Returns events a user has joined.
   * Step 1: hit interaction-service to get the list of joined event IDs
   * Step 2: hit event-service for each ID to get full event details
   */
  getEventsJoinedByUser: async (userId) => {
    if (!userId) return [];

    // Step 1: get event IDs
    const idsRes = await fetch(
      `${GATEWAY_URL}/interaction-service/api/users/${userId}/participations`
    );
    if (!idsRes.ok) throw new Error('Failed to load participations');
    const eventIds = await idsRes.json();

    if (eventIds.length === 0) return [];

    // Step 2: fetch each event's details in parallel
    // Errors on individual events (e.g., event was deleted) are tolerated — just skip them
    const events = await Promise.all(
      eventIds.map(async (id) => {
        try {
          return await eventApi.getEventById(id);
        } catch (err) {
          console.warn(`Failed to load event ${id} — possibly deleted`, err);
          return null;
        }
      })
    );

    // Drop nulls (deleted events) and return
    return events.filter(Boolean);
  },
};