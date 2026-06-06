import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { recommendationApi } from '../services/api';
import { Sparkles, MapPin, Calendar, User, Eye, Loader2, Info } from 'lucide-react';

const UserRecommendations = () => {
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // On utilise l'ID 99 pour le test (utilisateur qui n'est pas encore inscrit partout)
  const userId = 99; 

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      const data = await recommendationApi.getRecommendations(userId);
      setRecs(data);
    } catch (err) {
      console.error("Erreur de chargement des recommandations:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour formater la date proprement
  const formatDate = (dateStr) => {
    if (!dateStr) return "Date à venir";
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
      <Loader2 className="text-orange-600 animate-spin mb-4" size={50} />
      <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-sm">
        Analyse de l'écosystème en cours...
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        
        {/* En-tête de la page */}
        <header className="mb-16">
          <div className="flex items-center gap-3 mb-4">
             <Sparkles className="text-orange-500 fill-orange-500" size={24} />
             <span className="text-orange-500 font-black uppercase text-xs tracking-widest">Algorithme Intelligent</span>
          </div>
          <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter">
            SÉLECTION <span className="text-orange-600">POUR VOUS</span>
          </h1>
          <p className="text-slate-500 mt-4 text-lg max-w-2xl">
            Basé sur vos centres d'intérêt et la popularité des événements, voici ce que vous ne devriez pas manquer.
          </p>
        </header>

        {/* Grille des Recommandations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {recs.length > 0 ? recs.map((event) => (
            <div key={event.eventId} className="bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-800 shadow-2xl flex flex-col hover:border-orange-600/30 transition-all duration-300 group">
              
              {/* SECTION IMAGE / BANDEAU RÉPARÉE */}
                <div className="h-64 bg-slate-800/50 relative overflow-hidden flex items-center justify-center p-2">
                {event.imageBase64 ? (
                    <img 
                    src={event.imageBase64.startsWith('data:') ? event.imageBase64 : `data:image/png;base64,${event.imageBase64}`} 
                    // ON CHANGE 'object-cover' par 'object-contain' pour tout voir
                    className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    alt={event.title}
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-orange-600 to-orange-900 flex items-center justify-center opacity-40">
                    <Calendar size={64} className="text-white" />
                    </div>
                )}
                
                {/* Badge Catégorie replacé proprement */}
                <div className="absolute top-4 left-4">
                    <span className="bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest border border-white/10 shadow-xl">
                    {event.category || "Événement"}
                    </span>
                </div>
                </div>
              {/* SECTION CONTENU */}
              <div className="p-8 flex-1 flex flex-col">
                <h2 className="text-2xl font-bold text-white mb-4 leading-tight group-hover:text-orange-500 transition-colors">
                  {event.title}
                </h2>

                <p className="text-slate-500 text-sm mb-8 line-clamp-2 italic flex-1">
                   {event.description || "Rejoignez cet événement pour découvrir de nouvelles opportunités et rencontrer des gens passionnés."}
                </p>

                {/* Liste des infos techniques */}
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-slate-400">
                    <div className="p-2 bg-slate-800 rounded-lg text-orange-600"><MapPin size={16} /></div>
                    <span className="text-xs font-bold uppercase tracking-wide">{event.location || "Casablanca"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400">
                    <div className="p-2 bg-slate-800 rounded-lg text-orange-600"><Calendar size={16} /></div>
                    <span className="text-xs font-bold">{formatDate(event.eventDate)}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400">
                    <div className="p-2 bg-slate-800 rounded-lg text-orange-600"><User size={16} /></div>
                    <span className="text-xs font-bold truncate">{event.organizerName || "Organisateur Certifié"}</span>
                  </div>
                </div>

                {/* Bouton vers les détails de Nizar */}
                <button 
                  onClick={() => navigate(`/events/${event.eventId}`)}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-lg shadow-orange-900/40"
                >
                  <Eye size={20} />
                  Détails & Inscription
                </button>
              </div>

            </div>
          )) : (
            <div className="col-span-full text-center py-24 bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-slate-800">
               <Info className="mx-auto text-slate-700 mb-6" size={64} />
               <h3 className="text-2xl font-bold text-slate-400">Profil à jour !</h3>
               <p className="text-slate-600 italic mt-2">Vous participez déjà aux événements recommandés pour vous.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default UserRecommendations;