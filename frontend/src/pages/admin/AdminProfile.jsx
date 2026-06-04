import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { userApi } from '../../services/api';
import { User, Mail, Shield, Save, Camera, CheckCircle } from 'lucide-react';

const AdminProfile = () => {
  const [profile, setProfile] = useState({ fullName: "Hatim Admin", email: "admin@social.com", role: "ADMIN" });
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // On simule ton ID = 1
  const userId = 1;

  useEffect(() => {
    // On charge tes vraies infos au démarrage
    userApi.getMe(userId)
      .then(data => setProfile(data))
      .catch(err => console.log("Issam n'a pas encore fini, on garde les infos de test"));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await userApi.updateMe(userId, profile);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) { alert("Erreur lors de la mise à jour"); }
    finally { setIsSaving(false); }
  };

  return (
    <AdminLayout>
      <div className="mb-10">
        <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">Mon <span className="text-orange-600">Profil</span></h1>
        <p className="text-slate-500">Gérez vos informations personnelles d'administrateur.</p>
      </div>

      <div className="max-w-3xl bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
        {/* Banner de profil */}
        <div className="h-32 bg-gradient-to-r from-orange-600 to-orange-400 relative">
            <div className="absolute -bottom-12 left-10">
                <div className="w-24 h-24 bg-slate-900 rounded-3xl border-4 border-slate-950 flex items-center justify-center text-orange-600 shadow-2xl relative group">
                    <User size={40} strokeWidth={3} />
                    <div className="absolute inset-0 bg-black/40 rounded-3xl opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                        <Camera className="text-white" size={20} />
                    </div>
                </div>
            </div>
        </div>

        <form onSubmit={handleSubmit} className="p-12 pt-16 space-y-8">
          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl text-emerald-500 flex items-center gap-3 animate-bounce">
              <CheckCircle size={20} /> <span className="font-bold text-sm uppercase">Profil mis à jour avec succès !</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Champ Nom */}
            <div className="space-y-2">
              <label className="text-slate-500 text-xs font-black uppercase tracking-widest ml-1">Nom Complet</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                <input 
                  type="text" 
                  value={profile.fullName}
                  onChange={(e) => setProfile({...profile, fullName: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-orange-600 outline-none transition-all font-bold"
                />
              </div>
            </div>

            {/* Champ Email */}
            <div className="space-y-2">
              <label className="text-slate-500 text-xs font-black uppercase tracking-widest ml-1">Adresse Email</label>
              <div className="relative opacity-60">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                <input 
                  type="email" 
                  value={profile.email} 
                  disabled
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-slate-400 outline-none cursor-not-allowed font-bold"
                />
              </div>
            </div>
          </div>

          {/* Rôle (Lecture seule) */}
          <div className="p-6 bg-orange-600/5 border border-orange-600/20 rounded-3xl flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-orange-600 rounded-2xl text-white shadow-lg shadow-orange-900/40">
                  <Shield size={24} />
               </div>
               <div>
                  <p className="text-white font-black uppercase italic tracking-wider">Statut du compte</p>
                  <p className="text-orange-500 text-xs font-bold">Administrateur Principal de la Plateforme</p>
               </div>
            </div>
            <span className="bg-orange-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                Niveau 1
            </span>
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              disabled={isSaving}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl shadow-orange-900/40"
            >
              {isSaving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
              Sauvegarder les modifications
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminProfile;