import React, { useState, useEffect } from 'react'; // Ajout de useState et useEffect
import AdminLayout from '../../layouts/AdminLayout';
import StatCard from '../../components/admin/StatCard';
import { adminApi } from '../../services/api'; // Import de ton service API
import { Users, Calendar, MessageSquare, Activity, ArrowUpRight } from 'lucide-react';

const AdminDashboard = () => {
  // 1. État pour stocker les vraies statistiques
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // 2. Appel au Backend au chargement de la page
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await adminApi.getStats();
        setStats(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Affichage pendant le chargement
  if (loading) {
    return (
      <AdminLayout>
        <div className="flex h-full items-center justify-center">
          <div className="text-orange-600 font-black animate-pulse uppercase tracking-widest">
            Chargement des microservices...
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-10">
        <h1 className="text-3xl font-black text-white uppercase italic">Tableau de bord</h1>
        <p className="text-slate-500">Résumé de l'activité globale en temps réel.</p>
      </div>

      {/* 3. Les Cartes KPIs avec les vraies données */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard 
          title="Membres" 
          value={stats?.totalUsers || 0} 
          icon={<Users size={24}/>} 
          trend="Inscrits" 
        />
        <StatCard 
          title="Événements" 
          value={stats?.totalEvents || 0} 
          icon={<Calendar size={24}/>} 
          trend="Total" 
        />
        <StatCard 
          title="Interactions" 
          value={stats?.totalInteractions || 0} 
          icon={<MessageSquare size={24}/>} 
          trend="Likes/Comms" 
        />
        <StatCard 
          title="Participation" 
          value={`${stats?.participationRate || 0}%`} 
          icon={<Activity size={24}/>} 
          trend="Taux" 
          trendColor={stats?.participationRate > 50 ? "text-emerald-500 bg-emerald-500/10" : "text-red-500 bg-red-500/10"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 4. Bloc Activité Récente (Inchangé pour l'instant) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-6">Dernières inscriptions</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center font-bold text-white uppercase">
                    {/* On pourra afficher l'initiale du vrai utilisateur plus tard */}
                    U
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">Utilisateur distant</p>
                    <p className="text-slate-500 text-xs">Vérifié via user-service</p>
                  </div>
                </div>
                <ArrowUpRight className="text-slate-600" size={18} />
              </div>
            ))}
          </div>
        </div>

        {/* 5. Bloc Catégories Dynamique (Manipulation de ton JSON) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-widest text-xs text-orange-600">Top Catégories</h2>
          <div className="space-y-5">
            {stats?.eventsByCategory && Object.entries(stats.eventsByCategory).map(([name, count]) => (
              <div key={name} className="space-y-2">
                <div className="flex justify-between items-center text-sm font-bold">
                  <span className="text-slate-300 uppercase text-xs">{name}</span>
                  <span className="text-white">{count}</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-orange-600 h-full transition-all duration-1000" 
                    style={{ width: `${(count / stats.totalEvents) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;