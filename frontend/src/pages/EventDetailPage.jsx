import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, User, ArrowLeft, Edit2 } from 'lucide-react';
import { eventApi } from '../services/api';
import LikeButton from '../components/interaction/LikeButton';
import JoinLeaveButton from '../components/interaction/JoinLeaveButton';
import CommentSection from '../components/interaction/CommentSection';

const CURRENT_USER_ID = 1; // TODO: replace with logged-in user once Issam's JWT auth is wired

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadEvent();
  }, [id]);

  const loadEvent = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await eventApi.getEventById(id);
      console.log('Événement chargé:', data);
      setEvent(data);
    } catch (err) {
      console.error('Erreur:', err);
      setError('Événement non trouvé');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/events/edit/${id}`);
  };

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

  if (error || !event) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || 'Événement non trouvé'}</p>
          <button
            onClick={() => navigate('/events')}
            className="px-6 py-2 bg-primary-600 hover:bg-primary-500 rounded-xl text-white transition-all"
          >
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/events')}
          className="flex items-center gap-2 text-slate-400 hover:text-primary-500 transition-all mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Retour à la liste
        </button>
        
        <div className="glass-effect rounded-3xl overflow-hidden">
          <div className="relative h-48 overflow-hidden">
            {event.imageBase64 ? (
              <>
                <img
                  src={`data:image/jpeg;base64,${event.imageBase64}`}
                  alt={event.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Dark gradient overlay so the badge stays readable */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-dark-950/20 to-transparent" />
              </>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-500" />
            )}

            {/* Category badge — overlaid on top of either image or gradient */}
            <div className="relative h-full flex items-center justify-between p-6">
              <span className="px-4 py-2 bg-dark-950/80 backdrop-blur rounded-full text-sm font-semibold text-primary-500">
                {event.category}
              </span>
            </div>
          </div>
          
          <div className="p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-200 mb-6">{event.title}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary-500 mt-0.5" />
                  <div>
                    <div className="text-slate-400 text-sm">Lieu</div>
                    <div className="text-slate-200 font-semibold">{event.location}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-primary-500 mt-0.5" />
                  <div>
                    <div className="text-slate-400 text-sm">Date et heure</div>
                    <div className="text-slate-200 font-semibold">
                      {new Date(event.eventDate).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-primary-500 mt-0.5" />
                  <div>
                    <div className="text-slate-400 text-sm">Organisateur</div>
                    <div className="text-slate-200 font-semibold">
                      {event.organizerName || 'Inconnu'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {event.description && (
              <div className="mb-8">
                <h3 className="text-slate-300 font-semibold mb-3">Description</h3>
                <p className="text-slate-400 leading-relaxed">{event.description}</p>
              </div>
            )}

            {/* Interaction bar (Personne 3) */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-6 border-t border-slate-800">
              <JoinLeaveButton eventId={id} />
              <LikeButton eventId={id} />
            </div>

            {/* Comments (Personne 3) */}
            <div className="py-6 border-t border-slate-800">
              <CommentSection eventId={id} />
            </div>
            
            {event.organizerId === CURRENT_USER_ID && (
              <div className="pt-6 border-t border-slate-800">
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-500 rounded-xl text-white font-semibold transition-all"
                >
                  <Edit2 className="w-4 h-4" />
                  Modifier cet événement
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;