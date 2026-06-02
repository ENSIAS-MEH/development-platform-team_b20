import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import EventForm from '../components/events/EventForm';

const EditEventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-dark-950">
      <header className="sticky top-0 z-50 glass-effect border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/events')}
              className="flex items-center gap-2 text-slate-400 hover:text-primary-500 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              Retour
            </button>
            <h1 className="text-xl font-bold text-slate-200">Modifier l'événement</h1>
          </div>
        </div>
      </header>

      <EventForm
        eventId={id}
        onSuccess={() => navigate('/events')}
        onCancel={() => navigate('/events')}
      />
    </div>
  );
};

export default EditEventPage;