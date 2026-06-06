const GATEWAY_URL = 'http://localhost:8080';
const API_URL = 'http://localhost:8080/event-service/api';

export const eventApi = {
  // Récupérer tous les événements
  getAllEvents: async () => {
    const res = await fetch(`${API_URL}/events`);
    if (!res.ok) throw new Error('Erreur chargement');
    return res.json();
  },
  
  // Récupérer un événement par ID
  getEventById: async (id) => {
    const res = await fetch(`${API_URL}/events/${id}`);
    if (!res.ok) throw new Error('Événement non trouvé');
    return res.json();
  },
  
  // Créer un événement
  createEvent: async (data) => {
    const res = await fetch(`${API_URL}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Erreur création');
    return res.json();
  },
  
  // Modifier un événement
  updateEvent: async (id, data) => {
    const res = await fetch(`${API_URL}/events/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Erreur modification');
    return res.json();
  },
  
  // Supprimer un événement
  deleteEvent: async (id, userId) => {
    const url = userId
      ? `${API_URL}/events/${id}?userId=${userId}`
      : `${API_URL}/events/${id}`;
    const res = await fetch(url, { method: 'DELETE' });
    if (!res.ok) throw new Error('Erreur suppression');
    return true;
  },
  
  // Rechercher des événements (côté client)
  searchEvents: async (params) => {
    // Récupérer tous les événements
    const allEvents = await eventApi.getAllEvents();
    
    // Filtrer côté frontend
    let filteredEvents = [...allEvents];
    
    // Filtrer par mot-clé (titre ou description)
    if (params.keyword && params.keyword.trim() !== '') {
      const keyword = params.keyword.toLowerCase();
      filteredEvents = filteredEvents.filter(event => 
        event.title.toLowerCase().includes(keyword) ||
        (event.description && event.description.toLowerCase().includes(keyword))
      );
    }
    
    // Filtrer par catégorie
    if (params.category && params.category !== '') {
      filteredEvents = filteredEvents.filter(event => 
        event.category === params.category
      );
    }
    
    // Filtrer par lieu
    if (params.location && params.location.trim() !== '') {
      const location = params.location.toLowerCase();
      filteredEvents = filteredEvents.filter(event => 
        event.location.toLowerCase().includes(location)
      );
    }
    
    // Filtrer par "à venir"
    if (params.upcomingOnly === true) {
      const now = new Date();
      filteredEvents = filteredEvents.filter(event => 
        new Date(event.eventDate) > now
      );
    }
    
    return filteredEvents;
  }
  };
  //fin code nizar
// --- 2. TA PARTIE ADMIN (AJOUTÉE EN DESSOUS) ---
const ADMIN_API_URL = `${GATEWAY_URL}/admin-service/api`;

export const adminApi = {
  getStats: async () => {
    const res = await fetch(`${ADMIN_API_URL}/admin/dashboard/stats`);
    if (!res.ok) throw new Error('Erreur lors de la récupération des stats');
    return res.json();
  },
  // Nouvelle route pour la liste des membres
  getAllUsers: async () => {
    const res = await fetch(`${GATEWAY_URL}/user-service/api/users`);
    if (!res.ok) return [];
    return res.json();
  }
};

// --- 3. TA PARTIE INTERACTION (AJOUTÉE EN DESSOUS) ---
export const interactionApi = {
  getParticipants: async (eventId) => {
    const res = await fetch(`${GATEWAY_URL}/interaction-service/api/events/${eventId}/participants`);
    if (!res.ok) return [];
    return res.json(); 
  }
};

export const recommendationApi = {
  getRecommendations: async (userId) => {
    // ON REPASSE PAR LA GATEWAY (8080)
    const res = await fetch(`http://localhost:8080/recommendation-service/api/recommendations/user/${userId}`);
    if (!res.ok) return [];
    return res.json();
  }
};

export const userApi = {
  // Récupérer mes infos (Hatim)
  getMe: async (userId) => {
    const res = await fetch(`${GATEWAY_URL}/user-service/api/users/${userId}`);
    if (!res.ok) throw new Error('Erreur profil');
    return res.json();
  },
  // Mettre à jour mes infos
  updateMe: async (userId, data) => {
    const res = await fetch(`${GATEWAY_URL}/user-service/api/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  }
};