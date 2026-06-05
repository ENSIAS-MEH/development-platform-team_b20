// src/pages/HomePage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md border border-gray-200 text-center">
        
        <h1 className="text-4xl font-extrabold text-blue-600 mb-4">
          Bienvenue
        </h1>
        
        <p className="text-gray-600 mb-8 text-lg">
          Rejoignez notre plateforme et commencez votre aventure dès aujourd'hui.
        </p>
        
        <button 
          onClick={() => navigate('/login')}
          className="w-full py-3 px-4 border border-transparent rounded-md text-white bg-blue-600 hover:bg-blue-700 font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
        >
          Commencer l'aventure
        </button>

      </div>
    </div>
  );
};

export default HomePage;