import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { eventApi, interactionApi } from '../../services/api';
import { Search, Trash2, Eye, MapPin, Calendar, Users, X, Heart, MessageSquare, Loader2 } from 'lucide-react';

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // États pour la Modal
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [stats, setStats] = useState({ likes: 0, comments: 0, participants: [] });

  useEffect(() => { loadEvents(); }, []);

  // 1. CHARGEMENT DE LA LISTE REELLE
  const loadEvents = async () => {
    try {
      const data = await eventApi.getAllEvents();
      setEvents(data);
    } catch (err) {
      console.error("Erreur chargement events", err);
    } finally {
      setLoading(false);
    }
  };

  // 2. RECUPERATION DES VRAIES INFOS DANS L'OEIL
  const handleOpenDetails = async (event) => {
    setSelectedEvent(event);
    setShowModal(true);
    setLoadingStats(true);
    
    try {
        // On récupère les vraies données de Hamza (Interaction-service)
        const participantsData = await interactionApi.getParticipants(event.id);
        
        // Pour les likes, on appelle l'URL qui renvoie {"count": X}
        const likesRes = await fetch(`http://localhost:8080/interaction-service/api/events/${event.id}/likes`);
        const likesData = await likesRes.json();

        // Pour les commentaires, on compte la taille de la liste renvoyée
        const commsRes = await fetch(`http://localhost:8080/interaction-service/api/events/${event.id}/comments`);
        const commsData = await commsRes.json();

        setStats({ 
            likes: likesData.count || 0,
            comments: commsData.length || 0,
            participants: participantsData || [] 
        });
    } catch (e) {
        console.error("Erreur stats", e);
    } finally {
        setLoadingStats(false);
    }
  };

  // 3. SUPPRESSION REELLE (CORRIGÉE)
  const handleDelete = async (id) => {
    if(window.confirm("🚨 Supprimer définitivement cet événement ?")) {
      try {
        await eventApi.deleteEvent(id);
        setEvents(events.filter(e => e.id !== id));
        alert("Événement supprimé !");
      } catch (err) {
        alert("Erreur lors de la suppression");
      }
    }
  };

  // Logique du Statut (En cours / Terminé)
  const getEventStatus = (dateStr) => {
    const eventDate = new Date(dateStr);
    const now = new Date();
    return eventDate < now ? "Terminé" : "En cours";
  };

  const filteredEvents = events.filter(e => 
    e.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <AdminLayout><div className="flex h-screen items-center justify-center text-orange-600 font-bold animate-pulse">SYNCHRONISATION...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
           <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">Gestion <span className="text-orange-600">Événements</span></h1>
           <p className="text-slate-500 text-sm">Données réelles de Supabase</p>
        </div>
        <div className="relative w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input type="text" placeholder="Rechercher..." className="w-full bg-slate-900 border border-slate-800 text-white pl-12 pr-4 py-2.5 rounded-2xl outline-none focus:border-orange-600 shadow-2xl" onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-800/50 text-slate-400 text-[11px] uppercase tracking-[0.2em] font-black border-b border-slate-800">
              <th className="p-6">Événement</th>
              <th className="p-6">Organisateur</th>
              <th className="p-6">Catégorie</th>
              <th className="p-6">Statut</th>
              <th className="p-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {filteredEvents.map((event) => {
              const status = getEventStatus(event.eventDate);
              return (
                <tr key={event.id} className="hover:bg-slate-800/20 transition-all group">
                  <td className="p-6">
                    <span className="text-white font-bold block group-hover:text-orange-500 transition-colors">{event.title || "Sans titre"}</span>
                  </td>
                  <td className="p-6 text-slate-400 text-sm">{event.organizerName || "ID: "+event.organizerId}</td>
                  <td className="p-6">
                    <span className="text-[10px] bg-slate-950/50 text-orange-500 px-3 py-1 rounded-lg font-black border border-orange-600/20 uppercase">
                        {event.category || "Général"}
                    </span>
                  </td>
                  <td className="p-6">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${status === 'En cours' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-700/30 text-slate-500'}`}>
                      {status}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleOpenDetails(event)} className="p-2.5 bg-slate-800 hover:bg-orange-600 text-white rounded-xl transition-all shadow-lg"><Eye size={18} /></button>
                      <button onClick={() => handleDelete(event.id)} className="p-2.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all shadow-lg"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* --- MODAL DE DÉTAILS --- */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-800/30">
              <h3 className="text-xl font-black text-white italic">DÉTAILS DE L'ÉVÉNEMENT</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white"><X /></button>
            </div>
            
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Infos Techniques */}
              <div>
                <h4 className="text-orange-600 font-black text-xs uppercase mb-4">Informations</h4>
                <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-tighter">{selectedEvent?.title}</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-slate-300 text-sm bg-slate-950/50 p-3 rounded-2xl border border-slate-800">
                    <Calendar className="text-orange-600" size={18} /> {selectedEvent?.eventDate?.split('T')[0]} à {selectedEvent?.eventDate?.split('T')[1]?.slice(0,5)}
                  </div>
                  <div className="flex items-center gap-3 text-slate-300 text-sm bg-slate-950/50 p-3 rounded-2xl border border-slate-800">
                    <MapPin className="text-orange-600" size={18} /> {selectedEvent?.location}
                  </div>
                </div>

                {/* Stats de l'événement */}
                <div className="grid grid-cols-3 gap-3 mt-6">
                    <div className="bg-slate-950/50 p-3 rounded-2xl border border-slate-800 text-center">
                        <Heart className="text-red-500 mx-auto mb-1" size={16} />
                        <span className="text-white font-bold text-lg">{loadingStats ? '...' : stats.likes}</span>
                    </div>
                    <div className="bg-slate-950/50 p-3 rounded-2xl border border-slate-800 text-center">
                        <MessageSquare className="text-blue-500 mx-auto mb-1" size={16} />
                        <span className="text-white font-bold text-lg">{loadingStats ? '...' : stats.comments}</span>
                    </div>
                    <div className="bg-slate-950/50 p-3 rounded-2xl border border-slate-800 text-center">
                        <Users className="text-orange-600 mx-auto mb-1" size={16} />
                        <span className="text-white font-bold text-lg">{loadingStats ? '...' : stats.participants.length}</span>
                    </div>
                </div>
              </div>

              {/* Liste des Inscrits */}
              <div className="border-l border-slate-800 pl-8">
                <h4 className="text-slate-500 font-black text-xs uppercase tracking-widest mb-4">Inscrits Réels</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                  {loadingStats ? (
                      <div className="flex justify-center py-10"><Loader2 className="animate-spin text-orange-600" /></div>
                  ) : stats.participants.map((id) => (
                    <div key={id} className="flex items-center justify-between p-3 bg-slate-950/30 rounded-xl border border-slate-800/50">
                      <span className="text-white text-xs font-bold uppercase italic">Membre #{id}</span>
                      <span className="text-slate-500 text-[10px]">user{id}@ensias.ma</span>
                    </div>
                  ))}
                  {!loadingStats && stats.participants.length === 0 && <p className="text-slate-600 text-center py-10 italic">Aucun inscrit</p>}
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-slate-800/20 text-right">
              <button onClick={() => setShowModal(false)} className="px-8 py-3 bg-orange-600 text-white font-bold rounded-2xl hover:bg-orange-700 transition-all shadow-lg shadow-orange-900/20 uppercase tracking-widest text-xs">Fermer</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default EventManagement;