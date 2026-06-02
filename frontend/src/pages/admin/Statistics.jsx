import React from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Heart, Target, Flame, Users } from 'lucide-react';

const Statistics = () => {
  // 1. DATA : Inscriptions (Croissance)
  const enrollmentData = [
    { name: 'Jan', count: 400 }, { name: 'Fév', count: 700 },
    { name: 'Mar', count: 600 }, { name: 'Avr', count: 1200 },
    { name: 'Mai', count: 1800 }, { name: 'Juin', count: 2400 },
  ];

  // 2. DATA : Catégories actives
  const categoryData = [
    { name: 'Musique', value: 85, color: '#ea580c' },
    { name: 'Sport', value: 65, color: '#3b82f6' },
    { name: 'Tech', value: 45, color: '#a855f7' },
    { name: 'Culture', value: 30, color: '#ec4899' },
  ];

  // 3. DATA : Événements les plus aimés (TA DEMANDE)
  const topLikedEvents = [
    { title: "Rabat Startup Weekend", likes: 856, participants: 150 },
    { title: "Gnaoua Festival Tour", likes: 742, participants: 400 },
    { title: "Hackathon AI 2026", likes: 530, participants: 80 },
    { title: "Beach Volley Cup", likes: 312, participants: 45 },
  ];

  // 4. DATA : Intérêts populaires
  const topInterests = [
    { tag: "Gaming", count: "450 users", grow: "+15%" },
    { tag: "Networking", count: "320 users", grow: "+8%" },
    { tag: "Coding", count: "280 users", grow: "+22%" },
  ];

  return (
    <AdminLayout>
      {/* HEADER */}
      <div className="mb-10 animate-fade-in">
        <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">
          Intelligence & <span className="text-orange-600">Stats</span>
        </h1>
        <p className="text-slate-500 font-medium">Analyse des performances et tendances de la plateforme.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* --- GRAPHIQUE DES INSCRIPTIONS --- */}
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl transition-all hover:border-slate-700/50">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-orange-600/10 rounded-lg"><TrendingUp className="text-orange-600" size={20} /></div>
            <h2 className="text-sm font-black text-slate-300 uppercase tracking-widest">Inscriptions Utilisateurs</h2>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={enrollmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '16px', color: '#fff' }}
                  itemStyle={{ color: '#ea580c' }}
                />
                <Line type="monotone" dataKey="count" stroke="#ea580c" strokeWidth={4} dot={{ r: 6, fill: '#ea580c', strokeWidth: 2, stroke: '#0f172a' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* --- TOP CATÉGORIES --- */}
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl transition-all hover:border-slate-700/50">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-orange-600/10 rounded-lg"><Flame className="text-orange-600" size={20} /></div>
            <h2 className="text-sm font-black text-slate-300 uppercase tracking-widest">Catégories Populaires</h2>
          </div>
          <div className="space-y-6">
            {categoryData.map((cat) => (
              <div key={cat.name}>
                <div className="flex justify-between mb-2">
                  <span className="text-slate-400 font-bold text-xs uppercase tracking-tighter">{cat.name}</span>
                  <span className="text-white font-black text-sm">{cat.value}%</span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(234,88,12,0.3)]" 
                    style={{ width: `${cat.value}%`, backgroundColor: cat.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- ÉVÉNEMENTS LES PLUS AIMÉS (CORRIGÉ) --- */}
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl transition-all hover:border-slate-700/50">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-orange-600/10 rounded-lg"><Heart className="text-orange-600" size={20} /></div>
            <h2 className="text-sm font-black text-slate-300 uppercase tracking-widest">Événements les plus aimés</h2>
          </div>
          <div className="space-y-4">
            {topLikedEvents.map((ev, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-950/40 rounded-2xl border border-slate-800/50 hover:bg-slate-800/30 transition-colors group">
                <div className="flex flex-col">
                  <span className="text-white font-bold text-sm group-hover:text-orange-500 transition-colors">{ev.title}</span>
                  <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1 mt-1">
                    <Users size={10} /> {ev.participants} participants
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-orange-600/10 px-3 py-1.5 rounded-xl border border-orange-600/20">
                  <Heart size={14} className="text-orange-600 fill-orange-600" />
                  <span className="text-orange-500 font-black text-sm">{ev.likes}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- ANALYSE DES INTÉRÊTS --- */}
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl transition-all hover:border-slate-700/50">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-orange-600/10 rounded-lg"><Target className="text-orange-600" size={20} /></div>
            <h2 className="text-sm font-black text-slate-300 uppercase tracking-widest">Analyse des Intérêts</h2>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {topInterests.map((interest, i) => (
              <div key={i} className="flex items-center justify-between p-4 border border-slate-800 bg-slate-950/30 rounded-2xl hover:border-orange-600/30 transition-all">
                <div>
                  <p className="text-orange-500 font-black text-xs uppercase tracking-widest">{interest.tag}</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">{interest.count}</p>
                </div>
                <div className="text-right">
                   <span className="text-emerald-500 font-black text-xs">{interest.grow}</span>
                   <p className="text-[9px] text-slate-600 uppercase font-bold">Tendance</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};

export default Statistics;