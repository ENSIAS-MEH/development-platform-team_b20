import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../services/authApi';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      // ✅ Appel correct à l'API exportée
      await authApi.register(formData);
      setIsSuccess(true);
      setMessage("Inscription réussie ! Redirection en cours...");
      
      setTimeout(() => {
        navigate('/profile'); 
      }, 2000);
      
    } catch (error) {
      setIsSuccess(false);
      setMessage(error.message || "Erreur lors de l'inscription.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Créer un compte</h2>
        
        {message && (
          <div className={`p-3 rounded mb-4 text-center font-semibold ${isSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom complet</label>
            <input 
              type="text" name="fullName"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={formData.fullName} onChange={handleChange} required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" name="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={formData.email} onChange={handleChange} required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
            <input 
              type="password" name="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={formData.password} onChange={handleChange} required
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-2 px-4 border border-transparent rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            S'inscrire
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Déjà un compte ?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;