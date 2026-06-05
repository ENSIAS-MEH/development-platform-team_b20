// services/authApi.js

// L'URL de base pour ton microservice utilisateur via la Gateway
const AUTH_URL = 'http://localhost:8081/api/v1/auth';

export const authApi = {
  // 1. Inscrire un nouvel utilisateur
  register: async (userData) => {
    const res = await fetch(`${AUTH_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    if (!res.ok) throw new Error('Erreur lors de l\'inscription');
    
    // On retourne le JSON (le UserResponseDto que tu as configuré côté backend)
    return res.json(); 
  },

  // 2. Connecter un utilisateur (Login) - À préparer pour la suite
  login: async (credentials) => {
    const res = await fetch(`${AUTH_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    if (!res.ok) throw new Error('Email ou mot de passe incorrect');
    
    // Généralement, le backend renvoie un Token JWT ici
    return res.json();
  },

  // 3. Récupérer le profil d'un utilisateur
  getProfile: async (email) => {
    const res = await fetch(`http://localhost:8080/user-service/api/v1/users/${email}`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}` -> À ajouter plus tard quand le JWT sera actif
      }
    });
    if (!res.ok) throw new Error('Profil non trouvé');
    return res.json();
  }
};