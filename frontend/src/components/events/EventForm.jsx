import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Tag, Edit2, Image as ImageIcon, X } from 'lucide-react';
import { eventApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const MAX_IMAGE_SIZE_BYTES = 1 * 1024 * 1024; // 1 MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const EventForm = ({ eventId, onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    eventDate: '',
    capacity: '',
    category: '',
    imageBase64: '',
    removeImage: false,
  });
  const [imagePreview, setImagePreview] = useState(null); // preview = the data URL we display
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const categories = ['Conference', 'Workshop', 'Social', 'Sport', 'Culture', 'Musique'];

  useEffect(() => { if (eventId) loadEvent(); }, [eventId]);

  const loadEvent = async () => {
    setLoading(true);
    try {
      const event = await eventApi.getEventById(eventId);
      setFormData({
        title: event.title,
        description: event.description || '',
        location: event.location,
        eventDate: event.eventDate.slice(0, 16),
        capacity: event.capacity || '',
        category: event.category,
        imageBase64: '',
        removeImage: false,
      });
      // If event already has an image, show it as preview
      if (event.imageBase64) {
        setImagePreview(`data:image/jpeg;base64,${event.imageBase64}`);
      }
    } catch (err) {
      setError('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError('Format non supporté. Utilisez JPEG, PNG, WebP ou GIF.');
      return;
    }

    // Validate size
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setError(`Image trop volumineuse. Max ${(MAX_IMAGE_SIZE_BYTES / 1024 / 1024).toFixed(1)} MB.`);
      return;
    }

    setError('');

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result; // e.g. "data:image/png;base64,iVBORw0KG..."
      const base64 = dataUrl.split(',')[1]; // strip the prefix to keep only the encoded bytes
      setFormData(prev => ({ ...prev, imageBase64: base64, removeImage: false }));
      setImagePreview(dataUrl);
    };
    reader.onerror = () => setError("Impossible de lire l'image.");
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, imageBase64: '', removeImage: true });
    setImagePreview(null);
    // Reset the file input so selecting the same file again triggers onChange
    const input = document.getElementById('image-input');
    if (input) input.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Include the logged-in user as organizer when creating; on edit, the backend keeps the existing organizer
      const payload = {
        ...formData,
        organizerId: user?.userId,
        organizerName: user?.fullName || user?.email || 'Anonymous',
      };
      if (eventId) await eventApi.updateEvent(eventId, payload);
      else await eventApi.createEvent(payload);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError("Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="glass-effect rounded-3xl p-8 animate-fade-in">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600/20 rounded-2xl mb-4">
              {eventId ? <Edit2 className="w-8 h-8 text-primary-600" /> : <Calendar className="w-8 h-8 text-primary-600" />}
            </div>
            <h2 className="text-3xl font-bold text-slate-200">{eventId ? 'Modifier' : 'Créer'} un événement</h2>
          </div>

          {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* IMAGE UPLOAD */}
            <div>
              <label className="block text-slate-300 font-semibold mb-2">Image (bannière)</label>
              {imagePreview ? (
                <div className="relative rounded-xl overflow-hidden border border-slate-800">
                  <img src={imagePreview} alt="Aperçu" className="w-full h-48 object-cover" />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-3 right-3 p-2 bg-dark-950/80 hover:bg-red-500/80 rounded-full text-slate-200 transition-all"
                    aria-label="Retirer l'image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label htmlFor="image-input" className="flex flex-col items-center justify-center gap-2 w-full h-48 bg-dark-900 border-2 border-dashed border-slate-800 hover:border-primary-600 rounded-xl text-slate-400 hover:text-primary-500 cursor-pointer transition-all">
                  <ImageIcon className="w-8 h-8" />
                  <span className="text-sm">Cliquer pour choisir une image</span>
                  <span className="text-xs text-slate-500">JPEG, PNG, WebP ou GIF — max 1 MB</span>
                </label>
              )}
              <input
                id="image-input"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            {/* TITLE */}
            <div>
              <label className="block text-slate-300 font-semibold mb-2">Titre *</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full px-4 py-3 bg-dark-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-primary-600" />
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="block text-slate-300 font-semibold mb-2">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full px-4 py-3 bg-dark-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-primary-600 resize-none" />
            </div>

            {/* LOCATION + CATEGORY */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-slate-300 font-semibold mb-2">Lieu *</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input type="text" name="location" value={formData.location} onChange={handleChange} required className="w-full pl-12 pr-4 py-3 bg-dark-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-primary-600" />
                </div>
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-2">Catégorie *</label>
                <div className="relative">
                  <Tag className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <select name="category" value={formData.category} onChange={handleChange} required className="w-full pl-12 pr-4 py-3 bg-dark-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-primary-600">
                    <option value="">Sélectionner</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* DATE + CAPACITY */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-slate-300 font-semibold mb-2">Date et heure *</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input type="datetime-local" name="eventDate" value={formData.eventDate} onChange={handleChange} required className="w-full pl-12 pr-4 py-3 bg-dark-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-primary-600" />
                </div>
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-2">Capacité</label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} min="1" className="w-full pl-12 pr-4 py-3 bg-dark-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-primary-600" />
                </div>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex gap-4 pt-5">
              <button type="submit" disabled={loading} className="flex-1 py-3 bg-primary-600 hover:bg-primary-500 rounded-xl text-white font-semibold transition-all disabled:opacity-50">
                {loading ? 'Chargement...' : (eventId ? 'Modifier' : 'Créer')}
              </button>
              {onCancel && <button type="button" onClick={onCancel} className="px-6 py-3 bg-dark-900 border border-slate-700 hover:border-slate-600 rounded-xl text-slate-300 font-semibold transition-all">Annuler</button>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventForm;