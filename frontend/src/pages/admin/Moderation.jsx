import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { Eye, EyeOff, MessageSquare, AlertCircle, Loader2 } from 'lucide-react';

const Moderation = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = async () => {
    setError(false);
    try {
      // Note : Assure-toi que ton service Admin appelle bien Hamza 
      // pour récupérer TOUS les commentaires (même les HIDDEN)
      const res = await fetch('http://localhost:8080/admin-service/api/admin/dashboard/comments');
      if (res.ok) {
        const data = await res.json();
        setComments(Array.isArray(data) ? data : []);
      } else { setError(true); }
    } catch (err) { 
      console.error("Erreur API:", err);
      setError(true); 
    }
    finally { setLoading(false); }
  };

  // FONCTION DE BASCULEMENT (TOGGLE) : Ne supprime pas, change juste le statut
  const handleToggleStatus = async (commentId, currentStatus) => {
    // Si c'est HIDDEN, on veut passer à VISIBLE, et inversement
    const newStatus = currentStatus === 'HIDDEN' ? 'VISIBLE' : 'HIDDEN';
    
    const actionMsg = newStatus === 'HIDDEN' 
      ? "Masquer ce message aux yeux des utilisateurs ?" 
      : "Rétablir la visibilité de ce message ?";
    
    if(window.confirm(actionMsg)) {
        try {
            // Appel à la Gateway
            const response = await fetch(`http://localhost:8080/admin-service/api/admin/dashboard/comments/${commentId}/hide`, { 
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' }
            });

            if(response.ok) {
                // MISE À JOUR DE L'ÉTAT LOCAL : On ne filtre pas, on modifie juste l'objet
                setComments(prevComments => prevComments.map(c => 
                    c.id === commentId ? { ...c, status: newStatus } : c
                ));
            }
        } catch (err) {
            alert("Erreur lors de la communication avec le service de modération");
        }
    }
  };

  if (loading) return (
    <AdminLayout>
      <div className="flex h-[70vh] items-center justify-center text-orange-600 font-bold animate-pulse uppercase tracking-[0.3em]">
        Scan du flux social...
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="mb-10">
        <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">
          Modération <span className="text-orange-600">Contenu</span>
        </h1>
        <p className="text-slate-500 font-medium">Gestion et historique de la visibilité des messages.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/50 text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black border-b border-slate-800">
                <th className="p-6">Message</th>
                <th className="p-6 text-center">Statut Actuel</th>
                <th className="p-6 text-right">Action Modérateur</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {comments.map((c) => (
                <tr key={c.id} className={`transition-all duration-300 ${c.status === 'HIDDEN' ? 'bg-red-500/[0.03]' : 'hover:bg-slate-800/20'}`}>
                  
                  {/* MESSAGE (Barré si caché) */}
                  <td className="p-6">
                    <p className={`text-sm leading-relaxed transition-all ${
                      c.status === 'HIDDEN' ? 'text-slate-600 italic line-through opacity-50' : 'text-white font-medium'
                    }`}>
                      "{c.content}"
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">User ID: {c.userId}</span>
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Event ID: {c.eventId}</span>
                    </div>
                  </td>

                  {/* STATUT (BADGE VERT OU ROUGE) */}
                  <td className="p-6 text-center">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter border ${
                      c.status === 'HIDDEN' 
                      ? 'bg-red-500/10 text-red-500 border-red-500/20' 
                      : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${c.status === 'HIDDEN' ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
                      {c.status || 'VISIBLE'}
                    </span>
                  </td>

                  {/* ACTION (OEIL VERT OU ROUGE) */}
                  <td className="p-6 text-right">
                    <button 
                      onClick={() => handleToggleStatus(c.id, c.status)}
                      className={`p-3 rounded-2xl transition-all shadow-lg ${
                        c.status === 'HIDDEN' 
                        ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white" 
                        : "bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white"
                      }`}
                      title={c.status === 'HIDDEN' ? "Rétablir le message" : "Masquer le message"}
                    >
                      {/* Si c'est caché, on montre l'oeil normal pour "ré-ouvrir" */}
                      {c.status === 'HIDDEN' ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {comments.length === 0 && !error && (
            <div className="p-20 text-center text-slate-600 italic uppercase tracking-widest text-sm font-bold">
              Aucun commentaire trouvé.
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Moderation;