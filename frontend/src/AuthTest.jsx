import { useState } from 'react';

export default function AuthTest() {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [fullName, setFullName] = useState('Test User');
  
  const [token, setToken] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [message, setMessage] = useState('');

  // 1. Test de l'inscription via le Gateway
  const handleRegister = async () => {
    try {
      const response = await fetch('http://localhost:8080/user-service/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName })
      });
      const data = await response.json();
      setMessage(response.ok ? '✅ Inscription réussie !' : `❌ Erreur : ${data.message || 'Échec'}`);
    } catch (error) {
      setMessage(`❌ Impossible de joindre le backend : ${error.message}`);
    }
  };

  // 2. Test de la connexion via le Gateway
  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:8080/user-service/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (response.ok) {
        const data = await response.json();
        setToken(data.token); // Sauvegarde du JWT en mémoire
        setMessage('✅ Connexion réussie ! Token reçu.');
      } else {
        setMessage('❌ Identifiants incorrects.');
      }
    } catch (error) {
      setMessage(`❌ Impossible de joindre le backend : ${error.message}`);
    }
  };

  // 3. Test de la route protégée (Profil) via le Gateway
  const fetchProfile = async () => {
    if (!token) {
      setMessage('⚠️ Connecte-toi d\'abord pour avoir un token !');
      return;
    }
    try {
      const response = await fetch('http://localhost:8080/user-service/api/users/me', {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}` 
        }
      });
      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
        setMessage('✅ Profil récupéré avec succès !');
      } else {
        setMessage('❌ Erreur : Token invalide ou expiré.');
      }
    } catch (error) {
      setMessage(`❌ Impossible de joindre le backend : ${error.message}`);
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto space-y-6 font-sans">
      <h1 className="text-2xl font-bold">🛠️ Test du Backend Auth (via Gateway)</h1>
      
      {message && (
        <div className="p-4 bg-gray-100 rounded border border-gray-300 font-mono text-sm">
          {message}
        </div>
      )}

      <div className="space-y-4 p-4 border rounded bg-white shadow-sm">
        <input 
          type="text" placeholder="Nom complet" value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full border p-2 rounded" 
        />
        <input 
          type="email" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded" 
        />
        <input 
          type="password" placeholder="Mot de passe" value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded" 
        />
        
        <div className="flex space-x-2 pt-2">
          <button onClick={handleRegister} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">S'inscrire</button>
          <button onClick={handleLogin} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Se connecter</button>
        </div>
      </div>

      <div className="space-y-4 p-4 border rounded bg-gray-50">
        <h2 className="font-semibold">🔒 Zone Protégée</h2>
        <p className="text-xs text-gray-500 truncate">Token actuel : {token || 'Aucun'}</p>
        <button onClick={fetchProfile} className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
          Récupérer mon Profil
        </button>
        
        {profileData && (
          <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
            {JSON.stringify(profileData, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
