import React from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import StatCard from '../../components/admin/StatCard';
import { Users, Calendar, MessageSquare, Activity, ArrowUpRight } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <div className="mb-10">
        <h1 className="text-3xl font-black text-white uppercase italic">Tableau de bord</h1>
        <p className="text-slate-500">Résumé de l'activité globale.</p>
      </div>

      {/* 1. Les Cartes KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Membres" value="1,248" icon={<Users size={24}/>} trend="+5%" />
        <StatCard title="Événements" value="42" icon={<Calendar size={24}/>} trend="+12%" />
        <StatCard title="Comments" value="856" icon={<MessageSquare size={24}/>} trend="+24%" />
        <StatCard title="Activité" value="68%" icon={<Activity size={24}/>} trend="-2%" trendColor="text-red-500 bg-red-500/10" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 2. Bloc Activité Récente (Nouveauté) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-6">Dernières inscriptions</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center font-bold text-white">U</div>
                  <div>
                    <p className="text-white font-bold text-sm">Nouvel Utilisateur #{i}</p>
                    <p className="text-slate-500 text-xs">Il y a 10 minutes</p>
                  </div>
                </div>
                <ArrowUpRight className="text-slate-600" size={18} />
              </div>
            ))}
          </div>
        </div>

        {/* 3. Bloc Catégories Populaires */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-6">Top Catégories</h2>
          <div className="space-y-5">
            <div className="flex justify-between items-center text-sm font-bold">
              <span className="text-orange-600">Musique</span>
              <span className="text-white">45%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
               <div className="bg-orange-600 h-full w-[45%]"></div>
            </div>

            <div className="flex justify-between items-center text-sm font-bold pt-2">
              <span className="text-blue-500">Sport</span>
              <span className="text-white">30%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
               <div className="bg-blue-500 h-full w-[30%]"></div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;