import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { Search, UserX, Eye, UserCheck, Shield, MoreHorizontal, Mail, Calendar as CalendarIcon } from 'lucide-react';

const UserManagement = () => {
  // 1. DONNÉES DE TEST (Mock Data)
  const [users, setUsers] = useState([
    { id: 1, name: "Issam Bourhim", email: "issam@social.com", role: "USER", status: "Actif", joinDate: "12 Mai 2026", avatar: "IB" },
    { id: 2, name: "Nizar Ben Ayad", email: "nizar@social.com", role: "ORGANIZER", status: "Actif", joinDate: "10 Mai 2026", avatar: "NB" },
    { id: 3, name: "Hamza Belhaj", email: "hamza@social.com", role: "USER", status: "Banni", joinDate: "05 Mai 2026", avatar: "HB" },
    { id: 4, name: "Dr. El Hamlaoui", email: "prof@ensias.ma", role: "ADMIN", status: "Actif", joinDate: "01 Avr 2026", avatar: "EH" },
    { id: 5, name: "Yassine Alami", email: "yassine@mail.com", role: "USER", status: "Inactif", joinDate: "14 Mai 2026", avatar: "YA" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  // 2. LOGIQUE DE RECHERCHE
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 3. LOGIQUE DE MODÉRATION (Bannir/Réactiver)
  const handleToggleStatus = (id) => {
    setUsers(users.map(u => 
      u.id === id ? { ...u, status: u.status === "Banni" ? "Actif" : "Banni" } : u
    ));
  };

  return (
    <AdminLayout>
      {/* HEADER : Plus compact pour laisser de la place au tableau */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">
            Gestion des <span className="text-orange-600">Utilisateurs</span>
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Supervision et modération des membres de la plateforme.</p>
        </div>

        {/* BARRE DE RECHERCHE LARGE */}
        <div className="relative group w-full lg:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-orange-600 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher par nom ou email..."
            className="w-full bg-slate-900 border border-slate-800 text-white pl-12 pr-4 py-3 rounded-2xl outline-none focus:border-orange-600 focus:ring-1 focus:ring-orange-600/20 transition-all shadow-2xl"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* TABLEAU : w-full pour occuper tout l'écran */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl w-full transition-all hover:border-slate-700/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/30 text-slate-400 text-[11px] uppercase tracking-[0.2em] font-black border-b border-slate-800">
                <th className="p-6">Utilisateur</th>
                <th className="p-6">Rôle</th>
                <th className="p-6">Membre depuis</th>
                <th className="p-6">Statut</th>
                <th className="p-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-800/20 transition-all group">
                    {/* COLONNE INFOS */}
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 bg-gradient-to-br from-orange-600 to-orange-400 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-orange-900/20">
                          {user.avatar}
                        </div>
                        <div>
                          <p className="text-white font-bold text-base group-hover:text-orange-500 transition-colors">{user.name}</p>
                          <div className="flex items-center gap-1.5 text-slate-500 text-xs mt-0.5">
                             <Mail size={12} /> {user.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* COLONNE ROLE */}
                    <td className="p-6">
                      <span className={`flex items-center gap-2 text-xs font-bold ${user.role === 'ADMIN' ? 'text-purple-400' : 'text-slate-300'}`}>
                        {user.role === 'ADMIN' && <Shield size={14} />}
                        {user.role}
                      </span>
                    </td>

                    {/* COLONNE DATE */}
                    <td className="p-6">
                      <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                        <CalendarIcon size={14} className="text-slate-600" />
                        {user.joinDate}
                      </div>
                    </td>

                    {/* COLONNE STATUT */}
                    <td className="p-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        user.status === 'Actif' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 
                        user.status === 'Banni' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 
                        'bg-slate-700/30 text-slate-400 border border-slate-700/50'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Actif' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                        {user.status}
                      </span>
                    </td>

                    {/* COLONNE ACTIONS */}
                    <td className="p-6">
                      <div className="flex justify-end gap-2">
                        <button 
                          title="Voir Profil"
                          className="p-2.5 bg-slate-800/50 hover:bg-orange-600 text-slate-300 hover:text-white rounded-xl transition-all"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => handleToggleStatus(user.id)}
                          title={user.status === 'Banni' ? "Réactiver" : "Bannir"}
                          className={`p-2.5 rounded-xl transition-all ${
                            user.status === 'Banni' 
                            ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white" 
                            : "bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white"
                          }`}
                        >
                          {user.status === 'Banni' ? <UserCheck size={18} /> : <UserX size={18} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-20 text-center text-slate-600 font-bold uppercase italic tracking-widest text-sm">
                    Aucun utilisateur trouvé...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* FOOTER DU TABLEAU : Infos Pagination */}
        <div className="p-6 bg-slate-800/20 border-t border-slate-800 flex justify-between items-center">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
              Affichage de <span className="text-orange-600">{filteredUsers.length}</span> utilisateurs
            </p>
            <div className="flex gap-3">
                <button className="px-5 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 text-xs font-bold transition-colors">Précédent</button>
                <button className="px-5 py-2 bg-orange-600 hover:bg-orange-700 rounded-xl text-white text-xs font-bold transition-colors shadow-lg shadow-orange-900/20">Suivant</button>
            </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UserManagement;