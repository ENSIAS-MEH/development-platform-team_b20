import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { TrendingUp, Heart, Map, Flame, Users, Loader2 } from 'lucide-react';
import { adminApi } from '../../services/api';

const Statistics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Palette de couleurs pour le graphique circulaire (Villes)
  const COLORS = ['#ea580c', '#3b82f6', '#a855f7', '#ec4899', '#10b981'];

  useEffect(() => {
    adminApi.getStats()
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur récupération statistiques:", err);
        setLoading(false);
      });
  }, []);

  // 1. Écran de chargement professionnel
  if (loading) return (
    <AdminLayout>
      <div className="flex flex-col h-[80vh] items-center justify-center gap-4">
        <Loader2 className="animate-spin text-orange-600" size={48} />
        <p className="text-slate-500 font-bold uppercase tracking-widest animate-pulse">Analyse des microservices...</p>
      </div>
    </AdminLayout>
  );

  // 2. Sécurité : Transformation des données (Zéro crash)
  const cityData = stats?.eventsByCity 
    ? Object.entries(stats.eventsByCity).map(([name, value]) => ({ name, value })) 
    : [];

  const categoryEntries = stats?.eventsByCategory ? Object.entries(stats.eventsByCategory) : [];
  const totalEvents = stats?.totalEvents || 1; // On met 1 pour éviter la division par zéro

  return (
    <AdminLayout>
      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">
          INTELLIGENCE & <span className="text-orange-600">STATS</span>
        </h1>
        <p className="text-slate-500 font-medium">Analyse réelle des performances de la plateforme.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10">
        
        {/* --- 1. COURBE DES INSCRIPTIONS (Simulation basée sur le total) --- */}
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl transition-all hover:border-slate-700/50">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-orange-600/10 rounded-lg"><TrendingUp className="text-orange-600" size={20} /></div>
            <h2 className="text-sm font-black text-slate-300 uppercase tracking-widest">Inscriptions Utilisateurs</h2>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[
                {n: 'Jan', c: 2}, 
                {n: 'Mar', c: 5}, 
                {n: 'Juin', c: stats?.totalUsers || 0}
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="n" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '16px' }} />
                <Line type="monotone" dataKey="c" stroke="#ea580c" strokeWidth={4} dot={{ r: 6, fill: '#ea580c', strokeWidth: 2, stroke: '#0f172a' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* --- 2. CATÉGORIES POPULAIRES (RÉEL) --- */}
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl transition-all hover:border-slate-700/50">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-orange-600/10 rounded-lg"><Flame className="text-orange-600" size={20} /></div>
            <h2 className="text-sm font-black text-slate-300 uppercase tracking-widest">Catégories Populaires</h2>
          </div>
          <div className="space-y-6">
            {categoryEntries.length > 0 ? categoryEntries.map(([name, count]) => (
              <div key={name}>
                <div className="flex justify-between mb-2">
                  <span className="text-slate-400 font-bold text-xs uppercase tracking-tighter">{name}</span>
                  <span className="text-white font-black text-sm">{Math.round((count / totalEvents) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-orange-600 rounded-full transition-all duration-1000" 
                    style={{ width: `${(count / totalEvents) * 100}%` }}
                  ></div>
                </div>
              </div>
            )) : <p className="text-slate-600 italic py-10 text-center">Aucune donnée catégorie...</p>}
          </div>
        </div>

        {/* --- 3. ÉVÉNEMENTS LES PLUS AIMÉS (RÉEL) --- */}
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl transition-all hover:border-slate-700/50">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-orange-600/10 rounded-lg"><Heart className="text-orange-600" size={20} /></div>
            <h2 className="text-sm font-black text-slate-300 uppercase tracking-widest">Événements les plus aimés</h2>
          </div>
          <div className="space-y-4">
            {stats?.topLikedEvents?.length > 0 ? stats.topLikedEvents.map((ev, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-950/40 rounded-2xl border border-slate-800/50 group hover:bg-slate-800/30 transition-all">
                <div className="flex flex-col">
                  <span className="text-white font-bold text-sm group-hover:text-orange-500 transition-colors">{ev.title || "Sans titre"}</span>
                  <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1 mt-1">
                    <Users size={10} /> {ev.participants || 0} participants
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-orange-600/10 px-3 py-1.5 rounded-xl border border-orange-600/20">
                  <Heart size={14} className="text-orange-600 fill-orange-600" />
                  <span className="text-orange-500 font-black text-sm">{ev.likes || 0}</span>
                </div>
              </div>
            )) : <p className="text-slate-600 italic py-10 text-center">Aucun like enregistré...</p>}
          </div>
        </div>

        {/* --- 4. RÉPARTITION PAR VILLE AVEC POURCENTAGES --- */}
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl transition-all hover:border-slate-700/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-600/10 rounded-lg"><Map className="text-orange-600" size={20} /></div>
              <h2 className="text-sm font-black text-slate-300 uppercase tracking-widest">Répartition par Ville</h2>
            </div>
            
            <div className="h-72"> {/* On augmente un peu la hauteur */}
              {cityData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={cityData} 
                      innerRadius={70} // On l'affine un peu
                      outerRadius={90} 
                      paddingAngle={5} 
                      dataKey="value"
                      stroke="none"
                      // FONCTION POUR AFFICHER LE % SUR LE GRAPHIQUE
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false} // On enlève les lignes pour un design plus propre
                    >
                      {cityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: '#fff' }} 
                      itemStyle={{ color: '#ea580c' }}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36} 
                      iconType="circle" 
                      wrapperStyle={{ fontSize: '10px', paddingTop: '20px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-slate-600 italic py-20 text-center">Données indisponibles...</p>
              )}
            </div>
        </div>

      </div>
    </AdminLayout>
  );
};

export default Statistics;