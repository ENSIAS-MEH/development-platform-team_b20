import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { eventApi } from '../services/api';

const EditEventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    eventDate: '',
    capacity: '',
    category: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadEvent();
  }, [id]);

  const loadEvent = async () => {
    setLoading(true);
    try {
      const event = await eventApi.getEventById(id);
      setFormData({
        title: event.title,
        description: event.description || '',
        location: event.location,
        eventDate: event.eventDate.slice(0, 16),
        capacity: event.capacity || '',
        category: event.category
      });
    } catch (err) {
      setError('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await eventApi.updateEvent(id, formData);
      navigate('/events');
    } catch (err) {
      setError('Erreur lors de la modification');
      setLoading(false);
    }
  };

  const categories = ['Conference', 'Workshop', 'Social', 'Sport', 'Culture', 'Musique'];

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-16 h-16 bg-primary-600/20 rounded-full mx-auto mb-4"></div>
          <p className="text-slate-400">Chargement...</p>
        </div>
      </div>
    );
  }

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
      
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="glass-effect rounded-3xl p-8">
          <h2 className="text-3xl font-bold text-slate-200 text-center mb-8">Modifier l'événement</h2>
          
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-slate-300 font-semibold mb-2">Titre *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-dark-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-primary-600"
              />
            </div>
            
            <div>
              <label className="block text-slate-300 font-semibold mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 bg-dark-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-primary-600"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-slate-300 font-semibold mb-2">Lieu *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-dark-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-primary-600"
                />
              </div>
              
              <div>
                <label className="block text-slate-300 font-semibold mb-2">Catégorie *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-dark-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-primary-600"
                >
                  <option value="">Sélectionner</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-slate-300 font-semibold mb-2">Date et heure *</label>
                <input
                  type="datetime-local"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-dark-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-primary-600"
                />
              </div>
              
              <div>
                <label className="block text-slate-300 font-semibold mb-2">Capacité</label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-3 bg-dark-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-primary-600"
                />
              </div>
            </div>
            
            <div className="flex gap-4 pt-5">
              <button
                type="submit"
                className="flex-1 py-3 bg-primary-600 hover:bg-primary-500 rounded-xl text-white font-semibold transition-all"
              >
                Modifier
              </button>
              <button
                type="button"
                onClick={() => navigate('/events')}
                className="px-6 py-3 bg-dark-900 border border-slate-700 hover:border-slate-600 rounded-xl text-slate-300 font-semibold transition-all"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditEventPage;