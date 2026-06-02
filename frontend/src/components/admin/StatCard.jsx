import React from 'react';

const StatCard = ({ title, value, icon, trend, trendColor }) => {
  return (
    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl hover:border-orange-600/50 transition-all group">
      <div className="flex justify-between items-start mb-4">
        {/* Icône avec cercle léger autour */}
        <div className="p-3 bg-slate-800 rounded-xl text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all">
          {icon}
        </div>
        {/* Tendance (ex: +12%) */}
        {trend && (
          <span className={`text-xs font-bold px-2 py-1 rounded-lg ${trendColor || 'text-emerald-500 bg-emerald-500/10'}`}>
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">{title}</p>
        <h3 className="text-3xl font-black text-white mt-1">{value}</h3>
      </div>
    </div>
  );
};

export default StatCard;