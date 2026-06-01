import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import EventForm from '../components/events/EventForm';

const CreateEventPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-dark-950">
      <header className="sticky top-0 z-50 glass-effect border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => navigate('/events')} className="text-slate-400 hover:text-primary-500"><ArrowLeft className="w-5 h-5" /></button>
          <h1 className="text-xl font-bold text-slate-200">Créer un événement</h1>
        </div>
      </header>
      <EventForm onSuccess={() => navigate('/events')} onCancel={() => navigate('/events')} />
    </div>
  );
};

export default CreateEventPage;