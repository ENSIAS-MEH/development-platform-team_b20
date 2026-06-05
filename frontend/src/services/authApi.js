// L'URL pointe directement vers ton user-service pour contourner la Gateway pendant les tests
const AUTH_URL = 'http://localhost:8081/api/v1/auth';

export const authApi = {
  register: async (userData) => {
    const res = await fetch(`${AUTH_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    
    if (!res.ok) {
      // Pour récupérer le message d'erreur exact du backend s'il existe
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Erreur lors de l\'inscription');
    }
    
    return res.json(); 
  },

  login: async (credentials) => {
    const res = await fetch(`${AUTH_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    if (!res.ok) throw new Error('Email ou mot de passe incorrect');
    
    return res.json();
  }
};