import React from 'react';

const ProfilePage = () => {
  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center space-x-4">
        <div className="h-20 w-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-3xl font-bold">U</div>
        <div>
          <h1 className="text-2xl font-bold">Mon Profil</h1>
          <p className="text-gray-600">Bienvenue sur votre espace personnel</p>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-6">
        <div className="p-4 border rounded-md">
          <h3 className="font-semibold text-gray-700">Informations personnelles</h3>
          <p className="mt-2 text-gray-600">Email : utilisateur@exemple.com</p>
          <p className="text-gray-600">Rôle : Utilisateur</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;