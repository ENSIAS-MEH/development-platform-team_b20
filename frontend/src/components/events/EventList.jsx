import React from 'react';
import { MapPin, Calendar, User, Eye, Edit2, Trash2 } from 'lucide-react';
import { eventApi } from '../../services/api';

const EventList = ({ events, onEventDeleted, onEdit, currentUserId = 1 }) => {
  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      try {
        await eventApi.deleteEvent(id);
        if (onEventDeleted) onEventDeleted();
      } catch (error) {
        alert('Erreur lors de la suppression');
      }
    }
  };

  if (!events || events.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="glass-effect rounded-3xl p-12 max-w-md mx-auto">
          <p className="text-slate-400">Aucun événement trouvé</p>
          <p className="text-slate-500 text-sm mt-2">Créez le premier événement !</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map(event => (
        <div key={event.id} className="glass-effect rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-primary-600/20 transition-all duration-300 hover:-translate-y-1">
          <div className="h-28 bg-gradient-to-r from-primary-800 to-primary-600 flex items-center justify-between p-4">
            <span className="px-3 py-1 bg-dark-950/80 backdrop-blur rounded-full text-xs font-semibold text-primary-400">
              {event.category}
            </span>
          </div>
          
          <div className="p-5">
            <h3 className="text-xl font-bold text-slate-200 mb-3">{event.title}</h3>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <MapPin className="w-4 h-4 text-primary-500" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Calendar className="w-4 h-4 text-primary-500" />
                <span>{new Date(event.eventDate).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <User className="w-4 h-4 text-primary-500" />
                <span>{event.organizerName || 'Organisateur'}</span>
              </div>
            </div>
            
            <p className="text-slate-400 text-sm line-clamp-2 mb-4">
              {event.description || 'Aucune description'}
            </p>
            
            <div className="flex gap-2 pt-4 border-t border-slate-800">
              <button
                onClick={() => window.location.href = `/events/${event.id}`}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary-600 hover:bg-primary-500 rounded-xl text-white font-semibold transition-all"
              >
                <Eye className="w-4 h-4" /> Détails
              </button>
              
              {currentUserId === event.organizerId && (
                <>
                  <button
                    onClick={() => onEdit(event.id)}
                    className="flex items-center justify-center px-3 py-2 bg-dark-900 border border-slate-700 hover:border-primary-600 rounded-xl text-slate-300 hover:text-primary-500 transition-all"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="flex items-center justify-center px-3 py-2 bg-dark-900 border border-slate-700 hover:border-red-500 rounded-xl text-slate-300 hover:text-red-500 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventList;