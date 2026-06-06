import React from 'react';
import { LayoutDashboard, Users, User, Calendar, BarChart3, LogOut, MessageSquare } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const menuItems = [
    { path: '/admin', icon: <LayoutDashboard size={20} />, label: 'Vue d\'ensemble' },
    { path: '/admin/users', icon: <Users size={20} />, label: 'Utilisateurs' },
    { path: '/admin/events', icon: <Calendar size={20} />, label: 'Événements' },
    { path: '/admin/stats', icon: <BarChart3 size={20} />, label: 'Statistiques' },
    { path: '/admin/moderation', icon: <MessageSquare size={20} />, label: 'Modération' },
    { path: '/admin/profile', icon: <User size={20} />, label: 'Mon Profil' }
  ];

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-200 font-sans overflow-hidden">
      
      {/* SIDEBAR : Largeur fixe de 64 (256px) */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col fixed h-full z-50">
        <div className="p-8">
          <h2 className="text-2xl font-black text-orange-600 italic tracking-tighter">
            Dashboard <span className="text-white">ADMIN</span>
          </h2>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-2xl font-bold transition-all ${
                location.pathname === item.path 
                ? "bg-orange-600 text-white shadow-lg shadow-orange-900/40" 
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {item.icon}
              <span className="text-sm">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-800">
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="flex items-center gap-4 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-2xl transition-all font-bold text-sm w-full"
          >
            <LogOut size={20} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* ZONE DE CONTENU : ml-64 pour coller à la sidebar et w-full pour prendre tout le reste */}
      <main className="flex-1 ml-64 min-h-screen">
        <div className="p-8 w-full"> 
           {children}
        </div>
      </main>

    </div>
  );
};

export default AdminLayout;