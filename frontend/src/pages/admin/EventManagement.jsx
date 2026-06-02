import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { Search, Trash2, Eye, MapPin, Calendar, Users, X, Mail, AlertCircle } from 'lucide-react';

const EventManagement = () => {
  // 1. DONNÉES DE TEST (S'assurer que les noms correspondent au rendu)
  const [events, setEvents] = useState([
    { id: 1, title: "Tech Meetup Casablanca", organizer: "Nizar Ben Ayad", date: "30 Juin 2026", location: "Casablanca", category: "Tech", status: "Publié", participants: 45 },
    { id: 2, title: "Tournoi de Foot ENSIAS", organizer: "Hamza Belhaj", date: "15 Juin 2026", location: "Rabat", category: "Sport", status: "Publié", participants: 22 },
    { id: 3, title: "Soirée Musique Gnaoua", organizer: "Issam Bourhim", date: "12 Juillet 2026", location: "Essaouira", category: "Culture", status: "Signalé", participants: 120 },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleViewParticipants = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if(window.confirm("Supprimer cet événement ?")) {
      setEvents(events.filter(e => e.id !== id));
    }
  };

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    event.organizer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      {/* HEADER DE LA PAGE - On force text-white */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white uppercase italic tracking-tighter">
            Gestion des <span className="text-orange-600">Événements</span>
          </h1>
          <p className="text-slate-400 text-sm font-medium">Surveillez et modérez les activités de la plateforme.</p>
        </div>

        {/* RECHERCHE */}
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher..."
            className="w-full bg-slate-900 border border-slate-800 text-white pl-12 pr-4 py-3 rounded-2xl outline-none focus:border-orange-600 transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* TABLEAU */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-800/50 text-slate-300 text-[11px] uppercase tracking-widest font-black border-b border-slate-800">
                <th className="p-6">Événement</th>
                <th className="p-6">Organisateur</th>
                <th className="p-6">Détails</th>
                <th className="p-6">Statut</th>
                <th className="p-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredEvents.map((event) => (
                <tr key={event.id} className="hover:bg-slate-800/20 transition-all group">
                  {/* TITRE ET CATEGORIE */}
                  <td className="p-6">
                    <div className="flex flex-col">
                      <span className="text-white font-bold text-base group-hover:text-orange-500 transition-colors">
                        {event.title}
                      </span>
                      <span className="text-[10px] text-orange-500 font-black uppercase mt-1">
                        {event.category}
                      </span>
                    </div>
                  </td>

                  {/* ORGANISATEUR */}
                  <td className="p-6">
                    <span className="text-slate-200 font-medium text-sm">{event.organizer}</span>
                  </td>

                  {/* DETAILS (DATE, LIEU) */}
                  <td className="p-6">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-slate-400 text-xs">
                        <Calendar size={12} className="text-orange-600" /> {event.date}
                      </div>
                      <div className="flex items-center gap-2 text-slate-400 text-xs">
                        <MapPin size={12} className="text-orange-600" /> {event.location}
                      </div>
                    </div>
                  </td>

                  {/* STATUT */}
                  <td className="p-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                      event.status === 'Publié' ? 'bg-emerald-500/10 text-emerald-500' : 
                      event.status === 'Signalé' ? 'bg-red-500/10 text-red-500 animate-pulse' : 
                      'bg-slate-700/30 text-slate-400'
                    }`}>
                      {event.status}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="p-6">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleViewParticipants(event)}
                        className="p-2.5 bg-slate-800 hover:bg-orange-600 text-white rounded-xl transition-all"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(event.id)}
                        className="p-2.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL (FENETRE PARTICIPANTS) */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-800/30">
              <h3 className="text-xl font-black text-white italic tracking-tight">PARTICIPANTS</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white"><X /></button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-orange-600 font-bold text-sm uppercase mb-4">{selectedEvent?.title}</p>
              {/* Simulation de liste */}
              <div className="flex items-center gap-3 p-3 bg-slate-950/50 rounded-2xl border border-slate-800 text-white text-sm font-bold">
                 <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">Y</div>
                 Yassine Alami
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-950/50 rounded-2xl border border-slate-800 text-white text-sm font-bold">
                 <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">S</div>
                 Sara Bennani
              </div>
            </div>
            <div className="p-6">
              <button onClick={() => setShowModal(false)} className="w-full py-3 bg-slate-800 text-white font-bold rounded-2xl">Fermer</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default EventManagement;