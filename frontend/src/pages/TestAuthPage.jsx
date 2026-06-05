import React, { useState } from 'react';
import { authApi } from '../services/authApi'; // On importe ton fichier d'API

const TestAuthPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Appel à ton API via fetch
      await authApi.register(formData);
      setMessage('Inscription réussie ! Vérifie ta base de données.');
      setIsError(false);
      // On vide le formulaire
      setFormData({ fullName: '', email: '', password: '' });
    } catch (error) {
      console.error('Erreur:', error);
      setMessage(error.message || 'Erreur lors de l\'inscription.');
      setIsError(true);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white border border-gray-200 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Test d'Inscription</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom Complet</label>
          <input 
            type="text" name="fullName" placeholder="Ex: Nizar Ben Ayad" 
            value={formData.fullName} onChange={handleChange} required 
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input 
            type="email" name="email" placeholder="email@exemple.com" 
            value={formData.email} onChange={handleChange} required 
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
          <input 
            type="password" name="password" placeholder="••••••••" 
            value={formData.password} onChange={handleChange} required 
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
        >
          S'inscrire
        </button>
      </form>

      {/* Affichage des messages de succès ou d'erreur */}
      {message && (
        <div className={`mt-6 p-4 rounded-md text-sm font-medium text-center ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default TestAuthPage;