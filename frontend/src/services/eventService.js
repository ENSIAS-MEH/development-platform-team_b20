const API_URL = `${import.meta.env.VITE_API_URL || ''}/event-service/api`;

export const eventApi = {
  getAllEvents: async () => {
    const res = await fetch(`${API_URL}/events`);
    if (!res.ok) throw new Error('Erreur chargement');
    return res.json();
  },
  
  getEventById: async (id) => {
    const res = await fetch(`${API_URL}/events/${id}`);
    return res.json();
  },
  
  createEvent: async (data) => {
    const res = await fetch(`${API_URL}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  
  updateEvent: async (id, data) => {
    const res = await fetch(`${API_URL}/events/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  
  deleteEvent: async (id) => {
    return fetch(`${API_URL}/events/${id}`, { method: 'DELETE' });
  },
  
  searchEvents: async (params) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_URL}/events/search?${query}`);
    return res.json();
  }
};