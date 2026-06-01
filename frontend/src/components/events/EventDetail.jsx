import React from 'react';
import { MapPin, Calendar, User, ArrowLeft } from 'lucide-react';

const EventDetail = ({ event, onEdit, canModify = false }) => {
  if (!event) return <div className="text-center py-20"><p className="text-red-400">Événement non trouvé</p></div>;

  return (
    <div className="min-h-screen bg-dark-950 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => window.location.href = '/events'} className="flex items-center gap-2 text-slate-400 hover:text-primary-500 mb-6"><ArrowLeft className="w-5 h-5" /> Retour</button>
        <div className="glass-effect rounded-3xl overflow-hidden">
          <div className="relative h-32 bg-gradient-to-r from-primary-800 to-primary-600 flex items-center p-6">
            <span className="px-4 py-2 bg-dark-950/80 rounded-full text-sm font-semibold text-primary-400">{event.category}</span>
          </div>
          <div className="p-8">
            <h1 className="text-3xl font-bold text-slate-200 mb-6">{event.title}</h1>
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3"><MapPin className="w-5 h-5 text-primary-500" /><div><div className="text-slate-400 text-sm">Lieu</div><div className="text-slate-200 font-semibold">{event.location}</div></div></div>
              <div className="flex items-center gap-3"><Calendar className="w-5 h-5 text-primary-500" /><div><div className="text-slate-400 text-sm">Date</div><div className="text-slate-200 font-semibold">{new Date(event.eventDate).toLocaleString()}</div></div></div>
              <div className="flex items-center gap-3"><User className="w-5 h-5 text-primary-500" /><div><div className="text-slate-400 text-sm">Organisateur</div><div className="text-slate-200 font-semibold">{event.organizerName || 'Inconnu'}</div></div></div>
            </div>
            {event.description && <div className="mb-8"><p className="text-slate-400">{event.description}</p></div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;