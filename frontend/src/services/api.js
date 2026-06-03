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
  deleteEvent: async (id) => {
    const res = await fetch(`${API_URL}/events/${id}`, { 
      method: 'DELETE' 
    });
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